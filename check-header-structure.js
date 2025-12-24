const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Get full header structure
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return { error: 'No header found' };

    const allButtons = Array.from(header.querySelectorAll('button'));
    const allLinks = Array.from(header.querySelectorAll('a'));
    const allDivs = Array.from(header.querySelectorAll('div'));

    return {
      totalButtons: allButtons.length,
      buttons: allButtons.map(b => ({
        text: b.textContent?.trim(),
        className: b.className,
        hasChevron: b.innerHTML.includes('svg')
      })),
      totalLinks: allLinks.length,
      totalDivs: allDivs.length,
      dropdownDivsWithOpacity: header.querySelectorAll('div[class*="opacity"]').length
    };
  });

  console.log('\n📋 Header Structure:');
  console.log(JSON.stringify(headerInfo, null, 2));

  await browser.close();
})();
