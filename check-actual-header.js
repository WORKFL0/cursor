const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('🔍 Checking actual header on http://localhost:3000...\n');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Check what's actually in the DOM
  const reality = await page.evaluate(() => {
    const nav = document.querySelector('header nav');
    const buttons = Array.from(document.querySelectorAll('header button'));
    const links = Array.from(document.querySelectorAll('header a'));

    return {
      navHTML: nav?.innerHTML.substring(0, 1000),
      buttons: buttons.map(b => ({
        text: b.textContent?.trim(),
        hasChevron: b.innerHTML.includes('svg'),
        className: b.className
      })),
      links: links.map(l => ({
        text: l.textContent?.trim(),
        href: l.getAttribute('href')
      })),
      dropdownDivs: document.querySelectorAll('header div[class*="opacity"]').length,
      allHeaderText: document.querySelector('header')?.textContent?.substring(0, 500)
    };
  });

  console.log('📋 ACTUAL HEADER CONTENT:');
  console.log('Buttons found:', reality.buttons);
  console.log('\nLinks found:', reality.links.slice(0, 10));
  console.log('\nDropdown divs with opacity:', reality.dropdownDivs);
  console.log('\nHeader text preview:', reality.allHeaderText);

  await page.screenshot({ path: 'actual-header-check.png', fullPage: false });

  await browser.close();
  console.log('\n✅ Screenshot saved: actual-header-check.png');
})();
