import { chromium } from 'playwright';
import fs from 'node:fs';
const batch=Number(process.env.STRESS_BATCH||0);
const count=Number(process.env.STRESS_COUNT||1000);
const startRun=batch*count;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const browserErrors=[];
page.on('pageerror',e=>browserErrors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')browserErrors.push(`console: ${m.text()}`)});
await page.addInitScript(()=>localStorage.clear());
await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
await page.locator('button[data-begin]').click();
const summary=await page.evaluate(({startRun,count})=>{
 const TYPES=['bastion','arsenal','foundry','shrine'];
 const profiles=['aggressive','conservative','optimizer','casual','hoarder'];
 const stats=Object.fromEntries(profiles.map(k=>[k,{runs:0,completed:0,failed:0,defeats:0,attempts:0,events:0,levels:0,coin:0,iron:0,salvage:0}]));
 const regionAttempts=[0,0,0,0],regionWins=[0,0,0,0],invariants=[],deadlocks=[];
 const kingdomCoverage={bastion:0,arsenal:0,foundry:0,shrine:0,reclaimed:[0,0,0,0,0,0],levels:[0,0,0,0]};
 let guildRoundTrips=0,kingdomRoundTrips=0;
 function kingdomFor(run){
   const landCount=1+(run%6),plots=[];
   for(let i=0;i<6;i++){
     if(i>=landCount){plots.push({reclaimed:false,building:null,level:0});continue}
     const building=TYPES[(run+i)%4],level=1+((run+i*3)%3);
     plots.push({reclaimed:true,building,level});kingdomCoverage[building]++;kingdomCoverage.levels[level]++;
   }
   kingdomCoverage.reclaimed[landCount-1]++;
   return {version:1,plots,claims:{}};
 }
 function expectedBonus(k){const b={hp:0,atk:0,economy:0,resolve:0,warDefense:0,warStrike:0};for(const p of k.plots){if(!p.reclaimed||!p.building||!p.level)continue;if(p.building==='bastion'){b.hp+=12*p.level;b.warDefense+=8*p.level}if(p.building==='arsenal'){b.atk+=2*p.level;b.warStrike+=8*p.level}if(p.building==='foundry')b.economy+=8*p.level;if(p.building==='shrine')b.resolve+=5*p.level}return b}
 function equipBest(kind){const s=Game.state,score=i=>(i.atk||0)+(i.hp||0)/8+(i.set?(kind==='optimizer'?3:1):0)+({common:0,uncommon:1,rare:3,relic:5}[i.rarity]||0);for(const h of s.hunters)for(const slot of ['Weapon','Head','Armor','Charm']){const c=s.inventory.filter(i=>i.slot===slot&&(!i.owner||i.owner===h.name)).sort((a,b)=>score(b)-score(a))[0];if(c)Game.equip(c.id,h.name)}}
 function salvage(kind){if(kind==='casual'||kind==='hoarder')return;for(const i of [...Game.state.inventory])if(!i.owner&&i.rarity!=='relic'&&!i.set)Game.salvage(i.id)}
 function ensure(region,kind){const s=Game.state;equipBest(kind);salvage(kind);if(s.clears[0]&&Game.countEquipped()<1&&s.inventory[0])Game.equip(s.inventory[0].id,'Vanguard');if(s.clears[0]&&s.buildings.hall<2&&s.iron>=20)Game.upgrade('hall');if(s.clears[1]&&s.crafted<1&&s.iron>=14&&s.salvage>=8)Game.craft();if(region>=2&&kind==='optimizer'&&s.buildings.tower<2&&s.iron>=20)Game.upgrade('tower');if(region>=2&&kind==='conservative'&&s.buildings.infirmary<2&&s.iron>=20)Game.upgrade('infirmary');equipBest(kind)}
 function validate(run,kind,k,expected){const s=Game.state,b=KingdomV27.bonuses();if(s.coin<0||s.iron<0||s.salvage<0)invariants.push(`${run}:${kind}:negative resource`);if(s.clears.some(x=>x<0))invariants.push(`${run}:${kind}:negative clears`);if(k.plots.length!==6||!k.plots[0].reclaimed)invariants.push(`${run}:${kind}:invalid land sequence`);let sawLock=false;for(const p of k.plots){if(!p.reclaimed)sawLock=true;else if(sawLock)invariants.push(`${run}:${kind}:nonsequential reclaimed land`);if(p.level<0||p.level>3)invariants.push(`${run}:${kind}:invalid building level`)}for(const key of Object.keys(expected))if(b[key]!==expected[key])invariants.push(`${run}:${kind}:bonus ${key} expected ${expected[key]} got ${b[key]}`);for(const [slot,item] of Object.entries(s.equipped||{}))if(!s.inventory.some(x=>x.id===item.id))invariants.push(`${run}:${kind}:missing equipped item ${slot}`);if(s.wardenDefeated&&s.clears[3]<1)invariants.push(`${run}:${kind}:warden flag without clear`);const h=s.hunters[0],hs=Game.hunterStats(h);if(hs.hp<h.hp+expected.hp||hs.atk<h.atk+expected.atk)invariants.push(`${run}:${kind}:kingdom hunter stats not applied`)}
 for(let local=0;local<count;local++){
   const run=startRun+local,kind=profiles[run%profiles.length],st=stats[kind];st.runs++;
   const kingdom=kingdomFor(run),expected=expectedBonus(kingdom);KingdomV27.debugSetState(kingdom);
   if(run%25===0){const raw=JSON.parse(localStorage.getItem('bell-beneath-ash-kingdom-v27'));if(JSON.stringify(raw)!==JSON.stringify(kingdom))invariants.push(`${run}:${kind}:kingdom persistence mismatch`);else kingdomRoundTrips++}
   const gs={formed:true,name:`Stress ${run}`,xp:run%240,level:1+(run%8),contribution:run%600,wins:run%17,losses:run%9,war:{phase:'idle',assignments:{},attacks:3,score:0,enemyScore:0,log:[],resolved:false,rewarded:false}};GuildV23.save(gs);const gl=GuildV23.load();if(gl.name!==gs.name||gl.wins!==gs.wins||gl.losses!==gs.losses||gl.level!==gs.level)invariants.push(`${run}:${kind}:guild persistence mismatch`);else guildRoundTrips++;
   let s=Game.fresh();s.started=true;s.screen='inventory';Game.debugSetState(s);let complete=true;
   for(let region=0;region<4;region++){
     ensure(region,kind);if(!Game.regionOpen(region)){deadlocks.push(`${run}:${kind}:region${region}:gate`);complete=false;break}
     let cleared=false,tries=0;
     while(!cleared&&tries++<12){st.attempts++;regionAttempts[region]++;if(region>=2&&kind!=='aggressive'&&!Game.state.preparedKit&&Game.state.coin>=18)Game.packKit();const before=Game.state.clears[region];Game.depart(region);if(Game.state.screen==='event'){st.events++;const risk=kind==='aggressive'||(kind==='optimizer'&&Math.random()<.75)||(kind==='casual'&&Math.random()<.5);Game.resolveEvent(risk)}const ok=Game.debugBattle(kind==='hoarder'?'conservative':kind);if(!ok){deadlocks.push(`${run}:${kind}:region${region}:battle-loop`);complete=false;break}if(Game.state.clears[region]>before){regionWins[region]++;cleared=true;ensure(region,kind)}else{st.defeats++;ensure(Math.max(0,region-1),kind)}}
     if(!cleared){complete=false;break}
   }
   ensure(3,kind);validate(run,kind,kingdom,expected);s=Game.state;if(complete&&s.wardenDefeated)st.completed++;else st.failed++;st.coin+=s.coin;st.iron+=s.iron;st.salvage+=s.salvage;st.levels+=s.hunters.reduce((a,h)=>a+h.lv,0)/s.hunters.length;
 }
 for(const s of Object.values(stats)){s.completionRate=s.runs?+(100*s.completed/s.runs).toFixed(2):0;s.avgAttempts=s.runs?+(s.attempts/s.runs).toFixed(2):0;s.avgCoin=s.runs?+(s.coin/s.runs).toFixed(1):0;s.avgIron=s.runs?+(s.iron/s.runs).toFixed(1):0;s.avgSalvage=s.runs?+(s.salvage/s.runs).toFixed(1):0;s.avgLevel=s.runs?+(s.levels/s.runs).toFixed(2):0}
 return {startRun,count,runs:count,stats,regionAttempts,regionWins,invariantCount:invariants.length,invariants:invariants.slice(0,50),deadlockCount:deadlocks.length,deadlocks:deadlocks.slice(0,50),kingdomCoverage,guildRoundTrips,kingdomRoundTrips};
},{startRun,count});
summary.batch=batch;summary.browserErrors=browserErrors;
const out=`stress-10000-v28-batch-${batch}.json`;
fs.writeFileSync(out,JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
if(browserErrors.length||summary.invariantCount||summary.deadlockCount)process.exitCode=1;
await browser.close();
