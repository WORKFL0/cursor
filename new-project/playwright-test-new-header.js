const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  console.log('✅ Waiting for header to load...');
  await page.waitForSelector('header', { timeout: 10000 });
  
  console.log('✅ Taking screenshot of initial header...');
  await page.screenshot({ path: 'header-new-initial.png' });
  
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
  await page.hover('text=Diensten');
  await page.waitForTimeout(500);
  
  console.log('✅ Taking screenshot with Diensten dropdown open...');
  await page.screenshot({ path: 'header-diensten-dropdown.png' });
  
  console.log('\n📋 Checking if dropdown is visible after hover...');
  const dienstenVisible = await page.evaluate(() => {
    const visible = document.querySelectorAll('[class*="opacity-100"][class*="visible"]');
    return {
      visibleDropdowns: visible.length,
      texts: Array.from(visible).map(d => d.textContent?.substring(0, 200))
    };
  });
  
  console.log('Visible dropdowns after hover:', dienstenVisible);
  
  await browser.close();
  console.log('\n✅ SCREENSHOTS SAVED!');
})();
