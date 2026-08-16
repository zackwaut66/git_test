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
 await page.locator('.kingdom-growth-v28').waitFor();
 let status=await page.locator('.growth-status-v28').innerText();
 if(!status.includes('1/6 WARDS RECLAIMED')||!status.includes('0 STRUCTURES'))throw new Error(`V28 initial footprint incorrect: ${status}`);
 if(await page.locator('.district-v28.ruined').count()!==5)throw new Error('V28 fresh Enclave should visibly contain five ruined districts.');
 if(!await page.locator('.enclaveview').evaluate(el=>el.classList.contains('growth-v28-small')))throw new Error('V28 fresh Enclave did not use small-settlement composition.');
 await page.screenshot({path:'kingdom-v28-enclave-fresh.png',fullPage:true});

 await page.evaluate(()=>{
   const plots=[
    {reclaimed:true,building:'shrine',level:3},
    {reclaimed:true,building:'arsenal',level:3},
    {reclaimed:true,building:'bastion',level:3},
    {reclaimed:true,building:'foundry',level:3},
    {reclaimed:true,building:'arsenal',level:2},
    {reclaimed:true,building:'bastion',level:2}
   ];
   localStorage.setItem('bell-beneath-ash-kingdom-v27',JSON.stringify({version:1,plots,claims:{}}));
 });
 await page.reload({waitUntil:'networkidle'});
 await page.locator('button[data-continue],button[data-begin]').first().click();
 await page.locator('.kingdom-growth-v28').waitFor();
 await page.waitForFunction(()=>document.querySelector('.growth-status-v28')?.textContent.includes('6/6 WARDS'));
 status=await page.locator('.growth-status-v28').innerText();
 if(!status.includes('6/6 WARDS RECLAIMED')||!status.includes('6 STRUCTURES')||!status.includes('16 TOTAL TIERS'))throw new Error(`V28 fortress footprint incorrect: ${status}`);
 if(await page.locator('.district-v28.ruined').count()!==0)throw new Error('V28 developed Enclave still shows ruined districts.');
 if(await page.locator('.district-v28.type-foundry').count()!==1||await page.locator('.district-v28.type-shrine').count()!==1)throw new Error('V28 specialized district silhouettes did not render.');
 if(!await page.locator('.enclaveview').evaluate(el=>el.classList.contains('growth-v28-fortress')))throw new Error('V28 fully reclaimed Enclave did not use fortress composition.');
 const freshSig='1:-:0|0:-:0|0:-:0|0:-:0|0:-:0|0:-:0';
 const currentSig=await page.evaluate(()=>KingdomV28.signature());
 if(currentSig===freshSig)throw new Error('V28 visual state signature did not change after settlement development.');
 await page.screenshot({path:'kingdom-v28-enclave-fortress.png',fullPage:true});
 if(failures.length)throw new Error(failures.join('\n'));
 console.log('V28 visual growth smoke passed: fresh and fully developed Enclaves have distinct settlement footprints, district structures, tier silhouettes and composition states on mobile.');
}finally{await browser.close()}
