import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
const failures = [];
page.on('pageerror', e => { const m=`pageerror: ${e.message}`; failures.push(m); console.error(m); });
page.on('console', msg => { if (msg.type() === 'error') { const m=`console: ${msg.text()}`; failures.push(m); console.error(m); } });

try {
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('#app', { state: 'attached' });
  await page.waitForTimeout(1000);
  const appHtml = await page.locator('#app').innerHTML();
  if (!appHtml.trim()) {
    console.error('APP HTML EMPTY');
    if (failures.length) throw new Error(failures.join('\n'));
    throw new Error('App failed to render but no browser error was captured.');
  }

  const briefing = page.getByRole('button', { name: 'ENTER THE ENCLAVE' });
  if (await briefing.count()) await briefing.click();
  await page.getByText('The Enclave', { exact: true }).waitFor();

  await page.getByRole('button', { name: 'MARCHES' }).click();
  await page.getByText('THE ASHEN MARCHES', { exact: true }).waitFor();

  await page.evaluate(() => start(0));
  await page.getByText('Forsaken Farmstead', { exact: false }).first().waitFor();
  await page.getByText('RESOLVE', { exact: false }).first().waitFor();

  await page.evaluate(() => { clearTimeout(timer); retreat(); });
  await page.getByText('THE ASHEN MARCHES', { exact: true }).waitFor();

  await page.getByRole('button', { name: 'INVENTORY' }).click();
  await page.getByText('STOREHOUSE', { exact: true }).waitFor();

  await page.getByRole('button', { name: 'HUNTERS' }).click();
  await page.getByText('HUNTER HALL', { exact: false }).first().waitFor();

  if (failures.length) throw new Error(failures.join('\n'));
  console.log('Mobile browser smoke test passed: briefing, Enclave, map, combat, inventory, Hunter Hall.');
} finally {
  await browser.close();
}
