import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
const failures = [];
page.on('pageerror', e => { const m=`pageerror: ${e.message}`; failures.push(m); console.error(m); });
page.on('console', msg => { if (msg.type() === 'error') { const m=`console: ${msg.text()}`; failures.push(m); console.error(m); } });

try {
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('#app', { state: 'attached' });
  await page.waitForTimeout(700);
  const appHtml = await page.locator('#app').innerHTML();
  if (!appHtml.trim()) {
    if (failures.length) throw new Error(failures.join('\n'));
    throw new Error('App failed to render but no browser error was captured.');
  }

  const briefing = page.getByRole('button', { name: 'ENTER THE ENCLAVE', exact: true });
  if (await briefing.count()) await briefing.click();
  await page.getByText('The Enclave', { exact: true }).waitFor();
  await page.getByText('Open the Western Road', { exact: true }).waitFor();

  await page.getByRole('button', { name: 'MARCHES', exact: true }).click();
  await page.getByText('THE ASHEN MARCHES', { exact: true }).waitFor();

  await page.evaluate(() => start(0));
  await page.getByText('Forsaken Farmstead', { exact: false }).first().waitFor();
  await page.getByText('RESOLVE', { exact: false }).first().waitFor();

  // Force a clean test victory so cross-module victory/result/objective plumbing is exercised.
  await page.evaluate(() => {
    clearTimeout(timer);
    battle.enemies.forEach(e => e.hp = 0);
    win();
  });
  await page.getByText('Forsaken Farmstead Cleared', { exact: true }).waitFor();
  const clearCount = await page.evaluate(() => S.clears?.[0] || 0);
  if (clearCount < 1) throw new Error('Farmstead victory did not increment S.clears[0].');

  await page.getByRole('button', { name: 'SECURE LOOT', exact: true }).click();
  await page.getByText('STOREHOUSE', { exact: true }).waitFor();

  await page.getByRole('button', { name: 'ENCLAVE', exact: true }).click();
  await page.getByRole('button', { name: 'CLAIM & ADVANCE', exact: true }).waitFor();
  await page.getByRole('button', { name: 'CLAIM & ADVANCE', exact: true }).click();
  await page.getByText('Strengthen the Hall', { exact: true }).waitFor();

  await page.getByRole('button', { name: 'HUNTERS', exact: true }).click();
  await page.getByText('HUNTER HALL', { exact: false }).first().waitFor();

  // Directly provision materials, then verify actual Forge crafting updates the crafting objective counter.
  await page.evaluate(() => { S.iron = 100; S.salvage = 100; save(); go('forge'); });
  await page.getByText('THE FORGE', { exact: false }).first().waitFor();
  const craftedBefore = await page.evaluate(() => S.craftedItems || 0);
  await page.getByRole('button', { name: /CRAFT · 12 IRON/ }).click();
  const craftedAfter = await page.evaluate(() => S.craftedItems || 0);
  if (craftedAfter <= craftedBefore) throw new Error('Forge craft did not increment S.craftedItems.');

  await page.getByRole('button', { name: 'INVENTORY', exact: true }).click();
  await page.getByText('STOREHOUSE', { exact: true }).waitFor();

  if (failures.length) throw new Error(failures.join('\n'));
  console.log('Mobile browser smoke passed: briefing, objectives, map, combat victory, result screen, loot, Hunter Hall, Forge craft and inventory.');
} finally {
  await browser.close();
}
