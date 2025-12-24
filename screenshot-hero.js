const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('✅ Waiting for hero section...');
  await page.waitForSelector('section', { timeout: 10000 });
  await page.waitForTimeout(1000); // Wait for animations

  console.log('✅ Taking screenshot of hero section...');
  await page.screenshot({
    path: 'hero-section-current.png',
    fullPage: false
  });

  console.log('\n📋 Analyzing hero section...');
  const heroAnalysis = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h1Styles = h1 ? window.getComputedStyle(h1) : null;

    return {
      h1Text: h1?.textContent,
      h1FontSize: h1Styles?.fontSize,
      h1LineHeight: h1Styles?.lineHeight,
      hasGradient: document.querySelector('[class*="gradient"]') !== null,
      buttonCount: document.querySelectorAll('a[href="/contact"], a[href="/prijzen"]').length
    };
  });

  console.log('Hero Section Analysis:', heroAnalysis);

  await browser.close();
  console.log('\n✅ Screenshot saved: hero-section-current.png');
})();
