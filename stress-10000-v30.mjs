import { chromium } from 'playwright';
import fs from 'node:fs';
await import('./stress-10000-v28.mjs');
const batch=Number(process.env.STRESS_BATCH||0),count=Number(process.env.STRESS_COUNT||1000),startRun=batch*count;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const browserErrors=[];page.on('pageerror',e=>browserErrors.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')browserErrors.push(`console: ${m.text()}`)});
await page.addInitScript(()=>localStorage.clear());await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});await page.locator('button[data-begin]').click();
const summary=await page.evaluate(({startRun,count})=>{
 const failures=[];let persistence=0,rankChecks=0,powerChecks=0,warStates=0;
 const phases=['idle','prep','war','results'];
 for(let i=0;i<count;i++){
   const run=startRun+i,phase=phases[run%4],prestige=850+(run%701),influence=run%700,wins=run%60,losses=run%37;
   const state={version:1,realmName:`Stress Realm ${run}`,banner:`Banner ${run%17}`,prestige,influence,wins,losses,army:{levy:40+(run%121),guard:10+(run%61),scouts:5+(run%51)},war:{phase,opponent:phase==='idle'?null:['cinders','hollow','saints','blackroad','vespers'][run%5],prepUntil:phase==='prep'?Date.now()+30000:0,endAt:phase==='war'?Date.now()+180000:0,attacks:phase==='war'?run%4:3,score:phase==='results'?run%451:run%220,enemyScore:phase==='results'?(run*3)%451:run%180,assignments:phase==='idle'?{}:{gate:'Vanguard',tower:'Duelist',keep:'Physician'},log:[`stress-${run}`],rewarded:phase==='results'&&run%2===0}};
   const loaded=StrategyV30.save(state);
   if(loaded.realmName!==state.realmName||loaded.prestige!==prestige||loaded.influence!==influence||loaded.army.levy!==state.army.levy||loaded.war.phase!==phase)failures.push(`${run}:strategy persistence mismatch`);else persistence++;
   const power=StrategyV30.armyPower();if(!Number.isFinite(power)||power<=0)failures.push(`${run}:invalid army power ${power}`);else powerChecks++;
   const rows=StrategyV30.rankRows();if(rows.length!==6||rows.some((x,j)=>j&&rows[j-1].rating<x.rating)||!rows.some(x=>x.player&&x.rating===prestige))failures.push(`${run}:ranking invariant failed`);else rankChecks++;
   if(phase!=='idle'){const w=loaded.war;if(!w.opponent||Object.keys(w.assignments).length!==3||w.attacks<0||w.attacks>3||w.score<0||w.enemyScore<0)failures.push(`${run}:war-state invariant failed`);else warStates++}
 }
 return {runs:count,startRun,failureCount:failures.length,failures:failures.slice(0,80),persistence,rankChecks,powerChecks,warStates};
},{startRun,count});
summary.batch=batch;summary.browserErrors=browserErrors;fs.writeFileSync(`stress-10000-v30-batch-${batch}.json`,JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));if(browserErrors.length||summary.failureCount)process.exitCode=1;await browser.close();