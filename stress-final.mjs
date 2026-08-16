import { chromium } from 'playwright';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
page.setDefaultTimeout(0);
const browserErrors=[];
page.on('pageerror',e=>browserErrors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')browserErrors.push(`console: ${m.text()}`)});

await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});

const summary=await page.evaluate(()=>{
  const RUNS=10000;
  const strategies=['aggressive','conservative','optimizer','casual','hoarder'];
  const stats=Object.fromEntries(strategies.map(k=>[k,{runs:0,completed:0,failed:0,defeats:0,attempts:0,events:0,risky:0,items:0,set2:0,set4:0,finalCoin:0,finalIron:0,finalSalvage:0}]));
  const regionAttempts=[0,0,0,0],regionWins=[0,0,0,0];
  const eventTitles=new Set(),encounters=[new Set(),new Set(),new Set(),new Set()],lootNames=new Set(),affixes=new Set();
  const stuck=[],invariants=[];

  function score(i,kind){return (i.atk||0)+(i.hp||0)/8+(i.set?(kind==='optimizer'?4:kind==='hoarder'?2:1):0)+({common:0,uncommon:1,rare:3,relic:6}[i.rarity]||0)}
  function equipBest(kind){
    const s=Game.state;
    for(const h of s.hunters){
      for(const slot of ['Weapon','Head','Armor','Charm']){
        const c=s.inventory.filter(i=>i.slot===slot&&(!i.owner||i.owner===h.name)).sort((a,b)=>score(b,kind)-score(a,kind))[0];
        if(c)Game.equip(c.id,h.name);
      }
    }
  }
  function cleanup(kind){
    if(kind==='casual'||kind==='hoarder')return;
    for(const i of [...Game.state.inventory])if(!i.owner&&i.rarity!=='relic'&&!i.set)Game.salvage(i.id);
  }
  function ensureProgress(region,kind){
    const s=Game.state;
    equipBest(kind);cleanup(kind);
    if(s.clears[0]&&Game.countEquipped()<1&&s.inventory[0])Game.equip(s.inventory[0].id,'Vanguard');
    if(s.clears[0]&&s.buildings.hall<2&&s.iron>=20)Game.upgrade('hall');
    if(s.clears[1]&&s.crafted<1&&s.iron>=14&&s.salvage>=8)Game.craft();
    if(region>=2&&kind==='optimizer'&&s.buildings.tower<2&&s.iron>=20)Game.upgrade('tower');
    if(region>=2&&kind==='conservative'&&s.buildings.infirmary<2&&s.iron>=20)Game.upgrade('infirmary');
    if(region>=2&&kind==='hoarder'&&s.buildings.forge<2&&s.iron>=20)Game.upgrade('forge');
    equipBest(kind);
  }
  function validate(tag){
    const s=Game.state;
    const nums=[s.coin,s.iron,s.salvage,...s.clears,...s.hunters.flatMap(h=>[h.lv,h.xp])];
    if(nums.some(x=>!Number.isFinite(x)))invariants.push(`${tag}:nonfinite number`);
    if(s.coin<0||s.iron<0||s.salvage<0)invariants.push(`${tag}:negative resource`);
    if(s.clears.some(x=>x<0))invariants.push(`${tag}:negative clear`);
    const ids=s.inventory.map(i=>i.id);
    if(new Set(ids).size!==ids.length)invariants.push(`${tag}:duplicate item id`);
    for(const [k,i] of Object.entries(s.equipped)){
      const [owner,slot]=k.split(':');
      const inv=s.inventory.find(x=>x.id===i.id);
      if(!inv)invariants.push(`${tag}:equipped item missing from inventory`);
      else if(inv.owner!==owner||inv.slot!==slot)invariants.push(`${tag}:equip ownership mismatch`);
    }
    for(const i of s.inventory){
      if(i.owner){const e=s.equipped[`${i.owner}:${i.slot}`];if(!e||e.id!==i.id)invariants.push(`${tag}:owned item lacks equip mapping`)}
    }
    if(s.clears[3]>0&&(!s.wardenDefeated||Game.objective().n!==8))invariants.push(`${tag}:completed boss state inconsistent`);
  }

  for(let run=0;run<RUNS;run++){
    const kind=strategies[run%strategies.length],st=stats[kind];st.runs++;
    const s=Game.fresh();s.started=true;s.screen='enclave';Game.debugSetState(s);
    let complete=true;
    for(let region=0;region<4;region++){
      ensureProgress(region,kind);
      if(!Game.regionOpen(region)){stuck.push(`${run}:${kind}:region${region}:gate`);complete=false;break}
      let cleared=false,tries=0;
      while(!cleared&&tries++<14){
        st.attempts++;regionAttempts[region]++;
        if(region>=2&&kind!=='aggressive'&&!Game.state.preparedKit&&Game.state.coin>=18)Game.packKit();
        const before=Game.state.clears[region];
        Game.depart(region);
        if(Game.state.screen==='event'){
          st.events++;
          const t=document.querySelector('.eventcopy h1')?.textContent?.trim();if(t)eventTitles.add(t);
          const risk=kind==='aggressive'||kind==='optimizer'&&Math.random()<.75||kind==='casual'&&Math.random()<.5||kind==='hoarder'&&Math.random()<.62;
          if(risk)st.risky++;
          Game.resolveEvent(risk);
        }
        if(Game.battle)encounters[region].add(Game.battle.enemies.map(e=>e.name).join('|'));
        const ok=Game.debugBattle(kind==='hoarder'?'optimizer':kind);
        if(!ok){stuck.push(`${run}:${kind}:region${region}:combat-loop`);complete=false;break}
        if(Game.state.clears[region]>before){
          regionWins[region]++;cleared=true;
          for(const i of Game.state.lastDrops){lootNames.add(i.name);affixes.add(i.affix)}
          ensureProgress(region,kind);
        }else{st.defeats++;ensureProgress(Math.max(0,region-1),kind)}
      }
      if(!cleared){complete=false;break}
    }
    ensureProgress(3,kind);validate(`${run}:${kind}`);
    const end=Game.state;
    if(complete&&end.wardenDefeated)st.completed++;else st.failed++;
    st.finalCoin+=end.coin;st.finalIron+=end.iron;st.finalSalvage+=end.salvage;st.items+=end.inventory.length;
    const ap=Game.setCount('Ashen Pilgrim'),mw=Game.setCount('Mourning Watch');if(ap>=2||mw>=2)st.set2++;if(ap>=4||mw>=4)st.set4++;
  }

  // Inventory/economy mutation torture: repeated dense stores, equips, salvage, crafting and upgrades.
  for(let n=0;n<500;n++){
    const s=Game.fresh();s.started=true;s.screen='inventory';s.coin=2000;s.iron=2000;s.salvage=1000;Game.debugSetState(s);
    for(let i=0;i<48;i++)Game.state.inventory.push(Game.makeItem(i%4,{minimum:i%5===0?'uncommon':undefined}));
    equipBest(n%2?'optimizer':'hoarder');
    for(const i of [...Game.state.inventory])if(!i.owner&&Math.random()<.55)Game.salvage(i.id);
    for(let c=0;c<12;c++)Game.craft();
    for(const b of ['hall','forge','infirmary','tower']){Game.upgrade(b);Game.upgrade(b)}
    equipBest('optimizer');Game.save();validate(`mutation${n}`);
  }

  for(const st of Object.values(stats)){
    st.completionRate=+(100*st.completed/st.runs).toFixed(2);
    st.avgAttempts=+(st.attempts/st.runs).toFixed(2);
    st.avgItems=+(st.items/st.runs).toFixed(2);
    st.set2Rate=+(100*st.set2/st.runs).toFixed(2);
    st.set4Rate=+(100*st.set4/st.runs).toFixed(2);
    st.avgCoin=+(st.finalCoin/st.runs).toFixed(1);
    st.avgIron=+(st.finalIron/st.runs).toFixed(1);
    st.avgSalvage=+(st.finalSalvage/st.runs).toFixed(1);
  }
  const regionWinRates=regionWins.map((w,i)=>+(100*w/regionAttempts[i]).toFixed(2));
  return {
    runs:RUNS,stats,regionAttempts,regionWins,regionWinRates,
    eventCoverage:[...eventTitles].sort(),eventCoverageCount:eventTitles.size,
    encounterCoverage:encounters.map(x=>[...x].sort()),encounterCoverageCounts:encounters.map(x=>x.size),
    lootNameCoverageCount:lootNames.size,affixCoverageCount:affixes.size,
    stuckCount:stuck.length,stuck:stuck.slice(0,30),invariantCount:invariants.length,invariants:invariants.slice(0,30)
  };
});

// Persistence soak: preserve one nontrivial save across repeated full page reloads.
const fingerprint=await page.evaluate(()=>{
  const s=Game.fresh();s.started=true;s.screen='inventory';s.coin=777;s.iron=333;s.salvage=111;s.clears=[2,1,1,0];s.buildings.hall=2;s.crafted=1;Game.debugSetState(s);
  for(let i=0;i<24;i++)Game.state.inventory.push(Game.makeItem(i%4,{}));
  Game.equip(Game.state.inventory[0].id,'Vanguard');Game.save();
  return {coin:Game.state.coin,iron:Game.state.iron,salvage:Game.state.salvage,inventory:Game.state.inventory.length,equipped:Game.countEquipped(),first:Game.state.inventory[0].id,screen:Game.state.screen};
});
let persistenceFailures=0;
for(let i=0;i<75;i++){
  await page.reload({waitUntil:'domcontentloaded'});
  const f=await page.evaluate(()=>({coin:Game.state.coin,iron:Game.state.iron,salvage:Game.state.salvage,inventory:Game.state.inventory.length,equipped:Game.countEquipped(),first:Game.state.inventory[0]?.id,screen:Game.state.screen}));
  if(JSON.stringify(f)!==JSON.stringify(fingerprint))persistenceFailures++;
}

// Repeated real-DOM navigation/input soak on the mobile viewport.
await page.evaluate(()=>Game.reset());
await page.locator('button[data-begin]').click();
for(let i=0;i<150;i++){
  for(const s of ['hunters','map','inventory','enclave'])await page.locator(`button[data-go="${s}"]`).last().click();
}
await page.locator('button[data-go="map"]').last().click();
await page.locator('button[data-region="0"]').click();
if(await page.locator('.eventview').count())await page.locator('button[data-event="safe"]').click();
await page.locator('.battleview').waitFor();
await page.screenshot({path:'final-stress-combat.png'});

summary.persistenceReloads=75;
summary.persistenceFailures=persistenceFailures;
summary.uiNavigationClicks=600;
summary.browserErrors=browserErrors;
summary.pass=browserErrors.length===0&&summary.stuckCount===0&&summary.invariantCount===0&&persistenceFailures===0&&summary.eventCoverageCount===9&&summary.encounterCoverageCounts.every(x=>x>=3)&&summary.lootNameCoverageCount>=30&&summary.affixCoverageCount===12&&summary.regionWinRates.every(x=>x>=45)&&Object.values(summary.stats).reduce((a,s)=>a+s.completed,0)>=8800;

fs.writeFileSync('final-stress-results.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
if(!summary.pass)process.exitCode=1;
await browser.close();
