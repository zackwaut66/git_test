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

  // Finish-line state: campaign cleared, resources available, Hunters developed.
  await page.evaluate(()=>{
    const s=Game.debugState();
    s.screen='enclave';s.wardenDefeated=true;s.clears=[1,1,1,1];
    s.coin=2000;s.iron=1200;s.salvage=400;
    s.hunters.forEach(h=>{h.lv=Math.max(h.lv||1,8);h.xp=0});
    Game.debugSetState(s);
  });

  // Kingdom pillar: build an actual specialization and verify it feeds permanent power.
  await page.locator('[data-v27-domain]').click();
  await page.locator('[data-v27-select="0"]').click();
  if(await page.locator('[data-v27-build="arsenal"]').count())await page.locator('[data-v27-build="arsenal"]').click();
  await page.waitForFunction(()=>KingdomV27.load().plots[0].building!==null);
  const kingdom=await page.evaluate(()=>({state:KingdomV27.load(),bonus:KingdomV27.bonuses()}));
  if(kingdom.state.plots.filter(p=>p.reclaimed).length<1)throw new Error('Finish gate: kingdom land progression missing.');
  if((kingdom.bonus.atk||0)+(kingdom.bonus.hp||0)+(kingdom.bonus.warStrike||0)+(kingdom.bonus.warDefense||0)<=0)throw new Error('Finish gate: kingdom construction is not producing persistent power.');
  await page.locator('[data-v27-close]').click();

  // Guild pillar: form a persistent guild and ensure it survives navigation/reload.
  const guildHotspot=page.locator('.hotspot.guild[data-v23-ready="1"]');await guildHotspot.waitFor();await guildHotspot.click();
  if(await page.locator('[data-v23-form]').count()){
    await page.locator('[data-v23-name]').fill('Ashen Covenant');
    await page.locator('[data-v23-form]').click();
  }
  await page.locator('.guild-status-v23').waitFor();
  if(!(await page.locator('.guild-head-v23').innerText()).includes('Ashen Covenant'))throw new Error('Finish gate: guild identity did not persist in UI.');
  await page.locator('[data-v23-close]').click();

  // Realm / KaW-style pillar: train persistent host, schedule rival war, assign Hunters, strike three objectives and claim rewards.
  await page.locator('[data-v30-realm]').click();
  const realm=page.locator('.realm-overlay-v30');await realm.waitFor();
  const beforePower=await page.evaluate(()=>StrategyV30.armyPower());
  await realm.locator('[data-v30-train="levy"]').click();
  const afterPower=await page.evaluate(()=>StrategyV30.armyPower());
  if(afterPower<=beforePower)throw new Error('Finish gate: War Host training does not increase persistent realm power.');
  await page.locator('[data-v30-schedule="cinders"]').click();
  await page.locator('[data-v30-assign="gate"][data-hunter="Vanguard"]').click();
  await page.locator('[data-v30-assign="tower"][data-hunter="Duelist"]').click();
  await page.locator('[data-v30-assign="keep"][data-hunter="Physician"]').click();
  await page.evaluate(()=>StrategyV30.beginWar(true));
  await page.waitForFunction(()=>StrategyV30.load().war.phase==='war');
  for(const id of ['gate','tower','keep']){await page.locator(`[data-v30-strike="${id}"]`).click();await page.waitForTimeout(25)}
  await page.waitForFunction(()=>StrategyV30.load().war.phase==='results');
  await page.locator('[data-v30-claim]').click();
  const realmState=await page.evaluate(()=>StrategyV30.load());
  if(realmState.wins+realmState.losses<1||realmState.prestige===1000||realmState.influence<=0)throw new Error('Finish gate: Realm War did not produce persistent standing/record progression.');

  // Cross-system persistence: one hard reload must retain campaign, kingdom, guild and realm progression together.
  const before=await page.evaluate(()=>({
    game:Game.debugState(),kingdom:KingdomV27.load(),guild:GuildV23.load(),realm:StrategyV30.load()
  }));
  await page.reload({waitUntil:'networkidle'});
  const after=await page.evaluate(()=>({
    game:Game.debugState(),kingdom:KingdomV27.load(),guild:GuildV23.load(),realm:StrategyV30.load()
  }));
  if(!after.game.wardenDefeated||after.game.clears.filter(Boolean).length!==4)throw new Error('Finish gate: campaign progression did not survive reload.');
  if(after.kingdom.plots.filter(p=>p.reclaimed).length!==before.kingdom.plots.filter(p=>p.reclaimed).length)throw new Error('Finish gate: kingdom progression did not survive reload.');
  if(after.guild.name!==before.guild.name)throw new Error('Finish gate: guild identity did not survive reload.');
  if(after.realm.prestige!==before.realm.prestige||after.realm.influence!==before.realm.influence||after.realm.wins!==before.realm.wins||after.realm.losses!==before.realm.losses)throw new Error('Finish gate: realm standings/war record did not survive reload.');

  // Presentation blocker check: broken WebP Hunter runtime must remain absent from active rendering.
  await page.evaluate(()=>Game.go('hunters'));
  await page.locator('.v7-hunterhall').waitFor();
  const hero=await page.locator('.v7-hero').getAttribute('style');
  if(!hero?.includes('.svg')||hero.includes('data:image/webp'))throw new Error(`Finish gate: unstable Hunter rendering path active: ${hero}`);
  await page.screenshot({path:'completion-v30-integrated.png',fullPage:true});

  if(failures.length)throw new Error(failures.join('\n'));
  console.log('Integrated completion smoke passed: campaign, kingdom construction, guild identity, persistent War Host, scheduled Realm War, standings/rewards, cross-system reload persistence and stable mobile Hunter rendering are connected end-to-end.');
}finally{await browser.close()}
