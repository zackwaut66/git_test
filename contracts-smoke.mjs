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
    s.screen='enclave';s.wardenDefeated=true;s.clears=[1,1,1,1];s.coin=0;s.iron=0;s.salvage=0;
    Game.debugSetState(s);
  });
  const board=page.locator('.hunt-board-v21');await board.waitFor();
  if(await board.locator('[data-v21-contract]').count()!==3)throw new Error('V21 Hunt Board did not render three post-Warden contracts.');
  await page.screenshot({path:'hunt-board-v21-preview.png',fullPage:true});

  await board.locator('[data-v21-contract="cinder_pack"]').click();
  await page.locator('.battleview').waitFor();
  const contractBattle=await page.evaluate(()=>({id:Game.battle?.v21Contract,resolve:Game.battle?.resolve,max:Game.battle?.enemies?.map(e=>e.max),atk:Game.battle?.enemies?.map(e=>e.atk)}));
  if(contractBattle.id!=='cinder_pack')throw new Error('Cinder Pack contract did not tag the active battle.');
  if(contractBattle.resolve>30)throw new Error('Contract battle did not apply its Resolve pressure.');
  if(!contractBattle.max?.length||Math.min(...contractBattle.max)<195)throw new Error('Contract enemy vitality modifier did not apply.');
  if(!contractBattle.atk?.length||Math.min(...contractBattle.atk)<26)throw new Error('Contract enemy attack modifier did not apply.');
  const banner=page.locator('.contract-banner-v21');await banner.waitFor();
  if(await banner.count()!==1)throw new Error('Active contract banner did not render in combat.');

  await page.evaluate(()=>{Game.battle.enemies.forEach(e=>e.hp=1);Game.tick(true)});
  await page.locator('.resultview').waitFor();
  await page.waitForFunction(()=>document.querySelector('.contract-reward-v21'));
  const rewarded=await page.evaluate(()=>({coin:Game.state.coin,iron:Game.state.iron,salvage:Game.state.salvage,drops:Game.state.lastDrops.length,inventory:Game.state.inventory.length}));
  if(rewarded.coin!==63||rewarded.iron!==28||rewarded.salvage!==8)throw new Error(`Contract reward mismatch: ${JSON.stringify(rewarded)}`);
  if(rewarded.drops<4||rewarded.inventory!==rewarded.drops)throw new Error('Contract bonus equipment was not added to the secured drop pool.');
  const bonus=await page.locator('.contract-reward-v21').innerText();
  if(!bonus.includes('CINDER PACK')||!bonus.includes('+35')||!bonus.includes('+10')||!bonus.includes('+5'))throw new Error('Contract completion bonus was not surfaced on the result screen.');
  await page.screenshot({path:'hunt-contract-v21-result.png',fullPage:true});

  await page.locator('[data-secure]').click();
  await page.locator('.bottomnav button[data-go="enclave"]').click();
  const refreshed=page.locator('.hunt-board-v21');await refreshed.waitFor();
  const cinder=await refreshed.locator('[data-v21-contract="cinder_pack"]').innerText();
  if(!cinder.includes('1 COMPLETION'))throw new Error('Hunt Board did not persist contract completion count.');
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V21 Hunt Board smoke passed: post-Warden contracts, difficulty modifiers, bonus resources, bonus gear and repeatable completion tracking are functional on mobile.');
}finally{await browser.close()}
