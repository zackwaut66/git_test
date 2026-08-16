import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const errors=[];page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});
await page.addInitScript(()=>localStorage.clear());
await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
await page.screenshot({path:'audit-title.png'});
await page.locator('button[data-begin]').click();await page.screenshot({path:'audit-enclave.png'});
await page.locator('button[data-go="map"]').click();await page.screenshot({path:'audit-map.png'});
await page.evaluate(()=>Game.startBattle(0,{}));await page.screenshot({path:'audit-combat.png'});
await page.evaluate(()=>{Game.battle.enemies.forEach(e=>e.hp=0);Game.tick()});await page.screenshot({path:'audit-result.png'});
await page.getByRole('button',{name:/SECURE \d+ DROPS/}).click();await page.screenshot({path:'audit-inventory.png'});
const summary=await page.evaluate(()=>{
 const strategies=['aggressive','conservative','optimizer','casual'];
 const stats=Object.fromEntries(strategies.map(k=>[k,{runs:0,completed:0,failed:0,defeats:0,attempts:0,events:0,risky:0,finalCoin:0,finalIron:0,finalSalvage:0,items:0,set2:0,set4:0,levels:0}]));
 const regionAttempts=[0,0,0,0],regionWins=[0,0,0,0],stuck=[],invariants=[];
 function equipBest(kind){
   const s=Game.state,score=i=>(i.atk||0)+(i.hp||0)/8+(i.set?(kind==='optimizer'?3:1):0)+({common:0,uncommon:1,rare:3,relic:5}[i.rarity]||0);
   for(const h of s.hunters){for(const slot of ['Weapon','Head','Armor','Charm']){const c=s.inventory.filter(i=>i.slot===slot&&(!i.owner||i.owner===h.name)).sort((a,b)=>score(b)-score(a))[0];if(c)Game.equip(c.id,h.name)}}
 }
 function salvage(kind){if(kind==='casual')return;for(const i of [...Game.state.inventory])if(!i.owner&&i.rarity!=='relic'&&!i.set)Game.salvage(i.id)}
 function ensureProgress(region,kind){const s=Game.state;equipBest(kind);salvage(kind);if(s.clears[0]&&Game.countEquipped()<1&&s.inventory[0])Game.equip(s.inventory[0].id,'Vanguard');if(s.clears[0]&&s.buildings.hall<2&&s.iron>=20)Game.upgrade('hall');if(s.clears[1]&&s.crafted<1&&s.iron>=14&&s.salvage>=8)Game.craft();if(region>=2&&kind==='optimizer'&&s.buildings.tower<2&&s.iron>=20)Game.upgrade('tower');if(region>=2&&kind==='conservative'&&s.buildings.infirmary<2&&s.iron>=20)Game.upgrade('infirmary');equipBest(kind)}
 function validate(run,kind){const s=Game.state;if(s.coin<0||s.iron<0||s.salvage<0)invariants.push(`${run}:${kind}:negative resource`);if(s.clears.some(x=>x<0))invariants.push(`${run}:${kind}:negative clears`);for(const [k,i] of Object.entries(s.equipped)){if(!s.inventory.some(x=>x.id===i.id))invariants.push(`${run}:${kind}:missing equip ${k}`)}if(s.clears[3]>0&&Game.objective().n!==8)invariants.push(`${run}:${kind}:boss complete but objective ${Game.objective().n}`)}
 for(let run=0;run<1000;run++){
   const kind=strategies[run%4],st=stats[kind];st.runs++;let s=Game.fresh();s.started=true;s.screen='enclave';Game.debugSetState(s);let complete=true;
   for(let region=0;region<4;region++){
     ensureProgress(region,kind);if(!Game.regionOpen(region)){stuck.push(`${run}:${kind}:region${region}:gate`);complete=false;break}
     let cleared=false,tries=0;
     while(!cleared&&tries++<12){st.attempts++;regionAttempts[region]++;if(region>=2&&kind!=='aggressive'&&!Game.state.preparedKit&&Game.state.coin>=18)Game.packKit();const before=Game.state.clears[region];Game.depart(region);if(Game.state.screen==='event'){st.events++;const risk=kind==='aggressive'||kind==='optimizer'&&Math.random()<.75||kind==='casual'&&Math.random()<.5;if(risk)st.risky++;Game.resolveEvent(risk)}const ok=Game.debugBattle(kind);if(!ok){stuck.push(`${run}:${kind}:region${region}:loop`);complete=false;break}if(Game.state.clears[region]>before){regionWins[region]++;cleared=true;ensureProgress(region,kind)}else{st.defeats++;ensureProgress(Math.max(0,region-1),kind)}}
     if(!cleared){complete=false;break}
   }
   ensureProgress(3,kind);validate(run,kind);s=Game.state;if(complete&&s.wardenDefeated)st.completed++;else st.failed++;st.finalCoin+=s.coin;st.finalIron+=s.iron;st.finalSalvage+=s.salvage;st.items+=s.inventory.length;const ap=Game.setCount('Ashen Pilgrim'),mw=Game.setCount('Mourning Watch');if(ap>=2||mw>=2)st.set2++;if(ap>=4||mw>=4)st.set4++;st.levels+=s.hunters.reduce((a,h)=>a+h.lv,0)/s.hunters.length;
 }
 for(const st of Object.values(stats)){st.completionRate=+(100*st.completed/st.runs).toFixed(1);st.avgAttempts=+(st.attempts/st.runs).toFixed(2);st.avgCoin=+(st.finalCoin/st.runs).toFixed(1);st.avgIron=+(st.finalIron/st.runs).toFixed(1);st.avgSalvage=+(st.finalSalvage/st.runs).toFixed(1);st.avgItems=+(st.items/st.runs).toFixed(1);st.set2Rate=+(100*st.set2/st.runs).toFixed(1);st.set4Rate=+(100*st.set4/st.runs).toFixed(1);st.avgLevel=+(st.levels/st.runs).toFixed(2)}
 return {runs:1000,stats,regionAttempts,regionWins,stuckCount:stuck.length,stuck:stuck.slice(0,20),invariantCount:invariants.length,invariants:invariants.slice(0,20)};
});
summary.browserErrors=errors;fs.writeFileSync('audit-1000-results.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));if(errors.length||summary.stuckCount||summary.invariantCount)process.exitCode=1;await browser.close();
