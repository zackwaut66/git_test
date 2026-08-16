import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const failures=[];
page.on('pageerror',e=>failures.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')failures.push(`console: ${m.text()}`)});
try{
  await page.addInitScript(()=>localStorage.clear());
  await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
  await page.locator('button[data-begin]').waitFor();
  await page.locator('button[data-begin]').click();
  await page.locator('.directive').waitFor();
  if(!(await page.locator('.directive').innerText()).includes('Open the Western Road'))throw new Error('Opening directive missing.');
  await page.locator('button[data-go="map"]').click();
  await page.locator('button[data-region="0"]').click();
  await page.locator('.battleview').waitFor();
  await page.evaluate(()=>{Game.battle.enemies.forEach(e=>e.hp=0);Game.tick()});
  await page.locator('.resultview').waitFor();
  await page.locator('button[data-secure]').click();
  await page.locator('.inventoryview').waitFor();
  await page.locator('button[data-equip][data-owner="Vanguard"]').first().click();
  await page.locator('button[data-go="enclave"]').last().click();
  if(!(await page.locator('.directive').innerText()).includes('Strengthen the Hunter Hall'))throw new Error('Hall directive did not advance after equipping loot.');
  await page.locator('button[data-directive]').click();
  await page.locator('button[data-upgrade="hall"]').click();
  if(!(await page.locator('.directive').innerText()).includes('Break the Causeway'))throw new Error('Causeway directive did not advance after Hall Lv2.');
  await page.locator('button[data-go="map"]').click();
  const causeway=page.locator('button[data-region="1"]');
  if(await causeway.isDisabled())throw new Error('Causeway should be unlocked after first clear + equip + Hall Lv2.');
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('0.1b mobile smoke passed: title, directive, combat, multi-drop loot, equip, Hall upgrade, and Causeway unlock.');
}finally{await browser.close()}
// CI trigger: tuned build + upgrade-sheet navigation regression.
