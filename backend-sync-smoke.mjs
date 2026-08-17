import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
try{
  await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.BellCloud&&document.querySelector('.cloud-status-bba'));
  await page.locator('button[data-begin]').click();
  const state=await page.evaluate(()=>({label:document.querySelector('.cloud-status-bba')?.textContent,error:BellCloud.lastError,profile:BellCloud.capture(),hasLinkFn:typeof BellCloud.sendLink==='function'}));
  if(state.error)throw new Error(`Cloud bootstrap error: ${state.error}`);
  if(state.label!=='LOCAL SAVE')throw new Error(`Unexpected unsigned-in cloud label: ${state.label}`);
  if(state.profile.profile_version!==1)throw new Error('Cloud profile version missing.');
  if(!state.profile.stores['bell-beneath-ash-p01b'])throw new Error('Base game save is not included in cloud snapshot after game start.');
  if(!state.hasLinkFn)throw new Error('Magic-link login function is not exposed.');
  await page.locator('.cloud-status-bba').click();
  await page.locator('[data-cloud-panel]').waitFor();
  if(await page.locator('[data-cloud-send]').textContent()!=='Send sign-in link')throw new Error('Magic-link send control missing.');
  const copy=await page.locator('[data-cloud-panel]').textContent();
  if(!copy.includes('Open in Safari')||!copy.includes('Gmail'))throw new Error('Same-browser mobile login guidance missing.');
  if(errors.length)throw new Error(errors.join('\n'));
  console.log('Backend sync smoke passed: Supabase bootstrap, save snapshot coverage and same-browser magic-link guidance are healthy.');
}finally{await browser.close()}
