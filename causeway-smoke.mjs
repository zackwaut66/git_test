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
  await page.evaluate(()=>{
    const s=Game.debugState();
    s.started=true;s.screen='map';s.clears=[1,0,0,0];s.buildings.hall=2;s.coin=120;s.iron=40;s.salvage=12;
    Game.debugSetState(s);
  });
  await page.locator('.marchmap').waitFor();
  const causeway=page.locator('button[data-region="1"]');
  if(await causeway.isDisabled())throw new Error('Hollow Causeway is not open in its valid progression state.');

  await page.evaluate(()=>{
    const old=Math.random;const seq=[0,0];Math.random=()=>seq.length?seq.shift():.99;Game.depart(1);Math.random=old;
  });
  await page.locator('.eventview').waitFor();
  const eventBg=await page.locator('.eventart').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!eventBg.includes('battle-causeway-v1.svg'))throw new Error('Causeway discovery did not use the illustrated Causeway environment.');
  const eventTitle=(await page.locator('.eventcopy h1').innerText()).trim();
  if(!['THE HANGING BUS','THE TOLL KEEPER','THE SUNKEN CONVOY'].includes(eventTitle))throw new Error(`Unexpected Causeway discovery: ${eventTitle}`);
  if(await page.locator('.eventchoices button').first().evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Causeway discovery choice is below 44px.');
  await page.screenshot({path:'causeway-event-v13.png',fullPage:true});
  await page.locator('[data-event="safe"]').click();

  await page.locator('.battleview').waitFor();
  await page.waitForFunction(()=>document.querySelector('.battlescene')?.classList.contains('v13-causeway-art'));
  const battleBg=await page.locator('.battlescene').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!battleBg.includes('battle-causeway-v1.svg'))throw new Error('Causeway combat environment did not load.');
  const enemies=page.locator('.enemyformation .battleunit');
  if(await enemies.count()<4)throw new Error('Causeway combat did not render a four-enemy formation.');
  if(await page.locator('.enemyformation .battleunit.v8-enemy-art').count()!==await enemies.count())throw new Error('A Causeway enemy fell back to prototype silhouette art.');
  const enemyMeta=await enemies.evaluateAll(els=>els.map(el=>({name:el.querySelector('b')?.textContent?.trim()||'',art:getComputedStyle(el).getPropertyValue('--unit-art')})));
  for(const e of enemyMeta){if(!e.art.includes('enemy-road-reaver')&&!e.art.includes('enemy-rifleman')&&!e.art.includes('enemy-bridge-spotter'))throw new Error(`${e.name} lacks Causeway illustration.`)}
  await page.screenshot({path:'causeway-combat-v13.png',fullPage:true});

  await page.evaluate(()=>{Game.battle.enemies.forEach(e=>e.hp=0);Game.tick()});
  await page.locator('.resultview').waitFor();
  await page.locator('.scene-causeway').waitFor();
  const resultBg=await page.locator('.resultart').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!resultBg.includes('battle-causeway-v1.svg'))throw new Error('Causeway recovery screen did not preserve the recovered road environment.');
  if(!(await page.locator('.resultcopy h1').innerText()).includes('Hollow Causeway'))throw new Error('Causeway victory identity missing from recovery screen.');
  await page.screenshot({path:'causeway-result-v13.png',fullPage:true});
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('Hollow Causeway V13 smoke passed: discovery, illustrated environment, all encounter variants, combat and recovery are functional.');
}finally{await browser.close()}
