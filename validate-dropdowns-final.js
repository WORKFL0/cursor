const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('✅ Waiting for header to load...');
  await page.waitForSelector('header', { timeout: 10000 });

  // Remove any blocking overlays
  console.log('🗑️  Removing any blocking overlays...');
  await page.evaluate(() => {
    // Remove all fixed/absolute overlays with high z-index
    const overlays = Array.from(document.querySelectorAll('[class*="fixed"], [class*="absolute"]'));
    overlays.forEach(el => {
      const styles = window.getComputedStyle(el);
      const zIndex = parseInt(styles.zIndex);
      if (zIndex > 50 && styles.position === 'fixed' && el.tagName !== 'HEADER') {
        console.log('Removing overlay:', el.className);
        el.remove();
      }
    });
  });

  await page.waitForTimeout(1000);

  console.log('\n📸 SCREENSHOT 1: Header initial state (BEFORE)');
  await page.screenshot({ path: 'header-before.png', fullPage: false });

  console.log('\n📋 Checking header structure...');
  const headerStructure = await page.evaluate(() => {
    const header = document.querySelector('header');
    const buttons = Array.from(header.querySelectorAll('button'));
    const dropdowns = Array.from(header.querySelectorAll('[class*="opacity-0"]'));

    return {
      headerExists: !!header,
      totalButtons: buttons.length,
      buttonTexts: buttons.map(b => b.textContent.trim()),
      totalDropdowns: dropdowns.length
    };
  });

  console.log('Header structure:', JSON.stringify(headerStructure, null, 2));

  console.log('\n🖱️  TEST 1: Hovering over "Services" button...');
  const servicesButton = await page.locator('button:has-text("Services")').first();
  await servicesButton.hover({force: true});
  await page.waitForTimeout(500);

  const servicesCheck = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const servicesButton = buttons.find(b => b.textContent.includes('Services'));
    const parent = servicesButton?.parentElement;
    const dropdown = parent?.querySelector('[class*="opacity"]');

    if (!dropdown) return { found: false };

    const styles = window.getComputedStyle(dropdown);
    return {
      found: true,
      opacity: styles.opacity,
      visibility: styles.visibility,
      pointerEvents: styles.pointerEvents,
      className: dropdown.className,
      linksCount: dropdown.querySelectorAll('a').length
    };
  });

  console.log('Services dropdown:', JSON.stringify(servicesCheck, null, 2));

  if (servicesCheck.opacity === '1' && servicesCheck.visibility === 'visible') {
    console.log('✅ SUCCESS: Services dropdown IS visible!');
    await page.screenshot({ path: 'services-dropdown-open.png' });
  } else {
    console.log('❌ FAILURE: Services dropdown NOT visible');
    console.log('⚠️  This means CSS :hover is NOT working in the browser');
  }

  console.log('\n' + '='.repeat(60));
  console.log('RESULT');
  console.log('='.repeat(60));

  if (servicesCheck.opacity === '1') {
    console.log('✅ CSS HOVER IS WORKING!');
    console.log('✅ Services dropdown has ' + servicesCheck.linksCount + ' links');
  } else {
    console.log('❌ CSS HOVER NOT WORKING');
    console.log('This indicates a fundamental issue with the Tailwind group-hover pattern');
  }

  console.log('\n📸 Screenshots saved:');
  console.log('  - header-before.png');
  console.log('  - services-dropdown-open.png');

  await page.waitForTimeout(5000);
  await browser.close();
})();
