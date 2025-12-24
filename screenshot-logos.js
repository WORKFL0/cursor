const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('✅ Scrolling to client logos section...');
  await page.evaluate(() => {
    const section = document.querySelector('section:has(h2)');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);

  console.log('✅ Taking screenshot of client logos...');
  const clientLogosSection = await page.locator('section:has-text("IT Partners")').first();
  await clientLogosSection.screenshot({ path: 'client-logos-section.png' });

  await browser.close();
  console.log('\n✅ Screenshot saved: client-logos-section.png');
})();
