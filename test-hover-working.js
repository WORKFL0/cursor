const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  await page.waitForTimeout(2000);

  console.log('\n📋 Looking for hover test div...');
  const hoverDiv = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    const hoverDiv = divs.find(d => d.textContent?.includes('Hover Test'));
    return {
      exists: !!hoverDiv,
      initialText: hoverDiv?.textContent
    };
  });

  console.log('Hover div:', hoverDiv);

  if (hoverDiv.exists) {
    console.log('\n🖱️  Hovering over test div...');

    // Use Playwright's hover on the blue div
    await page.locator('text=Hover Test').hover();
    await page.waitForTimeout(500);

    const afterHover = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const hoverDiv = divs.find(d => d.textContent?.includes('Hover Test'));
      return {
        text: hoverDiv?.textContent,
        isHovered: hoverDiv?.textContent?.includes('HOVERED')
      };
    });

    console.log('After hover:', afterHover);

    if (afterHover.isHovered) {
      console.log('\n✅ SUCCESS: Mouse hover events ARE working!');
      console.log('This means the header dropdowns should also work...');
    } else {
      console.log('\n❌ FAILURE: Mouse hover events NOT working');
    }
  }

  await page.waitForTimeout(3000);
  await browser.close();
})();
