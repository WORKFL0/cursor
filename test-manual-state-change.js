const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('\n📋 Manually changing dropdown class to opacity-100...');

  // Manually change the class to see if CSS works
  await page.evaluate(() => {
    const dropdown = document.querySelector('header div[class*="opacity-0 invisible"]');
    if (dropdown) {
      // Remove old classes and add new ones
      dropdown.className = dropdown.className
        .replace('opacity-0', 'opacity-100')
        .replace('invisible', 'visible')
        .replace('-translate-y-2', 'translate-y-0')
        .replace('pointer-events-none', '');
    }
  });

  await page.waitForTimeout(500);

  const afterManual = await page.evaluate(() => {
    const dropdown = document.querySelector('header div[class*="opacity-100"]');
    if (!dropdown) return null;

    const styles = window.getComputedStyle(dropdown);
    return {
      opacity: styles.opacity,
      visibility: styles.visibility,
      className: dropdown.className,
      links: dropdown.querySelectorAll('a').length
    };
  });

  console.log('\n📊 After Manual Class Change:');
  console.log(JSON.stringify(afterManual, null, 2));

  // Take screenshot
  await page.screenshot({ path: 'manual-dropdown-open.png' });
  console.log('\n📸 Screenshot saved: manual-dropdown-open.png');

  // Keep browser open to see the result
  await page.waitForTimeout(5000);

  await browser.close();
})();
