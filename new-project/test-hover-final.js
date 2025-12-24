const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForSelector('header');
  
  console.log('✅ Testing Services dropdown hover...');
  const servicesButton = await page.locator('button:has-text("Services")').first();
  await servicesButton.hover();
  await page.waitForTimeout(300);
  
  await page.screenshot({ path: 'dropdown-services-open.png', fullPage: false });
  
  const isVisible = await page.evaluate(() => {
    const dropdown = document.querySelector('.opacity-100.visible');
    return dropdown ? {
      visible: true,
      content: dropdown.textContent?.substring(0, 150)
    } : { visible: false };
  });
  
  console.log('Services dropdown state:', isVisible);
  
  await browser.close();
  console.log('✅ Screenshot saved: dropdown-services-open.png');
})();
