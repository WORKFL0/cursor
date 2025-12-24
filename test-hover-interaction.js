const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('🔍 Testing hover interaction...\n');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('📸 Initial state...');
  await page.screenshot({ path: 'hover-test-1-initial.png' });

  console.log('\n🖱️ Hovering over "Services" button...');
  const servicesButton = page.locator('button:has-text("Services")');
  await servicesButton.hover();

  console.log('⏳ Waiting for dropdown animation...');
  await page.waitForTimeout(500);

  console.log('📸 After hover...');
  await page.screenshot({ path: 'hover-test-2-services-hover.png' });

  // Check if dropdown became visible
  const dropdownState = await page.evaluate(() => {
    const dropdowns = document.querySelectorAll('header div[class*="absolute"]');
    return Array.from(dropdowns).map(d => ({
      visible: d.classList.contains('opacity-100') && d.classList.contains('visible'),
      opacity: window.getComputedStyle(d).opacity,
      visibility: window.getComputedStyle(d).visibility,
      classes: d.className,
      text: d.textContent?.substring(0, 100)
    }));
  });

  console.log('\n📋 Dropdown states after hover:');
  console.log(JSON.stringify(dropdownState, null, 2));

  console.log('\n⏸️ Keeping browser open for 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('\n✅ Test complete');
})();
