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
    s.started=true;s.screen='map';s.clears=[1,1,0,0];s.buildings.hall=2;s.crafted=1;s.coin=160;s.iron=55;s.salvage=20;
    Game.debugSetState(s);
  });
  await page.locator('.marchmap').waitFor();
  const chapel=page.locator('button[data-region="2"]');
  if(await chapel.isDisabled())throw new Error('Saint Orra Chapel is not open in its valid progression state.');

  await page.evaluate(()=>{
    const old=Math.random;const seq=[0,0];Math.random=()=>seq.length?seq.shift():.99;Game.depart(2);Math.random=old;
  });
  await page.locator('.eventview').waitFor();
  const eventBg=await page.locator('.eventart').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!eventBg.includes('battle-chapel-v1.svg'))throw new Error('Chapel discovery did not use the illustrated chapel environment.');
  const eventTitle=(await page.locator('.eventcopy h1').innerText()).trim();
  if(!['THE UNLIT SHRINE','THE CHOIR DOOR','THE BONE CENSER'].includes(eventTitle))throw new Error(`Unexpected Chapel discovery: ${eventTitle}`);
  if(await page.locator('.eventchoices button').first().evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Chapel discovery choice is below 44px.');
  await page.screenshot({path:'chapel-event-v14.png',fullPage:true});
  await page.locator('[data-event="safe"]').click();

  await page.locator('.battleview').waitFor();
  await page.waitForFunction(()=>document.querySelector('.battlescene')?.classList.contains('v14-chapel-art'));
  const battleBg=await page.locator('.battlescene').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!battleBg.includes('battle-chapel-v1.svg'))throw new Error('Chapel combat environment did not load.');
  const enemies=page.locator('.enemyformation .battleunit');
  if(await enemies.count()<4)throw new Error('Chapel combat did not render its full enemy formation.');
  if(await page.locator('.enemyformation .battleunit.v8-enemy-art').count()!==await enemies.count())throw new Error('A Chapel enemy fell back to prototype silhouette art.');
  const enemyMeta=await enemies.evaluateAll(els=>els.map(el=>({name:el.querySelector('b')?.textContent?.trim()||'',art:getComputedStyle(el).getPropertyValue('--unit-art')})));
  for(const e of enemyMeta){if(!e.art.includes('enemy-reliquary-husk')&&!e.art.includes('enemy-chapel-thrall')&&!e.art.includes('enemy-bell-hand'))throw new Error(`${e.name} lacks Chapel illustration.`)}
  await page.screenshot({path:'chapel-combat-v14.png',fullPage:true});

  await page.evaluate(()=>{Game.battle.enemies.forEach(e=>e.hp=0);Game.tick()});
  await page.locator('.resultview').waitFor();
  await page.locator('.scene-chapel').waitFor();
  const resultBg=await page.locator('.resultart').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!resultBg.includes('battle-chapel-v1.svg'))throw new Error('Chapel recovery screen did not preserve the recovered chapel environment.');
  if(!(await page.locator('.resultcopy h1').innerText()).includes('Saint Orra Chapel'))throw new Error('Chapel victory identity missing from recovery screen.');
  await page.screenshot({path:'chapel-result-v14.png',fullPage:true});
  await page.locator('button[data-secure]').click();
  await page.locator('.inventoryview').waitFor();
  await page.locator('button[data-go="map"]').last().click();
  const warden=page.locator('button[data-region="3"]');
  if(await warden.isDisabled())throw new Error('Penitent Warden did not unlock after clearing Saint Orra Chapel.');
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('Saint Orra Chapel V14 smoke passed: discovery, illustrated environment, all encounter variants, combat, recovery and Warden unlock are functional.');
}finally{await browser.close()}
