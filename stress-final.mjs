import { chromium } from 'playwright';
import fs from 'node:fs';

const TOTAL_RUNS=10000;
const BATCH_SIZE=500;
const strategies=['aggressive','conservative','optimizer','casual','hoarder'];
const blank=()=>({runs:0,completed:0,failed:0,defeats:0,attempts:0,events:0,risky:0,items:0,set2:0,set4:0,finalCoin:0,finalIron:0,finalSalvage:0});
const summary={
  runs:TOTAL_RUNS,
  stats:Object.fromEntries(strategies.map(k=>[k,blank()])),
  regionAttempts:[0,0,0,0],regionWins:[0,0,0,0],
  eventCoverage:new Set(),encounterCoverage:[new Set(),new Set(),new Set(),new Set()],
  lootNames:new Set(),affixes:new Set(),stuck:[],invariants:[]
};

const browser=await chromium.launch({headless:true});
let page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
page.setDefaultTimeout(0);
const browserErrors=[];
const wireErrors=()=>{
  page.on('pageerror',e=>browserErrors.push(`pageerror: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')browserErrors.push(`console: ${m.text()}`)});
};
wireErrors();

async function cleanLoad(){
  await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'domcontentloaded'});
}
await cleanLoad();

function mergeBatch(out){
  for(const k of strategies)for(const key of Object.keys(summary.stats[k]))summary.stats[k][key]+=out.stats[k][key];
  for(let i=0;i<4;i++){summary.regionAttempts[i]+=out.regionAttempts[i];summary.regionWins[i]+=out.regionWins[i];for(const x of out.encounterCoverage[i])summary.encounterCoverage[i].add(x)}
  for(const x of out.eventCoverage)summary.eventCoverage.add(x);
  for(const x of out.lootNames)summary.lootNames.add(x);
  for(const x of out.affixes)summary.affixes.add(x);
  summary.stuck.push(...out.stuck.slice(0,Math.max(0,40-summary.stuck.length)));
  summary.invariants.push(...out.invariants.slice(0,Math.max(0,40-summary.invariants.length)));
}

for(let offset=0;offset<TOTAL_RUNS;offset+=BATCH_SIZE){
  if(offset){await page.reload({waitUntil:'domcontentloaded'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'})}
  const out=await page.evaluate(({offset,count})=>{
    const strategies=['aggressive','conservative','optimizer','casual','hoarder'];
    const stats=Object.fromEntries(strategies.map(k=>[k,{runs:0,completed:0,failed:0,defeats:0,attempts:0,events:0,risky:0,items:0,set2:0,set4:0,finalCoin:0,finalIron:0,finalSalvage:0}]));
    const regionAttempts=[0,0,0,0],regionWins=[0,0,0,0];
    const eventTitles=new Set(),encounters=[new Set(),new Set(),new Set(),new Set()],lootNames=new Set(),affixes=new Set();
    const stuck=[],invariants=[];
    function score(i,kind){return (i.atk||0)+(i.hp||0)/8+(i.set?(kind==='optimizer'?4:kind==='hoarder'?2:1):0)+({common:0,uncommon:1,rare:3,relic:6}[i.rarity]||0)}
    function equipBest(kind){const s=Game.state;for(const h of s.hunters)for(const slot of ['Weapon','Head','Armor','Charm']){const c=s.inventory.filter(i=>i.slot===slot&&(!i.owner||i.owner===h.name)).sort((a,b)=>score(b,kind)-score(a,kind))[0];if(c)Game.equip(c.id,h.name)}}
    function cleanup(kind){if(kind==='casual'||kind==='hoarder')return;for(const i of [...Game.state.inventory])if(!i.owner&&i.rarity!=='relic'&&!i.set)Game.salvage(i.id)}
    function ensureProgress(region,kind){const s=Game.state;equipBest(kind);cleanup(kind);if(s.clears[0]&&Game.countEquipped()<1&&s.inventory[0])Game.equip(s.inventory[0].id,'Vanguard');if(s.clears[0]&&s.buildings.hall<2&&s.iron>=20)Game.upgrade('hall');if(s.clears[1]&&s.crafted<1&&s.iron>=14&&s.salvage>=8)Game.craft();if(region>=2&&kind==='optimizer'&&s.buildings.tower<2&&s.iron>=20)Game.upgrade('tower');if(region>=2&&kind==='conservative'&&s.buildings.infirmary<2&&s.iron>=20)Game.upgrade('infirmary');if(region>=2&&kind==='hoarder'&&s.buildings.forge<2&&s.iron>=20)Game.upgrade('forge');equipBest(kind)}
    function validate(tag){const s=Game.state,nums=[s.coin,s.iron,s.salvage,...s.clears,...s.hunters.flatMap(h=>[h.lv,h.xp])];if(nums.some(x=>!Number.isFinite(x)))invariants.push(`${tag}:nonfinite number`);if(s.coin<0||s.iron<0||s.salvage<0)invariants.push(`${tag}:negative resource`);if(s.clears.some(x=>x<0))invariants.push(`${tag}:negative clear`);const ids=s.inventory.map(i=>i.id);if(new Set(ids).size!==ids.length)invariants.push(`${tag}:duplicate item id`);for(const [k,i] of Object.entries(s.equipped)){const [owner,slot]=k.split(':'),inv=s.inventory.find(x=>x.id===i.id);if(!inv)invariants.push(`${tag}:equipped item missing`);else if(inv.owner!==owner||inv.slot!==slot)invariants.push(`${tag}:equip mapping mismatch`)}for(const i of s.inventory)if(i.owner){const e=s.equipped[`${i.owner}:${i.slot}`];if(!e||e.id!==i.id)invariants.push(`${tag}:owned item mapping missing`)}if(s.clears[3]>0&&(!s.wardenDefeated||Game.objective().n!==8))invariants.push(`${tag}:boss state inconsistent`)}
    for(let n=0;n<count;n++){
      const run=offset+n,kind=strategies[run%strategies.length],st=stats[kind];st.runs++;
      const s=Game.fresh();s.started=true;s.screen='enclave';Game.debugSetState(s);let complete=true;
      for(let region=0;region<4;region++){
        ensureProgress(region,kind);if(!Game.regionOpen(region)){stuck.push(`${run}:${kind}:region${region}:gate`);complete=false;break}
        let cleared=false,tries=0;
        while(!cleared&&tries++<14){
          st.attempts++;regionAttempts[region]++;if(region>=2&&kind!=='aggressive'&&!Game.state.preparedKit&&Game.state.coin>=18)Game.packKit();const before=Game.state.clears[region];Game.depart(region);
          if(Game.state.screen==='event'){st.events++;const t=document.querySelector('.eventcopy h1')?.textContent?.trim();if(t)eventTitles.add(t);const risk=kind==='aggressive'||kind==='optimizer'&&Math.random()<.75||kind==='casual'&&Math.random()<.5||kind==='hoarder'&&Math.random()<.62;if(risk)st.risky++;Game.resolveEvent(risk)}
          if(Game.battle)encounters[region].add(Game.battle.enemies.map(e=>e.name).join('|'));
          const ok=Game.debugBattle(kind==='hoarder'?'optimizer':kind);if(!ok){stuck.push(`${run}:${kind}:region${region}:combat-loop`);complete=false;break}
          if(Game.state.clears[region]>before){regionWins[region]++;cleared=true;for(const i of Game.state.lastDrops){lootNames.add(i.name);affixes.add(i.affix)}ensureProgress(region,kind)}else{st.defeats++;ensureProgress(Math.max(0,region-1),kind)}
        }
        if(!cleared){complete=false;break}
      }
      ensureProgress(3,kind);validate(`${run}:${kind}`);const end=Game.state;if(complete&&end.wardenDefeated)st.completed++;else st.failed++;st.finalCoin+=end.coin;st.finalIron+=end.iron;st.finalSalvage+=end.salvage;st.items+=end.inventory.length;const ap=Game.setCount('Ashen Pilgrim'),mw=Game.setCount('Mourning Watch');if(ap>=2||mw>=2)st.set2++;if(ap>=4||mw>=4)st.set4++;
    }
    return {stats,regionAttempts,regionWins,eventCoverage:[...eventTitles],encounterCoverage:encounters.map(x=>[...x]),lootNames:[...lootNames],affixes:[...affixes],stuck,invariants};
  },{offset,count:Math.min(BATCH_SIZE,TOTAL_RUNS-offset)});
  mergeBatch(out);
  console.log(`stress batch ${offset/BATCH_SIZE+1}/${TOTAL_RUNS/BATCH_SIZE} complete`);
}

// Dedicated discovery-event coverage: progression normally leaves the Farmstead after its first clear,
// so explicitly revisit all three non-boss regions and validate every authored discovery event.
await page.reload({waitUntil:'domcontentloaded'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
const dedicatedEvents=await page.evaluate(()=>{
  const titles=new Set();
  for(let region=0;region<3;region++){
    for(let n=0;n<250;n++){
      const s=Game.fresh();
      s.started=true;
      s.screen='map';
      s.clears=[1,1,1,0];
      s.buildings.hall=2;
      s.buildings.tower=3;
      s.crafted=1;
      Game.debugSetState(s);
      Game.depart(region);
      if(Game.state.screen==='event'){
        const title=document.querySelector('.eventcopy h1')?.textContent?.trim();
        if(title)titles.add(title);
        Game.resolveEvent(false);
        if(Game.battle)Game.go('map');
      }else if(Game.battle){
        Game.go('map');
      }
    }
  }
  return [...titles];
});
for(const title of dedicatedEvents)summary.eventCoverage.add(title);

// Inventory/economy mutation torture in disposable batches to avoid masking memory leaks as test-harness exhaustion.
for(let batch=0;batch<10;batch++){
  await page.reload({waitUntil:'domcontentloaded'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});
  const inv=await page.evaluate(({batch})=>{
    const errors=[];
    function score(i){return (i.atk||0)+(i.hp||0)/8+(i.set?4:0)}
    function equipBest(){const s=Game.state;for(const h of s.hunters)for(const slot of ['Weapon','Head','Armor','Charm']){const c=s.inventory.filter(i=>i.slot===slot&&(!i.owner||i.owner===h.name)).sort((a,b)=>score(b)-score(a))[0];if(c)Game.equip(c.id,h.name)}}
    function validate(tag){const s=Game.state,ids=s.inventory.map(i=>i.id);if(new Set(ids).size!==ids.length)errors.push(`${tag}:duplicate id`);if(s.coin<0||s.iron<0||s.salvage<0)errors.push(`${tag}:negative resource`);for(const [k,i] of Object.entries(s.equipped)){const [owner,slot]=k.split(':'),inv=s.inventory.find(x=>x.id===i.id);if(!inv||inv.owner!==owner||inv.slot!==slot)errors.push(`${tag}:equip mismatch`)}}
    for(let n=0;n<50;n++){const s=Game.fresh();s.started=true;s.screen='inventory';s.coin=2000;s.iron=2000;s.salvage=1000;Game.debugSetState(s);for(let i=0;i<48;i++)Game.state.inventory.push(Game.makeItem(i%4,{minimum:i%5===0?'uncommon':undefined}));equipBest();for(const i of [...Game.state.inventory])if(!i.owner&&Math.random()<.55)Game.salvage(i.id);for(let c=0;c<12;c++)Game.craft();for(const b of ['hall','forge','infirmary','tower']){Game.upgrade(b);Game.upgrade(b)}equipBest();Game.save();validate(`mutation${batch*50+n}`)}
    return errors;
  },{batch});
  summary.invariants.push(...inv.slice(0,Math.max(0,40-summary.invariants.length)));
}

// Persistence soak across actual reloads.
await page.reload({waitUntil:'domcontentloaded'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});
const fingerprint=await page.evaluate(()=>{const s=Game.fresh();s.started=true;s.screen='inventory';s.coin=777;s.iron=333;s.salvage=111;s.clears=[2,1,1,0];s.buildings.hall=2;s.crafted=1;Game.debugSetState(s);for(let i=0;i<24;i++)Game.state.inventory.push(Game.makeItem(i%4,{}));Game.equip(Game.state.inventory[0].id,'Vanguard');Game.save();return {coin:Game.state.coin,iron:Game.state.iron,salvage:Game.state.salvage,inventory:Game.state.inventory.length,equipped:Game.countEquipped(),first:Game.state.inventory[0].id,screen:Game.state.screen}});
let persistenceFailures=0;
for(let i=0;i<75;i++){await page.reload({waitUntil:'domcontentloaded'});const f=await page.evaluate(()=>({coin:Game.state.coin,iron:Game.state.iron,salvage:Game.state.salvage,inventory:Game.state.inventory.length,equipped:Game.countEquipped(),first:Game.state.inventory[0]?.id,screen:Game.state.screen}));if(JSON.stringify(f)!==JSON.stringify(fingerprint))persistenceFailures++}

// Real DOM/input soak.
await page.evaluate(()=>Game.reset());await page.locator('button[data-begin]').click();
for(let i=0;i<150;i++)for(const s of ['hunters','map','inventory','enclave'])await page.locator(`button[data-go="${s}"]`).last().click();
await page.locator('button[data-go="map"]').last().click();await page.locator('button[data-region="0"]').click();if(await page.locator('.eventview').count())await page.locator('button[data-event="safe"]').click();await page.locator('.battleview').waitFor();await page.screenshot({path:'final-stress-combat.png'});

for(const st of Object.values(summary.stats)){st.completionRate=+(100*st.completed/st.runs).toFixed(2);st.avgAttempts=+(st.attempts/st.runs).toFixed(2);st.avgItems=+(st.items/st.runs).toFixed(2);st.set2Rate=+(100*st.set2/st.runs).toFixed(2);st.set4Rate=+(100*st.set4/st.runs).toFixed(2);st.avgCoin=+(st.finalCoin/st.runs).toFixed(1);st.avgIron=+(st.finalIron/st.runs).toFixed(1);st.avgSalvage=+(st.finalSalvage/st.runs).toFixed(1)}
summary.regionWinRates=summary.regionWins.map((w,i)=>+(100*w/summary.regionAttempts[i]).toFixed(2));
summary.eventCoverage=[...summary.eventCoverage].sort();summary.eventCoverageCount=summary.eventCoverage.length;
summary.encounterCoverage=summary.encounterCoverage.map(x=>[...x].sort());summary.encounterCoverageCounts=summary.encounterCoverage.map(x=>x.length);
summary.lootNameCoverageCount=summary.lootNames.size;summary.affixCoverageCount=summary.affixes.size;delete summary.lootNames;delete summary.affixes;
summary.stuckCount=summary.stuck.length;summary.invariantCount=summary.invariants.length;summary.persistenceReloads=75;summary.persistenceFailures=persistenceFailures;summary.uiNavigationClicks=600;summary.browserErrors=browserErrors;
const completed=Object.values(summary.stats).reduce((a,s)=>a+s.completed,0);
summary.pass=browserErrors.length===0&&summary.stuckCount===0&&summary.invariantCount===0&&persistenceFailures===0&&summary.eventCoverageCount===9&&summary.encounterCoverageCounts.every(x=>x>=3)&&summary.lootNameCoverageCount>=30&&summary.affixCoverageCount===12&&summary.regionWinRates.every(x=>x>=45)&&completed>=8800;
fs.writeFileSync('final-stress-results.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
if(!summary.pass)process.exitCode=1;
await browser.close();
