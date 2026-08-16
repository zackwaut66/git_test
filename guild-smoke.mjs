import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
const failures=[];
page.on('pageerror',e=>failures.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')failures.push(`console: ${m.text()}`)});
try{
  await page.addInitScript(()=>{localStorage.clear();Math.random=()=>0.5});
  await page.goto('http://127.0.0.1:8080/index.html',{waitUntil:'networkidle'});
  await page.locator('button[data-begin]').click();
  await page.evaluate(()=>{
    const s=Game.debugState();s.screen='enclave';s.wardenDefeated=true;s.clears=[1,1,1,1];s.coin=0;s.iron=0;s.salvage=0;s.hunters.forEach(h=>{h.lv=8;h.xp=0});Game.debugSetState(s);
  });
  const hotspot=page.locator('.hotspot.guild[data-v23-ready="1"]');await hotspot.waitFor();
  if((await hotspot.locator('span').innerText())!=='OPEN')throw new Error('V23 Guild Hall did not unlock on the Enclave screen.');
  await hotspot.click();
  const overlay=page.locator('.guild-overlay-v23');await overlay.waitFor();
  if(await overlay.locator('[data-v23-form]').count()!==1)throw new Error('V23 guild formation screen did not render.');
  await overlay.locator('[data-v23-name]').fill('Ashen Covenant');
  await overlay.locator('[data-v23-form]').click();
  await page.locator('.guild-status-v23').waitFor();
  if(!(await page.locator('.guild-head-v23').innerText()).includes('Ashen Covenant'))throw new Error('V23 guild name did not persist after formation.');
  if(await page.locator('.guild-roster-v23 article').count()!==7)throw new Error('V23 roster should contain three player Hunters and four simulated allies.');
  await page.screenshot({path:'guild-hall-v23-preview.png',fullPage:true});

  await page.locator('[data-v23-newwar]').click();
  await page.locator('[data-v23-assign="gate"][data-hunter="Vanguard"]').click();
  await page.locator('[data-v23-assign="bell"][data-hunter="Duelist"]').click();
  await page.locator('[data-v23-assign="reliquary"][data-hunter="Physician"]').click();
  const launch=page.locator('[data-v23-launch]');
  if(await launch.isDisabled())throw new Error('V23 war should be launchable after three objective assignments.');
  await page.screenshot({path:'guild-war-v23-prep.png',fullPage:true});
  await launch.click();
  await page.locator('.war-table-v23.active').waitFor();
  if(!(await page.locator('.war-table-v23.active').innerText()).includes('3 ATTACKS LEFT'))throw new Error('V23 war did not begin with three coordinated attacks.');

  for(const id of ['gate','bell','reliquary'])await page.locator(`[data-v23-strike="${id}"]`).click();
  const results=page.locator('.war-results-v23');await results.waitFor();
  const resultText=await results.innerText();
  if(!resultText.includes('WAR VICTORY'))throw new Error(`Expected deterministic V23 test guild to win, got: ${resultText}`);
  await page.screenshot({path:'guild-war-v23-result.png',fullPage:true});
  await page.locator('[data-v23-claim]').click();
  const resources=await page.evaluate(()=>({coin:Game.state.coin,iron:Game.state.iron,salvage:Game.state.salvage,guild:GuildV23.load()}));
  if(resources.coin!==80||resources.iron!==20||resources.salvage!==16)throw new Error(`V23 guild-war reward mismatch: ${JSON.stringify(resources)}`);
  if(resources.guild.wins!==1||!resources.guild.war.rewarded)throw new Error('V23 guild war record/reward state did not persist.');
  if(resources.guild.contribution<78)throw new Error('V23 PvE contribution did not synchronize into guild progression.');
  if(failures.length)throw new Error(failures.join('\n'));
  console.log('V23 Guild Hall smoke passed: guild formation, seven-member local roster, PvE contribution, preparation assignments, three coordinated war attacks, scoring, victory rewards and persistent war record are functional on mobile.');
}finally{await browser.close()}
