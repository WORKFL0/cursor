const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Check if event listeners are attached
  const eventInfo = await page.evaluate(() => {
    const results = [];

    // Find all .relative divs in header
    const relativeDivs = Array.from(document.querySelectorAll('header .relative'));

    relativeDivs.forEach((div, index) => {
      const button = div.querySelector('button');
      const dropdown = div.querySelector('div[class*="opacity"]');

      // Try to trigger mouseenter manually and see if state changes
      results.push({
        index,
        buttonText: button?.textContent?.trim(),
        hasButton: !!button,
        hasDropdown: !!dropdown,
        dropdownInitialOpacity: dropdown ? window.getComputedStyle(dropdown).opacity : null
      });
    });

    return {
      totalRelativeDivs: relativeDivs.length,
      results
    };
  });

  console.log('\n📋 Event Listener Investigation:');
  console.log(JSON.stringify(eventInfo, null, 2));

  // Now try clicking on the Services button to see if onClick works
  console.log('\n🖱️  Attempting to click Services button...');
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('header button'));
    const servicesButton = buttons.find(b => b.textContent?.includes('Services'));

    if (servicesButton) {
      servicesButton.click();
      return true;
    }
    return false;
  });

  console.log(`Click attempted: ${clicked}`);

  // Check state after click
  await page.waitForTimeout(500);

  const afterClick = await page.evaluate(() => {
    const dropdown = document.querySelector('header div[class*="opacity"]');
    if (!dropdown) return null;

    const styles = window.getComputedStyle(dropdown);
    return {
      opacity: styles.opacity,
      visibility: styles.visibility,
      className: dropdown.className
    };
  });

  console.log('\n📊 State after click:', afterClick);

  await browser.close();
})();
