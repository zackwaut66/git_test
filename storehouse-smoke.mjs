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
    s.screen='inventory';
    s.iron=80;s.salvage=40;s.coin=120;
    s.inventory=[
      Game.makeItem(1,{minimum:'uncommon'}),
      Game.makeItem(2,{minimum:'uncommon'}),
      Game.makeItem(3,{relic:true,name:'Test Reliquary',slot:'Charm',set:'Ashen Pilgrim'})
    ];
    Game.debugSetState(s);
  });
  await page.locator('.inventoryview').waitFor();
  const label=await page.locator('.inventoryhead').evaluate(el=>getComputedStyle(el,'::before').content);
  if(!label.includes('STOREHOUSE'))throw new Error('V16 Storehouse presentation did not load.');
  if(await page.locator('.lootrow').count()<3)throw new Error('Storehouse test inventory did not render.');
  if(await page.locator('.itemactions button').first().evaluate(el=>el.getBoundingClientRect().height)<30)throw new Error('Storehouse item controls are too small.');
  await page.screenshot({path:'storehouse-v16-preview.png',fullPage:true});
  const before=await page.evaluate(()=>Game.debugState().inventory.length);
  await page.locator('button[data-building="forge"]').click();
  const forge=page.locator('.sheet:has([data-craft])');
  await forge.waitFor();
  if(await page.locator('button[data-craft]').evaluate(el=>el.getBoundingClientRect().height)<44)throw new Error('Forge craft control is below 44px mobile target.');
  await page.screenshot({path:'forge-v16-preview.png',fullPage:true});
  await page.locator('button[data-craft]').click();
  const after=await page.evaluate(()=>Game.debugState().inventory.length);
  if(after!==before+1)throw new Error('Forge did not add crafted equipment to Storehouse.');
  const state=await page.evaluate(()=>Game.debugState());
  if(state.iron!==66||state.salvage!==32)throw new Error('Forge did not consume the expected 14 Iron and 8 Salvage.');
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V16 Storehouse smoke passed: visual layer, inventory rendering, Forge tap target and crafting economy are functional.');
}finally{await browser.close()}
