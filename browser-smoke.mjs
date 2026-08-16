import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
const failures = [];
page.on('pageerror', e => failures.push(`pageerror: ${e.message}`));
page.on('console', msg => { if (msg.type() === 'error') failures.push(`console: ${msg.text()}`); });

try {
  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('#app');

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
