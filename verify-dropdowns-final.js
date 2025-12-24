const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Test all 4 dropdowns - using ENGLISH text as shown in DOM
  const dropdowns = [
    { name: 'Services', buttonText: 'Services', screenshot: 'dropdown-services-final.png' },
    { name: 'Sectors', buttonText: 'Sectors', screenshot: 'dropdown-sectors-final.png' },
    { name: 'About', buttonText: 'About us', screenshot: 'dropdown-about-final.png' },
    { name: 'Contact', buttonText: 'Contact', screenshot: 'dropdown-contact-final.png' }
  ];

  for (const dropdown of dropdowns) {
    console.log(`\n📋 Testing ${dropdown.name} dropdown...`);

    // Use page.evaluate to hover since buttons are visible
    await page.evaluate((btnText) => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const targetButton = buttons.find(b => b.textContent?.trim() === btnText);
      if (targetButton) {
        targetButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      }
    }, dropdown.buttonText);

    // Wait for animation to complete
    await page.waitForTimeout(500);

    // Check dropdown state
    const state = await page.evaluate((btnText) => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const targetButton = buttons.find(b => b.textContent?.trim() === btnText);
      if (!targetButton) return null;

      // Find the parent with .relative class
      const parent = targetButton.closest('.relative');
      if (!parent) return null;

      // Find dropdown div
      const dropdownDiv = parent.querySelector('div[class*="opacity"]');
      if (!dropdownDiv) return null;

      const styles = window.getComputedStyle(dropdownDiv);
      return {
        opacity: styles.opacity,
        visibility: styles.visibility,
        transform: styles.transform,
        hasLinks: dropdownDiv.querySelectorAll('a').length,
        isFullyVisible: styles.opacity === '1' && styles.visibility === 'visible'
      };
    }, dropdown.buttonText);

    console.log(`   Opacity: ${state?.opacity}`);
    console.log(`   Visibility: ${state?.visibility}`);
    console.log(`   Links found: ${state?.hasLinks}`);
    console.log(`   Fully visible: ${state?.isFullyVisible ? '✅ YES' : '❌ NO'}`);

    // Take screenshot of entire page
    await page.screenshot({ path: dropdown.screenshot, fullPage: false });
    console.log(`   📸 Screenshot: ${dropdown.screenshot}`);

    // Close dropdown
    await page.evaluate(() => {
      const header = document.querySelector('header');
      if (header) {
        const allDivs = Array.from(header.querySelectorAll('.relative'));
        allDivs.forEach(div => {
          div.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        });
      }
    });
    await page.waitForTimeout(300);
  }

  await browser.close();
  console.log('\n✅ All dropdown tests complete!');
})();
