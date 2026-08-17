import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const failures=[];page.on('pageerror',e=>failures.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')failures.push(`console: ${m.text()}`)});
try{
 await page.addInitScript(()=>localStorage.clear());
 await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
 await page.locator('button[data-begin]').click();
 await page.locator('.bottomnav button[data-go="hunters"]').click();
 await page.locator('.v7-hunterhall').waitFor();
 const art=await page.locator('.v7-hero').getAttribute('style');
 if(!art?.includes('hunter-')||!art.includes('.svg'))throw new Error(`Hunter Hall is not using stable SVG art: ${art}`);
 if(art.includes('data:image/webp'))throw new Error('Broken WebP Hunter payload is still active.');
 await page.screenshot({path:'v30-hunter-stable.png',fullPage:true});

 await page.locator('.bottomnav button[data-go="enclave"]').click();
 await page.locator('[data-v30-realm]').waitFor();
 if(await page.locator('.realm-card-v30').count()!==1)throw new Error('Visible Realm summary card did not render in the Enclave.');
 await page.locator('[data-v30-realm]').click();
 const realm=page.locator('.realm-overlay-v30');await realm.waitFor();
 if((await realm.locator('.realm-army-v30 > header b').innerText()).trim()!=='War Host')throw new Error('Persistent army screen missing.');
 if((await realm.locator('.realm-rankings-v30 > header b').innerText()).trim()!=='Realm Rankings')throw new Error('Regional rankings missing.');
 if(await realm.locator('[data-v30-schedule]').count()<3)throw new Error('Rival powers are not available for scheduled war.');
 const initial=await page.evaluate(()=>StrategyV30.load());
 const initialPower=await page.evaluate(()=>StrategyV30.armyPower());
 await realm.locator('[data-v30-train="levy"]').click();
 const trained=await page.evaluate(()=>StrategyV30.load());
 if(trained.army.levy!==initial.army.levy+10)throw new Error('Persistent army training failed.');
 const trainedPower=await page.evaluate(()=>StrategyV30.armyPower());
 if(trainedPower<=initialPower)throw new Error('Army training did not increase realm war power.');

 await page.locator('[data-v30-schedule="cinders"]').click();
 await page.locator('[data-v30-assign="gate"][data-hunter="Vanguard"]').click();
 await page.locator('[data-v30-assign="tower"][data-hunter="Duelist"]').click();
 await page.locator('[data-v30-assign="keep"][data-hunter="Physician"]').click();
 const prep=await page.evaluate(()=>StrategyV30.load());
 if(prep.war.phase!=='prep'||Object.keys(prep.war.assignments).length!==3)throw new Error('Scheduled-war preparation assignments failed.');
 await page.evaluate(()=>StrategyV30.beginWar(true));
 await page.waitForFunction(()=>StrategyV30.load().war.phase==='war');
 for(const id of ['gate','tower','keep']){await page.locator(`[data-v30-strike="${id}"]`).click();await page.waitForTimeout(30)}
 await page.waitForFunction(()=>StrategyV30.load().war.phase==='results');
 const result=await page.evaluate(()=>StrategyV30.load());
 if(result.wins+result.losses!==1)throw new Error('War record did not persist after resolution.');
 if(result.prestige===1000)throw new Error('War did not change persistent prestige.');
 if(result.influence<=0)throw new Error('War did not award persistent influence.');
 await page.locator('[data-v30-claim]').click();
 const rewarded=await page.evaluate(()=>StrategyV30.load());
 if(!rewarded.war.rewarded)throw new Error('War reward state did not persist.');
 await page.screenshot({path:'v30-realm-war-result.png',fullPage:true});
 if(failures.length)throw new Error(failures.join('\n'));
 console.log('V30 strategy smoke passed: stable Hunter vectors, visible Realm UI, army growth, rivals, scheduled preparation, coordinated war attacks, persistent prestige/influence/rankings and rewards are functional on mobile.');
}finally{await browser.close()}
