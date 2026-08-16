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
    s.iron=60;s.coin=120;
    Game.debugSetState(s);
  });

  await page.locator('button[data-building="infirmary"]').click();
  const infirmary=page.locator('.facility-infirmary-v17');
  await infirmary.waitFor();
  if(await infirmary.locator('.facilitymetric').count()!==4)throw new Error('V17 Infirmary readiness metrics did not render.');
  const infText=await infirmary.locator('.facility-v17-intel').innerText();
  if(!infText.includes('+45 HP')||!infText.includes('3 GUARD'))throw new Error('V17 Infirmary Lv1 values are incorrect.');
  if(await infirmary.locator('button[data-kit]').evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Infirmary kit control is below 44px mobile target.');
  await page.screenshot({path:'infirmary-v17-preview.png',fullPage:true});
  await infirmary.locator('button[data-kit]').click();
  const kitState=await page.evaluate(()=>Game.debugState());
  if(!kitState.preparedKit||kitState.coin!==102)throw new Error('Infirmary Field Kit did not consume 18 Coin and persist preparation.');

  await page.locator('button[data-close]').first().click();
  await page.locator('button[data-building="tower"]').click();
  let tower=page.locator('.facility-tower-v17');
  await tower.waitFor();
  let towerText=await tower.locator('.facility-v17-intel').innerText();
  if(!towerText.includes('38%')||!towerText.includes('63%')||!towerText.includes('11 DMG'))throw new Error('V17 Scout Tower Lv1 intelligence values are incorrect.');
  if(await tower.locator('button[data-upgrade="tower"]').evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Scout Tower upgrade control is below 44px mobile target.');
  await page.screenshot({path:'scout-tower-v17-preview.png',fullPage:true});
  await tower.locator('button[data-upgrade="tower"]').click();
  const upgraded=await page.evaluate(()=>Game.debugState());
  if(upgraded.buildings.tower!==2||upgraded.iron!==40)throw new Error('Scout Tower upgrade did not reach Lv2 for 20 Iron.');
  await page.locator('button[data-building="tower"]').click();
  tower=page.locator('.facility-tower-v17');
  await tower.waitFor();
  towerText=await tower.locator('.facility-v17-intel').innerText();
  if(!towerText.includes('48%')||!towerText.includes('71%')||!towerText.includes('14 DMG'))throw new Error('V17 Scout Tower Lv2 intelligence values did not refresh after upgrade.');

  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V17 facilities smoke passed: Infirmary preparation, Scout Tower upgrade, mobile controls and live facility intelligence are functional.');
}finally{await browser.close()}
