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
  if(await page.locator('button[data-begin]').evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Begin control is below 44px mobile tap target.');
  await page.locator('button[data-begin]').click();
  await page.locator('.directive').waitFor();
  if(!(await page.locator('.directive').innerText()).includes('Open the Western Road'))throw new Error('Opening directive missing.');

  const enclaveBg=await page.locator('.worldscene').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!enclaveBg.includes('enclave-v10.svg'))throw new Error('Illustrated Enclave environment did not load.');
  for(const key of ['hall','forge','infirmary','tower','store','guild']){
    const sel=key==='store'?'.hotspot.store':`.hotspot.${key}`;
    if(await page.locator(sel).count()!==1)throw new Error(`Enclave ${key} hotspot missing.`);
  }
  if(await page.locator('.hotspot.hall').evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Hunter Hall hotspot is below 44px mobile tap target.');
  await page.screenshot({path:'enclave-v10-preview.png',fullPage:true});

  await page.locator('button[data-go="hunters"]').click();
  await page.locator('.v7-hunterhall').waitFor();
  if(await page.locator('.v7-loadout button').count()!==4)throw new Error('Hunter Hall did not render four equipment slots.');
  if((await page.locator('.v7-name h1').innerText()).trim()!=='VANGUARD')throw new Error('Featured Vanguard identity missing.');
  const decoded=await page.evaluate(async()=>{
    const out={};
    for(const [key,label] of [['v','Vanguard'],['d','Duelist'],['p','Physician']]){
      const data=window.__HART?.[key]||'';
      out[label]=await new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({width:img.naturalWidth,height:img.naturalHeight,bytes:data.length});img.onerror=()=>resolve(null);img.src=`data:image/webp;base64,${data}`;});
    }
    return out;
  });
  for(const [name,meta] of Object.entries(decoded)){if(!meta||meta.width<100||meta.height<150||meta.bytes<10000)throw new Error(`${name} generated art payload failed to decode.`)}
  const hallArt=await page.locator('.v7-hall-bg').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!hallArt.includes('hunter-hall-interior-v2.svg'))throw new Error('Hunter Hall environment not loaded.');
  if(await page.locator('.v7-roster button').first().evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Hunter roster tap target is below 44px.');
  const heroUses=async key=>page.locator('.v7-hero').evaluate((el,k)=>getComputedStyle(el).backgroundImage.includes((window.__HART?.[k]||'').slice(0,48)),key);
  if(!await heroUses('v'))throw new Error('Generated Vanguard art is not bound to the featured Hunter.');
  await page.screenshot({path:'hunterhall-preview.png',fullPage:true});
  await page.locator('.v7-roster button[data-v7-hunter="Duelist"]').click();
  await page.waitForFunction(()=>document.querySelector('.v7-name h1')?.textContent?.trim()==='DUELIST');
  if(!await heroUses('d'))throw new Error('Roster selection did not switch to generated Duelist art.');
  await page.locator('.v7-roster button[data-v7-hunter="Physician"]').click();
  await page.waitForFunction(()=>document.querySelector('.v7-name h1')?.textContent?.trim()==='PHYSICIAN');
  if(!await heroUses('p'))throw new Error('Roster selection did not switch to generated Physician art.');
  await page.locator('.v7-roster button[data-v7-hunter="Vanguard"]').click();
  await page.waitForFunction(()=>document.querySelector('.v7-name h1')?.textContent?.trim()==='VANGUARD');

  await page.locator('button[data-go="map"]').click();
  const marchesBg=await page.locator('.marchmap').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!marchesBg.includes('ashen-marches-map-v1.svg'))throw new Error('Illustrated Ashen Marches map did not load.');
  await page.screenshot({path:'map-v9-preview.png',fullPage:true});

  await page.locator('button[data-region="0"]').click();
  if(await page.locator('.eventview').count())await page.locator('[data-event="safe"]').click();
  await page.locator('.battleview').waitFor();
  await page.locator('.battlecallout').waitFor();
  await page.locator('.combatvitals').waitFor();
  await page.waitForFunction(()=>document.querySelector('.battleview')?.dataset.v8==='1');
  if(await page.locator('.enemyformation .battleunit').count()<3)throw new Error('Enemy formation did not render.');
  if(await page.locator('.allyformation .battleunit').count()<3)throw new Error('Hunter formation did not render.');
  const illustratedAllies=page.locator('.allyformation .battleunit.v8-ally-art');
  if(await illustratedAllies.count()<3)throw new Error('Generated Hunter art was not bound into combat formation.');
  const farmBg=await page.locator('.battlescene').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!farmBg.includes('battle-farmstead-v1.svg'))throw new Error('Illustrated Farmstead combat background did not load.');
  const illustratedEnemies=page.locator('.enemyformation .battleunit.v8-enemy-art');
  if(await illustratedEnemies.count()<3)throw new Error('Every Farmstead encounter unit must use illustrated enemy art.');
  const enemyArt=await illustratedEnemies.evaluateAll(els=>els.map(el=>getComputedStyle(el).getPropertyValue('--unit-art')));
  if(enemyArt.some(art=>!art.includes('assets/enemy-')))throw new Error('A Farmstead enemy illustration failed to bind.');
  if(await page.locator('.abilities button').first().evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Combat ability tap target is below 44px.');
  await page.screenshot({path:'combat-v8-preview.png',fullPage:true});

  await page.evaluate(()=>{Game.battle.enemies.forEach(e=>e.hp=0);Game.tick()});
  await page.locator('.resultview').waitFor();
  await page.locator('.resultart .scene-farm').waitFor();
  const resultBg=await page.locator('.resultart').evaluate(el=>getComputedStyle(el).backgroundImage);
  if(!resultBg.includes('battle-farmstead-v1.svg'))throw new Error('Expedition result did not preserve the illustrated recovered site.');
  await page.screenshot({path:'result-v11-preview.png',fullPage:true});
  await page.locator('button[data-secure]').click();
  await page.locator('.inventoryview').waitFor();
  if(await page.locator('.setpips').count()!==2)throw new Error('Set chase progress did not render.');
  if(await page.locator('.compareline').count()<3)throw new Error('Loot comparison lines did not render.');
  if(await page.locator('.freshdrop').count()<3)throw new Error('Recovered drops were not marked as new.');
  const equipButtons=page.locator('button[data-equip]');
  if(await equipButtons.count()<1)throw new Error('No equip controls rendered for recovered loot.');
  await equipButtons.first().click();
  await page.waitForFunction(()=>[...document.querySelectorAll('.compareline')].some(el=>el.textContent?.includes('CURRENTLY EQUIPPED')));
  await page.locator('button[data-go="enclave"]').last().click();
  if(!(await page.locator('.directive').innerText()).includes('Strengthen the Hunter Hall'))throw new Error('Hall directive did not advance after equipping loot.');
  await page.locator('button[data-directive]').click();
  await page.locator('button[data-upgrade="hall"]').click();
  if(!(await page.locator('.directive').innerText()).includes('Break the Causeway'))throw new Error('Causeway directive did not advance after Hall Lv2.');
  await page.locator('button[data-go="map"]').click();
  const causeway=page.locator('button[data-region="1"]');
  if(await causeway.isDisabled())throw new Error('Causeway should be unlocked after first clear + equip + Hall Lv2.');
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('Mobile smoke passed: Enclave, Hunter Hall, Marches, Farmstead combat, result, loot, equipment and progression are functional.');
}finally{await browser.close()}
