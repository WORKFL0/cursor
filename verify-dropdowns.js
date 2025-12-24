const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('✅ Waiting for header to load...');
  await page.waitForSelector('header', { timeout: 10000 });

  console.log('\n📋 Checking for dropdown elements in DOM...');
  const dropdownsInDOM = await page.evaluate(() => {
    const dropdowns = document.querySelectorAll('[class*="opacity-0"]');
    return {
      totalDropdownDivs: dropdowns.length,
      dropdownTexts: Array.from(dropdowns).slice(0, 4).map(d => d.textContent?.substring(0, 100))
    };
  });

  console.log('Dropdowns in DOM:', dropdownsInDOM);

  console.log('\n🖱️ Hovering over "Diensten" button...');
  const servicesButton = await page.locator('button:has-text("Diensten")').first();
  await servicesButton.hover();
  await page.waitForTimeout(300);

  console.log('✅ Taking screenshot with dropdown open...');
  await page.screenshot({ path: 'dropdown-verification.png', fullPage: false });

  console.log('\n📋 Checking if dropdown is visible after hover...');
  const isVisible = await page.evaluate(() => {
    const dropdown = document.querySelector('.opacity-100.visible');
    return dropdown ? {
      visible: true,
      content: dropdown.textContent?.substring(0, 150)
    } : { visible: false };
  });

  console.log('Dropdown state:', isVisible);

  await browser.close();
  console.log('\n✅ VERIFICATION COMPLETE - Screenshot saved: dropdown-verification.png');
})();
