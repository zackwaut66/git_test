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
    s.screen='map';
    s.clears=[1,1,1,0];
    s.buildings.hall=2;
    s.crafted=1;
    Game.debugSetState(s);
  });
  const strip=page.locator('.march-intel-v20');
  await strip.waitFor();
  if(await page.locator('.march-intel-card').count()!==4)throw new Error('V20 March intelligence did not render all four region dossiers.');
  const farm=await page.locator('[data-v20-region="0"]').innerText();
  const warden=await page.locator('[data-v20-region="3"]').innerText();
  if(!farm.includes('28 Coin · 18 Iron · 3 Salvage')||!farm.includes('Feral · Lurker'))throw new Error('V20 Farmstead intelligence values are incorrect.');
  if(!warden.includes('BOSS')||!warden.includes('Warden · Servitors')||!warden.includes('90 Coin · 24 Iron · 14 Salvage'))throw new Error('V20 Penitent Warden intelligence values are incorrect.');
  if(!farm.includes('CLEARED'))throw new Error('V20 cleared-region state did not surface in the intelligence dossier.');
  const width=await strip.evaluate(el=>el.getBoundingClientRect().width);
  if(width>390)throw new Error(`V20 March intelligence panel overflows mobile viewport: ${width}px.`);
  await page.screenshot({path:'map-v20-intel-preview.png',fullPage:true});
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V20 March intelligence smoke passed: four region dossiers, threat profiles, rewards and cleared-state intel render correctly on mobile.');
}finally{await browser.close()}
