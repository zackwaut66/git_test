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

  let last=page.locator('button[data-v22-last-toll]');
  await last.waitFor();
  if(!(await last.isDisabled()))throw new Error('V22 Last Toll should be locked before all three contract seals are earned.');
  const lockedText=await last.innerText();
  if(!lockedText.includes('THREE CONTRACT SEALS REQUIRED'))throw new Error('V22 locked mastery requirement is not surfaced.');

  await page.evaluate(()=>{
    localStorage.setItem('bell-beneath-ash-contracts-v21',JSON.stringify({active:null,completed:{cinder_pack:1,blackroad_tithe:1,echo_choir:1}}));
    Game.render();
  });
  last=page.locator('button[data-v22-last-toll]');
  await last.waitFor();
  if(await last.isDisabled())throw new Error('V22 Last Toll did not unlock after all three contract seals.');
  if(!(await last.innerText()).includes('MASTERY'))throw new Error('V22 Last Toll mastery card did not render unlocked state.');
  await page.screenshot({path:'last-toll-v22-board.png',fullPage:true});

  await last.click();
  await page.locator('.battleview').waitFor();
  const battle=await page.evaluate(()=>({id:Game.battle?.v22Hunt,resolve:Game.battle?.resolve,dread:Game.battle?.dread,warden:Game.battle?.enemies?.find(e=>e.cls==='warden'),supports:Game.battle?.enemies?.filter(e=>e.cls==='servitor').map(e=>({max:e.max,atk:e.atk}))}));
  if(battle.id!=='last_toll')throw new Error('V22 Last Toll did not tag the mastery battle.');
  if(battle.resolve>18||battle.dread<1)throw new Error('V22 mastery pressure did not apply to Resolve/Dread.');
  if(!battle.warden||battle.warden.max<1100||battle.warden.atk<46)throw new Error(`V22 Warden Echo scaling did not apply: ${JSON.stringify(battle.warden)}`);
  if(!battle.supports?.length||Math.min(...battle.supports.map(x=>x.max))<270||Math.min(...battle.supports.map(x=>x.atk))<29)throw new Error('V22 mastery Servitor scaling did not apply.');
  if(await page.locator('.last-toll-banner-v22').count()!==1)throw new Error('V22 mastery battle banner did not render.');
  await page.screenshot({path:'last-toll-v22-battle.png',fullPage:true});

  await page.evaluate(()=>{Game.battle.enemies.forEach(e=>e.hp=1);Game.tick(true)});
  await page.locator('.resultview').waitFor();
  await page.waitForFunction(()=>document.querySelector('.last-toll-reward-v22'));
  const rewarded=await page.evaluate(()=>({coin:Game.state.coin,iron:Game.state.iron,salvage:Game.state.salvage,drops:Game.state.lastDrops.length,inventory:Game.state.inventory.length,relics:Game.state.lastDrops.filter(x=>x.rarity==='relic').length}));
  if(rewarded.coin!==190||rewarded.iron!==42||rewarded.salvage!==32)throw new Error(`V22 mastery reward mismatch: ${JSON.stringify(rewarded)}`);
  if(rewarded.drops!==6||rewarded.inventory!==6||rewarded.relics<2)throw new Error(`V22 mastery drop pool should contain 6 items and at least two relics: ${JSON.stringify(rewarded)}`);
  const rewardText=await page.locator('.last-toll-reward-v22').innerText();
  if(!rewardText.includes('THE LAST TOLL IS BROKEN')||!rewardText.includes('+100')||!rewardText.includes('+18'))throw new Error('V22 mastery reward panel did not surface the completion bounty.');
  await page.screenshot({path:'last-toll-v22-result.png',fullPage:true});

  await page.locator('[data-secure]').click();
  await page.locator('.bottomnav button[data-go="enclave"]').click();
  last=page.locator('button[data-v22-last-toll]');await last.waitFor();
  if(!(await last.innerText()).includes('1 COMPLETION'))throw new Error('V22 Last Toll completion count did not persist.');
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V22 Last Toll smoke passed: mastery unlock gate, Warden Echo scaling, mastery pressure, bonus resources, guaranteed relic and completion tracking are functional on mobile.');
}finally{await browser.close()}
