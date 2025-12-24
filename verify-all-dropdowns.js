const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Test all 4 dropdowns
  const dropdowns = [
    { name: 'Services', buttonText: 'Diensten', screenshot: 'dropdown-services-working.png' },
    { name: 'Sectors', buttonText: 'Sectoren', screenshot: 'dropdown-sectors-working.png' },
    { name: 'About', buttonText: 'Over ons', screenshot: 'dropdown-about-working.png' },
    { name: 'Contact', buttonText: 'Contact', screenshot: 'dropdown-contact-working.png' }
  ];

  for (const dropdown of dropdowns) {
    console.log(`\n📋 Testing ${dropdown.name} dropdown...`);

    // Find the button by text content
    const button = page.locator(`header button:has-text("${dropdown.buttonText}")`).first();

    // Hover over the button
    await button.hover();

    // Wait for animation to complete (200ms transition + buffer)
    await page.waitForTimeout(500);

    // Check dropdown state
    const state = await page.evaluate((btnText) => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const targetButton = buttons.find(b => b.textContent?.includes(btnText));
      if (!targetButton) return null;

      // Find the dropdown div (next sibling or within parent)
      const parent = targetButton.closest('.relative');
      const dropdownDiv = parent?.querySelector('div[class*="opacity"]');

      if (!dropdownDiv) return null;

      const styles = window.getComputedStyle(dropdownDiv);
      return {
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform,
        classes: dropdownDiv.className,
        hasLinks: dropdownDiv.querySelectorAll('a').length
      };
    }, dropdown.buttonText);

    console.log(`   Opacity: ${state?.opacity}`);
    console.log(`   Visibility: ${state?.visibility}`);
    console.log(`   Links found: ${state?.hasLinks}`);

    // Take screenshot of header area with dropdown open
    const header = page.locator('header').first();
    await header.screenshot({ path: dropdown.screenshot });
    console.log(`   ✅ Screenshot saved: ${dropdown.screenshot}`);

    // Move mouse away to close dropdown
    await page.mouse.move(1920 / 2, 1080 / 2);
    await page.waitForTimeout(300);
  }

  await browser.close();
  console.log('\n✅ All dropdown tests complete!');
})();
