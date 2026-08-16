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
 await page.locator('[data-v27-domain]').waitFor();
 const badge=await page.locator('[data-v27-domain]').innerText();
 if(!badge.includes('1/6 LAND'))throw new Error('V27 domain badge did not show the initial reclaimed ward.');
 await page.locator('[data-v27-domain]').click();
 const overlay=page.locator('.kingdom-overlay-v27');await overlay.waitFor();
 if(await overlay.locator('.domain-plot-v27').count()!==6)throw new Error('V27 domain map did not render six land plots.');
 if(!(await overlay.locator('.domain-plot-v27').first().innerText()).includes('EMPTY BUILDING PLOT'))throw new Error('V27 initial reclaimed plot is not buildable.');
 await page.screenshot({path:'kingdom-v27-domain-start.png',fullPage:true});

 await overlay.locator('[data-v27-select="0"]').click();
 await page.locator('.kingdom-chooser-v27').waitFor();
 if(await page.locator('[data-v27-build]').count()!==4)throw new Error('V27 construction chooser did not render four building specializations.');
 await page.locator('[data-v27-build="arsenal"]').click();
 await page.waitForFunction(()=>KingdomV27.load().plots[0].building==='arsenal');
 let state=await page.evaluate(()=>Game.debugState());
 if(state.coin!==72||state.iron!==4)throw new Error(`V27 construction cost mismatch: ${state.coin} Coin / ${state.iron} Iron.`);
 let bonus=await page.evaluate(()=>KingdomV27.bonuses());
 if(bonus.atk!==2||bonus.warStrike!==8)throw new Error(`V27 Arsenal bonuses incorrect: ${JSON.stringify(bonus)}`);

 await page.evaluate(()=>{const s=Game.debugState();s.coin=200;s.iron=120;s.salvage=30;Game.debugSetState(s)});
 await page.locator('[data-v27-reclaim="1"]').click();
 await page.waitForFunction(()=>KingdomV27.load().plots[1].reclaimed===true);
 state=await page.evaluate(()=>Game.debugState());
 if(state.coin!==170||state.iron!==100)throw new Error('V27 first land-reclamation cost did not deduct 30 Coin / 20 Iron.');
 await page.locator('[data-v27-select="1"]').click();
 await page.locator('[data-v27-build="bastion"]').click();
 bonus=await page.evaluate(()=>KingdomV27.bonuses());
 if(bonus.hp!==12||bonus.atk!==2||bonus.warDefense!==8||bonus.warStrike!==8)throw new Error(`V27 combined kingdom stats incorrect: ${JSON.stringify(bonus)}`);
 await page.screenshot({path:'kingdom-v27-domain-built.png',fullPage:true});

 await page.locator('[data-v27-close]').click();
 await page.evaluate(()=>Game.startBattle(0,{}));
 await page.locator('.battleview').waitFor();
 await page.waitForFunction(()=>Game.battle?.v27KingdomApplied===true);
 const battle=await page.evaluate(()=>({party:Game.battle.party.map(x=>({name:x.name,max:x.max,atk:x.atk})),bonus:Game.battle.v27Bonus}));
 const v=battle.party.find(x=>x.name==='Vanguard');
 if(!v||v.max<182||v.atk<18)throw new Error(`V27 permanent kingdom combat bonuses did not apply: ${JSON.stringify(v)}`);
 if(battle.bonus.hp!==12||battle.bonus.atk!==2)throw new Error('V27 battle bonus record is incorrect.');

 await page.evaluate(()=>{Game.battle.enemies.forEach(e=>e.hp=0);Game.tick(true)});
 await page.locator('.resultview').waitFor();
 await page.locator('[data-secure]').click();
 await page.locator('.bottomnav button[data-go="enclave"]').click();
 await page.locator('[data-v27-domain]').waitFor();
 const visibleSites=await page.locator('.kingdom-site-v27').count();
 if(visibleSites<2)throw new Error('V27 reclaimed/built districts are not represented on the Enclave environment.');
 if(failures.length)throw new Error(failures.join('\n'));
 console.log('V27 kingdom smoke passed: reclaimable land, player-selected construction, escalating costs, permanent combat/war bonuses and visible settlement growth are functional on mobile.');
}finally{await browser.close()}
