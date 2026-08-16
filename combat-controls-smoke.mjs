import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const failures=[];
page.on('pageerror',e=>failures.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')failures.push(`console: ${m.text()}`)});
try{
  await page.addInitScript(()=>localStorage.clear());
  await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
  await page.locator('button[data-begin]').click();
  await page.evaluate(()=>Game.startBattle(0,{}));
  await page.locator('.battleview').waitFor();
  const controls=page.locator('.combat-controls-v19');
  await controls.waitFor();
  if(await controls.getByText('FOCUSED THREAT').count()!==1)throw new Error('V19 focused-threat combat intel did not render.');
  if(await page.locator('[data-v19-pause]').evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('V19 Tactical Pause control is below 44px mobile target.');

  await page.locator('[data-v19-pause]').click();
  await page.waitForFunction(()=>Game.battle?.paused===true);
  const heldTurn=await page.evaluate(()=>Game.battle.turn);
  await page.waitForTimeout(1200);
  const stillHeld=await page.evaluate(()=>({turn:Game.battle?.turn,paused:Game.battle?.paused}));
  if(!stillHeld.paused||stillHeld.turn!==heldTurn)throw new Error(`Combat advanced during Tactical Pause: turn ${heldTurn} -> ${stillHeld.turn}.`);

  const second=page.locator('button[data-target="1"]');
  if(await second.count()){await second.click();const target=await page.evaluate(()=>Game.battle.target);if(target!==1)throw new Error('Target selection did not remain interactive while paused.');}
  await page.screenshot({path:'combat-v19-tactical-pause.png',fullPage:true});

  await page.locator('[data-v19-pause]').click();
  await page.waitForFunction(()=>Game.battle?.paused===false);
  await page.waitForTimeout(950);
  const resumedTurn=await page.evaluate(()=>Game.battle?.turn??-1);
  if(resumedTurn<=heldTurn)throw new Error('Combat did not resume automatic formation exchange after Tactical Pause.');
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V19 combat controls smoke passed: focused-threat intel, Tactical Pause, paused targeting and automatic resume are functional on mobile.');
}finally{await browser.close()}
