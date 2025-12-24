const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Show browser to see what happens
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('\n📋 Testing Services dropdown with REAL hover...');

  // Find all buttons in header
  const buttons = await page.locator('header button').all();
  console.log(`Found ${buttons.length} buttons in header`);

  // Test first button (Services)
  const servicesButton = buttons[0];
  const buttonText = await servicesButton.textContent();
  console.log(`\nHovering over button: "${buttonText?.trim()}"`);

  // Take "before" screenshot
  await page.screenshot({ path: 'before-hover.png' });

  // REAL hover using Playwright's .hover()
  await servicesButton.hover();

  // Wait for animation
  await page.waitForTimeout(500);

  // Take "after" screenshot
  await page.screenshot({ path: 'after-hover.png' });

  // Check dropdown state
  const state = await page.evaluate(() => {
    const dropdowns = Array.from(document.querySelectorAll('header div[class*="opacity"]'));
    const firstDropdown = dropdowns[0];

    if (!firstDropdown) return null;

    const styles = window.getComputedStyle(firstDropdown);
    return {
      opacity: styles.opacity,
      visibility: styles.visibility,
      className: firstDropdown.className,
      hasVisibleClass: firstDropdown.className.includes('opacity-100'),
      links: firstDropdown.querySelectorAll('a').length
    };
  });

  console.log('\n📊 Dropdown State After Real Hover:');
  console.log(JSON.stringify(state, null, 2));

  // Keep browser open for 5 seconds to visually verify
  await page.waitForTimeout(5000);

  await browser.close();
  console.log('\n✅ Test complete - check before-hover.png and after-hover.png');
})();
