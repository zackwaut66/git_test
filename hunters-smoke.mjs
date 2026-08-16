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
    s.screen='hunters';
    s.selectedHunter='Duelist';
    const d=s.hunters.find(x=>x.name==='Duelist');d.lv=2;d.xp=30;
    Game.debugSetState(s);
  });
  const panel=page.locator('.hunter-progression-v18');
  await panel.waitFor();
  let text=await panel.innerText();
  if(!text.includes('DUELIST')||!text.includes('30 / 96 XP')||!text.includes('SEVER · 40 RESOLVE'))throw new Error('V18 Duelist dossier did not reflect progression/doctrine state.');
  const width=await page.locator('.hunter-xp-track i').evaluate(el=>parseFloat(getComputedStyle(el).width));
  const track=await page.locator('.hunter-xp-track').evaluate(el=>parseFloat(getComputedStyle(el).width));
  const pct=Math.round(width/track*100);
  if(pct<30||pct>33)throw new Error(`V18 XP bar expected about 31%, got ${pct}%.`);
  await page.locator('button[data-hunter="Physician"]').click();
  const physician=page.locator('.hunter-progression-v18');
  await physician.waitFor();
  text=await physician.innerText();
  if(!text.includes('PHYSICIAN')||!text.includes('FIELD TREATMENT · 35 RESOLVE'))throw new Error('V18 Hunter dossier did not refresh when changing selection.');
  await page.screenshot({path:'hunter-dossier-v18-preview.png',fullPage:true});
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V18 Hunter progression smoke passed: XP progress and selected-Hunter tactical doctrine refresh correctly on mobile.');
}finally{await browser.close()}
