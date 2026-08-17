import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const errors=[];page.on('pageerror',e=>errors.push(`pageerror:${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console:${m.text()}`)});
const url='http://127.0.0.1:8080/index.html';
try{
  await page.addInitScript(()=>localStorage.clear());
  await page.goto(url,{waitUntil:'networkidle'});
  await page.locator('button[data-begin]').click();
  if(!await page.evaluate(()=>!!window.Foundation&&!!window.Game?.__foundationHardened))throw new Error('Foundation hardening layer not active.');

  // Reset must clear the whole game namespace, not only app.js state.
  await page.evaluate(()=>{
    localStorage.setItem('bell-beneath-ash-kingdom-v27','{"version":1,"sentinel":1}');
    localStorage.setItem('bell-beneath-ash-guild-v23','{"formed":true,"name":"SENTINEL"}');
    localStorage.setItem('bell-beneath-ash-strategy-v30','{"version":1,"realmName":"SENTINEL"}');
    localStorage.setItem('bell-beneath-ash-contracts-v21','{"sentinel":1}');
    Game.reset();
  });
  const leftover=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('bell-beneath-ash-')));
  if(leftover.length)throw new Error(`Profile reset left subsystem state behind: ${leftover.join(',')}`);

  // Every persistent core store must fail safe when storage is corrupt.
  await page.evaluate(()=>{
    localStorage.setItem('bell-beneath-ash-p01b','{broken');
    localStorage.setItem('bell-beneath-ash-kingdom-v27','{broken');
    localStorage.setItem('bell-beneath-ash-guild-v23','{broken');
    localStorage.setItem('bell-beneath-ash-strategy-v30','{broken');
  });
  await page.reload({waitUntil:'networkidle'});
  const recovered=await page.evaluate(()=>({
    game:Game.debugState(),kingdom:KingdomV27.load(),guild:GuildV23.load(),realm:StrategyV30.load()
  }));
  if(recovered.game.coin!==90||recovered.game.iron!==12||recovered.game.clears.some(Boolean))throw new Error('Base game did not recover from corrupt save.');
  if(recovered.kingdom.plots.length!==6||!recovered.kingdom.plots[0].reclaimed)throw new Error('Kingdom did not recover from corrupt save.');
  if(recovered.guild.formed!==false||recovered.guild.level!==1)throw new Error('Guild did not recover from corrupt save.');
  if(recovered.realm.prestige!==1000||recovered.realm.army.levy!==60)throw new Error('Realm did not recover from corrupt save.');

  // Unsupported save versions must not poison a profile.
  await page.evaluate(()=>{
    localStorage.setItem('bell-beneath-ash-p01b',JSON.stringify({version:999,coin:-999}));
    localStorage.setItem('bell-beneath-ash-kingdom-v27',JSON.stringify({version:999,plots:[]}));
    localStorage.setItem('bell-beneath-ash-strategy-v30',JSON.stringify({version:999,prestige:-1}));
  });
  await page.reload({waitUntil:'networkidle'});
  const versions=await page.evaluate(()=>({game:Game.debugState(),kingdom:KingdomV27.load(),realm:StrategyV30.load()}));
  if(versions.game.version!==3||versions.game.coin!==90)throw new Error('Base save version fallback failed.');
  if(versions.kingdom.version!==1||versions.kingdom.plots.length!==6)throw new Error('Kingdom save version fallback failed.');
  if(versions.realm.version!==1||versions.realm.prestige!==1000)throw new Error('Realm save version fallback failed.');

  if(errors.length)throw new Error(errors.join('\n'));
  console.log('Foundation smoke passed: full-profile reset, corrupt-storage recovery and save-version fallbacks are safe across base game, Kingdom, Guild and Realm.');
}finally{await browser.close()}
