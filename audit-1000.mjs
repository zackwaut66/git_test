import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
const browserErrors=[];
page.on('pageerror',e=>browserErrors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')browserErrors.push(`console: ${m.text()}`)});

await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
await page.waitForTimeout(500);
await page.screenshot({path:'audit-tutorial.png',fullPage:true});
const enter=page.getByRole('button',{name:'ENTER THE ENCLAVE',exact:true});
if(await enter.count()) await enter.click();
await page.waitForTimeout(100);
await page.screenshot({path:'audit-enclave.png',fullPage:true});
await page.getByRole('button',{name:'MARCHES',exact:true}).click();
await page.waitForTimeout(100);
await page.screenshot({path:'audit-map.png',fullPage:true});
await page.evaluate(()=>start(0));
await page.waitForTimeout(100);
await page.screenshot({path:'audit-combat.png',fullPage:true});
await page.evaluate(()=>{clearTimeout(timer);battle.enemies.forEach(e=>e.hp=0);win()});
await page.waitForTimeout(100);
await page.screenshot({path:'audit-result.png',fullPage:true});
const secure=page.getByRole('button',{name:'SECURE LOOT',exact:true});
if(await secure.count()) await secure.click();
await page.waitForTimeout(100);
await page.screenshot({path:'audit-inventory.png',fullPage:true});

const summary=await page.evaluate(()=>{
  const seed=JSON.parse(JSON.stringify(S));
  const original={render,save,toast,setTimeout:window.setTimeout,clearTimeout:window.clearTimeout};
  render=()=>{};save=()=>{};toast=()=>{};window.setTimeout=()=>0;window.clearTimeout=()=>{};
  const strategies=['aggressive','conservative','optimizer','casual'];
  const stats=Object.fromEntries(strategies.map(x=>[x,{runs:0,completed:0,failed:0,totalAttempts:0,defeats:0,events:0,riskyEvents:0,finalCoin:0,finalIron:0,finalSalvage:0,items:0,setPieces:0,set2:0,set4:0,objectiveComplete:0,levels:0,wardenAttempts:0}]));
  const regionAttempts=[0,0,0,0],regionWins=[0,0,0,0],stuck=[],invariants=[];
  function deep(x){return JSON.parse(JSON.stringify(x))}
  function alive(a){return a.filter(x=>x.hp>0)}
  function priorityTarget(){
    if(!battle)return;
    const p={bell:9,rifleman:8,spotter:7,servitor:6,warden:5,reaver:4,husk:3,feral:2,lurker:2,thrall:1};
    let best=-1,score=-1;battle.enemies.forEach((e,i)=>{if(e.hp>0&&(p[e.cls]||0)>score){score=p[e.cls]||0;best=i}});if(best>=0)battle.target=best;
  }
  function battleBot(kind){
    let loops=0;
    while(battle&&S.screen==='battle'&&loops++<180){
      priorityTarget();
      const party=alive(battle.party),w=party.slice().sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];
      const physician=party.some(x=>x.name==='Physician'),duelist=party.some(x=>x.name==='Duelist'),vanguard=party.some(x=>x.name==='Vanguard');
      const danger=battle.node>=2;
      if(physician&&w&&w.hp/w.max<(kind==='conservative'?.62:.42)&&battle.resolve>=35) ability('heal');
      else if(vanguard&&battle.guard<=0&&battle.resolve>=25&&(kind==='conservative'||kind==='optimizer'&&danger)) ability('guard');
      else if(duelist&&battle.resolve>=40&&battle.enemies[battle.target]?.hp>45) ability('sever');
      else if(battle.resolve>=30) ability('focus');
      if(!battle||S.screen!=='battle')break;
      tick();
    }
    if(battle&&S.screen==='battle')return false;
    return true;
  }
  function itemScore(i,kind){return (i.atk||0)+(i.set==='Ashen Pilgrim'?(kind==='optimizer'?5:2):0)+(i.rarity==='relic'?2:0)}
  function equipBest(kind){
    const hunters=S.hunters.map(h=>h.n),slots=['Weapon','Head','Armor','Charm'];
    for(const slot of slots){
      const items=S.inventory.filter(i=>i.slot===slot).sort((a,b)=>itemScore(b,kind)-itemScore(a,kind));
      for(let n=0;n<Math.min(hunters.length,items.length);n++) equipTo(items[n].id,hunters[n]);
    }
  }
  function salvageExtras(kind){
    if(kind==='casual')return;
    const keep=new Set(Object.values(S.equipped||{}).map(i=>i.id));
    const extras=S.inventory.filter(i=>!keep.has(i.id));
    for(const i of extras){if(i.rarity!=='relic')salv(i.id)}
  }
  function tryClaims(){for(let i=0;i<8;i++){const before=S.objectiveStep;claimObjective();if(S.objectiveStep===before)break}}
  function prepareProgress(kind,region){
    equipBest(kind);salvageExtras(kind);tryClaims();
    if(S.buildings.hall<2&&S.iron>=20)upgrade('hall');
    tryClaims();
    if(region>=1&&S.craftedItems<1&&S.iron>=12&&S.salvage>=10){forgeCraft();equipBest(kind);tryClaims()}
    if(region>=1&&kind!=='aggressive'&&S.buildings.infirmary<2&&S.iron>=20*S.buildings.infirmary)upgrade('infirmary');
    if(region>=1&&kind==='optimizer'&&S.buildings.tower<2&&S.iron>=20*S.buildings.tower)upgrade('tower');
    if(region>=2&&S.buildings.hall<3&&S.iron>=20*S.buildings.hall)upgrade('hall');
    if(region>=2&&S.craftedItems<1&&S.iron>=12&&S.salvage>=10){forgeCraft();equipBest(kind);tryClaims()}
  }
  function validate(run,kind){
    if(S.coin<0||S.iron<0||S.salvage<0)invariants.push(`${run}:${kind}:negative resource`);
    const keys=Object.keys(S.equipped||{});if(new Set(keys).size!==keys.length)invariants.push(`${run}:${kind}:duplicate equip key`);
    for(const [k,i] of Object.entries(S.equipped||{})){if(!S.inventory.some(x=>x.id===i.id))invariants.push(`${run}:${kind}:equipped item missing inventory ${k}`)}
    if(S.revealed<1||S.revealed>4)invariants.push(`${run}:${kind}:revealed ${S.revealed}`);
  }
  for(let run=0;run<1000;run++){
    const kind=strategies[run%strategies.length],st=stats[kind];st.runs++;
    S=deep(seed);S.tutorialSeen=true;S.screen='enclave';S.fieldKit=false;S.lastResult=null;S.lastRelic=null;
    let complete=true;
    for(let region=0;region<4;region++){
      let cleared=false,attempt=0;
      while(!cleared&&attempt<12){
        attempt++;st.totalAttempts++;regionAttempts[region]++;if(region===3)st.wardenAttempts++;
        if(region>=2&&kind!=='aggressive'&&!S.fieldKit&&S.coin>=15)buyFieldKit();
        const before=S.clears?.[region]||0,beforeEvents=S.events||0;
        depart(region);
        if(S.screen==='event'){
          st.events++;const risk=kind==='aggressive'?true:kind==='conservative'?false:kind==='optimizer'?((S.buildings.tower||1)>=2||Math.random()<.7):Math.random()<.5;if(risk)st.riskyEvents++;eventChoice(risk);
        }
        const resolved=battleBot(kind);if(!resolved){stuck.push(`${run}:${kind}:region${region}:combat-loop`);complete=false;break}
        if((S.clears?.[region]||0)>before){cleared=true;regionWins[region]++;prepareProgress(kind,region)}else{st.defeats++;prepareProgress(kind,Math.max(0,region-1))}
        if((S.events||0)<beforeEvents)invariants.push(`${run}:${kind}:event counter regressed`);
      }
      if(!cleared){complete=false;break}
    }
    tryClaims();equipBest(kind);validate(run,kind);
    if(complete&&S.wardenDefeated)st.completed++;else st.failed++;
    st.finalCoin+=S.coin;st.finalIron+=S.iron;st.finalSalvage+=S.salvage;st.items+=S.inventory.length;const sp=setCount();st.setPieces+=sp;if(sp>=2)st.set2++;if(sp>=4)st.set4++;if(S.objectiveStep>=6)st.objectiveComplete++;st.levels+=S.hunters.reduce((a,h)=>a+h.lv,0)/S.hunters.length;
  }
  for(const st of Object.values(stats)){
    for(const k of ['finalCoin','finalIron','finalSalvage','items','setPieces','levels','wardenAttempts'])st[`avg${k[0].toUpperCase()+k.slice(1)}`]=+(st[k]/st.runs).toFixed(2);
    st.completionRate=+(100*st.completed/st.runs).toFixed(1);st.set2Rate=+(100*st.set2/st.runs).toFixed(1);st.set4Rate=+(100*st.set4/st.runs).toFixed(1);st.objectiveRate=+(100*st.objectiveComplete/st.runs).toFixed(1);st.avgAttempts=+(st.totalAttempts/st.runs).toFixed(2);
  }
  window.setTimeout=original.setTimeout;window.clearTimeout=original.clearTimeout;render=original.render;save=original.save;toast=original.toast;
  return {runs:1000,strategies,stats,regionAttempts,regionWins,stuck:stuck.slice(0,25),stuckCount:stuck.length,invariants:invariants.slice(0,25),invariantCount:invariants.length};
});

summary.browserErrors=browserErrors;
fs.writeFileSync('audit-1000-results.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
if(browserErrors.length||summary.stuckCount||summary.invariantCount)process.exitCode=1;
await browser.close();
