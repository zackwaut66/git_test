import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
try{
  await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.BellCloud&&document.querySelector('.cloud-status-bba'));
  const state=await page.evaluate(()=>({label:document.querySelector('.cloud-status-bba')?.textContent,error:BellCloud.lastError,profile:BellCloud.capture()}));
  if(state.error)throw new Error(`Cloud bootstrap error: ${state.error}`);
  if(state.label!=='LOCAL SAVE')throw new Error(`Unexpected unsigned-in cloud label: ${state.label}`);
  if(state.profile.profile_version!==1)throw new Error('Cloud profile version missing.');
  if(!state.profile.stores['bell-beneath-ash-p01b'])throw new Error('Base game save is not included in cloud snapshot.');
  await page.locator('.cloud-status-bba').click();
  await page.locator('[data-cloud-panel]').waitFor();
  if(errors.length)throw new Error(errors.join('\n'));
  console.log('Backend sync smoke passed: Supabase client/config bootstrap, local snapshot capture and account UI are healthy.');
}finally{await browser.close()}
