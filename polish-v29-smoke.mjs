import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const failures=[];page.on('pageerror',e=>failures.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')failures.push(`console: ${m.text()}`)});
try{
 await page.addInitScript(()=>localStorage.clear());
 await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
 if(await page.evaluate(()=>window.PolishV29?.version)!==29)throw new Error('V29 polish layer did not load.');
 if(!await page.evaluate(()=>document.documentElement.classList.contains('ui-v29')))throw new Error('V29 root class missing.');
 await page.locator('button[data-begin]').click();
 await page.locator('.enclaveview').waitFor();
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].every(b=>b.type==='button'&&!!b.getAttribute('aria-label')));
 const badButtons=await page.locator('button:not([type="button"])').count();if(badButtons)throw new Error(`${badButtons} buttons lack explicit button type.`);
 const unlabeled=await page.locator('button:not([aria-label])').count();if(unlabeled)throw new Error(`${unlabeled} buttons lack accessible labels.`);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);if(overflow)throw new Error('V29 introduced horizontal mobile overflow.');
 const domain=page.locator('[data-v27-domain]');await domain.waitFor();await domain.click();
 const dialog=page.locator('.kingdom-overlay-v27[role="dialog"]');await dialog.waitFor();
 if(await dialog.getAttribute('aria-modal')!=='true')throw new Error('Kingdom overlay is not marked modal.');
 await page.waitForFunction(()=>!!document.activeElement?.closest?.('.kingdom-overlay-v27'));
 const focusInside=await page.evaluate(()=>!!document.activeElement?.closest?.('.kingdom-overlay-v27'));if(!focusInside)throw new Error('V29 did not move focus into the opened dialog.');
 await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});
 await page.locator('button[data-go="map"]').click();await page.locator('.mapview').waitFor();
 await page.waitForFunction(()=>[...document.querySelectorAll('button:disabled')].every(b=>b.getAttribute('aria-disabled')==='true'));
 const disabled=page.locator('.mapnode:disabled').first();if(await disabled.count()){if(await disabled.getAttribute('aria-disabled')!=='true')throw new Error('Disabled map node missing aria-disabled state.');}
 await page.locator('button[data-go="enclave"]').click();await page.locator('.enclaveview').waitFor();
 const live=await page.locator('.v29-live').count();if(live!==1)throw new Error(`Expected one V29 live region, found ${live}.`);
 if(failures.length)throw new Error(failures.join('\n'));
 console.log('V29 polish smoke passed: mobile interaction feedback layer, accessibility labels, modal focus/Escape behavior, disabled-state semantics, live announcements and overflow constraints are intact.');
}finally{await browser.close()}
