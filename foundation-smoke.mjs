import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const errors=[];page.on('pageerror',e=>errors.push(`pageerror:${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console:${m.text()}`)});
const url='http://127.0.0.1:8080/index.html';
try{
  await page.addInitScript(()=>localStorage.clear());
  await page.goto(url,{waitUntil:'networkidle'});
  await page.locator('button[data-begin]').click();
  if(!await page.evaluate(()=>!!window.Foundation&&!!window.Game?.__foundationHardened&&!!window.BellPreflight))throw new Error('Foundation hardening/preflight layer not active.');

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

  // Every persistent core store must fail safe when storage is corrupt JSON.
  await page.evaluate(()=>{
    localStorage.setItem('bell-beneath-ash-p01b','{broken');
    localStorage.setItem('bell-beneath-ash-kingdom-v27','{broken');
    localStorage.setItem('bell-beneath-ash-guild-v23','{broken');
    localStorage.setItem('bell-beneath-ash-strategy-v30','{broken');
    localStorage.setItem('bell-beneath-ash-contracts-v21','{broken');
  });
  await page.reload({waitUntil:'networkidle'});
  const recovered=await page.evaluate(()=>({
    game:Game.debugState(),kingdom:KingdomV27.load(),guild:GuildV23.load(),realm:StrategyV30.load()
  }));
  if(recovered.game.coin!==90||recovered.game.iron!==12||recovered.game.clears.some(Boolean))throw new Error('Base game did not recover from corrupt save.');
  if(recovered.kingdom.plots.length!==6||!recovered.kingdom.plots[0].reclaimed)throw new Error('Kingdom did not recover from corrupt save.');
  if(recovered.guild.formed!==false||recovered.guild.level!==1)throw new Error('Guild did not recover from corrupt save.');
  if(recovered.realm.prestige!==1000||recovered.realm.army.levy!==60)throw new Error('Realm did not recover from corrupt save.');

  // Valid JSON with plausible versions but broken nested structure must be rejected before modules boot.
  await page.evaluate(()=>{
    localStorage.setItem('bell-beneath-ash-p01b',JSON.stringify({version:3,screen:'enclave',started:true,coin:5,iron:5,salvage:0,buildings:{hall:1,forge:1,infirmary:1,tower:1},hunters:null,clears:[0,0,0,0],inventory:[],equipped:{},crafted:0,eventCount:0,wardenDefeated:false}));
    localStorage.setItem('bell-beneath-ash-kingdom-v27',JSON.stringify({version:1,plots:null,claims:{}}));
    localStorage.setItem('bell-beneath-ash-guild-v23',JSON.stringify({formed:true,name:'BROKEN',xp:0,level:1,contribution:0,wins:0,losses:0,war:null}));
    localStorage.setItem('bell-beneath-ash-strategy-v30',JSON.stringify({version:1,realmName:'BROKEN',banner:'X',prestige:1000,influence:0,wins:0,losses:0,army:null,war:null}));
    localStorage.setItem('bell-beneath-ash-contracts-v21',JSON.stringify({active:null,completed:null}));
  });
  await page.reload({waitUntil:'networkidle'});
  const structural=await page.evaluate(()=>({
    game:Game.debugState(),kingdom:KingdomV27.load(),guild:GuildV23.load(),realm:StrategyV30.load(),preflight:BellPreflight
  }));
  if(structural.game.coin!==90||structural.game.hunters.length!==3)throw new Error('Preflight did not reject malformed base save structure.');
  if(structural.kingdom.plots.length!==6)throw new Error('Preflight did not reject malformed Kingdom structure.');
  if(structural.guild.formed!==false||!structural.guild.war)throw new Error('Preflight did not reject malformed Guild structure.');
  if(structural.realm.army.levy!==60||structural.realm.war.phase!=='idle')throw new Error('Preflight did not reject malformed Realm structure.');
  if(structural.preflight.resetStores.length<5)throw new Error(`Expected five structurally unsafe stores to be quarantined, got ${structural.preflight.resetStores.length}.`);

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
  console.log('Foundation smoke passed: full-profile reset, corrupt JSON recovery, malformed-shape quarantine and save-version fallbacks are safe across base game, contracts, Kingdom, Guild and Realm.');
}finally{await browser.close()}
