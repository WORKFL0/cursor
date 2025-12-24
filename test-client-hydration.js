const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for the test button
  await page.waitForTimeout(2000);

  console.log('\n📋 Looking for test button...');
  const buttonExists = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const button = buttons.find(b => b.textContent?.includes('Test Click'));
    return {
      exists: !!button,
      text: button?.textContent,
      initialCount: button?.textContent?.match(/\d+/)?.[0]
    };
  });

  console.log('Test button:', buttonExists);

  if (buttonExists.exists) {
    console.log('\n🖱️  Clicking test button...');
    await page.click('text=Test Click');
    await page.waitForTimeout(500);

    const afterClick = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(b => b.textContent?.includes('Test Click'));
      return {
        text: button?.textContent,
        count: button?.textContent?.match(/\d+/)?.[0]
      };
    });

    console.log('After click:', afterClick);

    if (parseInt(afterClick.count) > parseInt(buttonExists.initialCount)) {
      console.log('\n✅ SUCCESS: Client-side React IS working! Button count increased.');
    } else {
      console.log('\n❌ FAILURE: Client-side React NOT working. Count did not change.');
    }
  } else {
    console.log('\n❌ Test button not found');
  }

  // Keep open to see result
  await page.waitForTimeout(3000);

  await browser.close();
})();
