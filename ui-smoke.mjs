import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const failures=[];
page.on('pageerror',e=>failures.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')failures.push(`console: ${m.text()}`)});
async function assertNoOverflow(label){const x=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));if(x.sw>x.cw+2)throw new Error(`${label} horizontal overflow: ${x.sw}px > ${x.cw}px.`)}
try{
  await page.addInitScript(()=>localStorage.clear());
  await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
  if(!(await page.locator('html').evaluate(el=>el.classList.contains('ui-v24'))))throw new Error('V24 production UI class was not applied.');
  await page.screenshot({path:'ui-v24-title.png',fullPage:true});
  await page.locator('button[data-begin]').click();
  await page.waitForFunction(()=>document.querySelector('.hud .brand small')?.textContent.includes('FIELD COMMAND'));
  const navHeights=await page.locator('.bottomnav button').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().height));
  if(navHeights.some(h=>h<44))throw new Error(`V24 bottom navigation contains a touch target below 44px: ${JSON.stringify(navHeights)}`);
  await assertNoOverflow('Enclave');
  await page.screenshot({path:'ui-v24-enclave.png',fullPage:true});

  for(const screen of ['hunters','map','inventory']){
    await page.locator(`.bottomnav button[data-go="${screen}"]`).click();
    await page.waitForTimeout(80);
    await assertNoOverflow(screen);
  }
  await page.screenshot({path:'ui-v24-inventory.png',fullPage:true});

  await page.locator('.bottomnav button[data-go="enclave"]').click();
  await page.locator('.hotspot.guild[data-v23-ready="1"]').click();
  await page.locator('.guild-overlay-v23').waitFor();
  const guildBox=await page.locator('.guild-shell-v23').evaluate(el=>{const r=el.getBoundingClientRect();return{left:r.left,right:r.right,width:r.width}});
  if(guildBox.left<0||guildBox.right>390.5)throw new Error(`V24 Guild Hall exceeds mobile viewport: ${JSON.stringify(guildBox)}`);
  await page.screenshot({path:'ui-v24-guild.png',fullPage:true});
  await page.locator('[data-v23-close]').click();

  await page.evaluate(()=>Game.startBattle(0,{}));
  await page.locator('.battleview').waitFor();
  await assertNoOverflow('Combat');
  const smallButtons=await page.locator('.battleview button').evaluateAll(els=>els.filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<40}).map(el=>({text:(el.innerText||'').trim().slice(0,30),height:el.getBoundingClientRect().height})));
  if(smallButtons.length)throw new Error(`V24 combat has undersized active controls: ${JSON.stringify(smallButtons)}`);
  await page.screenshot({path:'ui-v24-combat.png',fullPage:true});
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V24 production UI smoke passed: locked visual system, field-command header, mobile navigation, no horizontal overflow, Guild Hall fit and combat touch controls are intact.');
}finally{await browser.close()}
