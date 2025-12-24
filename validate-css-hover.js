const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('✅ Waiting for header to load...');
  await page.waitForSelector('header', { timeout: 10000 });

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
      totalDropdowns: dropdowns.length,
      dropdownClasses: dropdowns.slice(0, 4).map(d => d.className)
    };
  });

  console.log('Header structure:', JSON.stringify(headerStructure, null, 2));

  console.log('\n🖱️  TEST 1: Hovering over "Services" button...');
  await page.hover('button:has-text("Services")');
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

  console.log('Services dropdown after hover:', JSON.stringify(servicesCheck, null, 2));

  if (servicesCheck.opacity === '1' && servicesCheck.visibility === 'visible') {
    console.log('✅ SUCCESS: Services dropdown IS visible!');
    await page.screenshot({ path: 'services-dropdown-open.png' });
  } else {
    console.log('❌ FAILURE: Services dropdown NOT visible');
  }

  console.log('\n🖱️  Moving mouse away...');
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);

  console.log('\n🖱️  TEST 2: Hovering over "Sectors" button...');
  await page.hover('button:has-text("Sectors")');
  await page.waitForTimeout(500);

  const sectorsCheck = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const sectorsButton = buttons.find(b => b.textContent.includes('Sectors'));
    const parent = sectorsButton?.parentElement;
    const dropdown = parent?.querySelector('[class*="opacity"]');

    if (!dropdown) return { found: false };

    const styles = window.getComputedStyle(dropdown);
    return {
      found: true,
      opacity: styles.opacity,
      visibility: styles.visibility,
      className: dropdown.className,
      linksCount: dropdown.querySelectorAll('a').length
    };
  });

  console.log('Sectors dropdown after hover:', JSON.stringify(sectorsCheck, null, 2));

  if (sectorsCheck.opacity === '1' && sectorsCheck.visibility === 'visible') {
    console.log('✅ SUCCESS: Sectors dropdown IS visible!');
    await page.screenshot({ path: 'sectors-dropdown-open.png' });
  } else {
    console.log('❌ FAILURE: Sectors dropdown NOT visible');
  }

  console.log('\n🖱️  Moving mouse away...');
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);

  console.log('\n🖱️  TEST 3: Hovering over "About us" button...');
  await page.hover('button:has-text("About us")');
  await page.waitForTimeout(500);

  const aboutCheck = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const aboutButton = buttons.find(b => b.textContent.includes('About us'));
    const parent = aboutButton?.parentElement;
    const dropdown = parent?.querySelector('[class*="opacity"]');

    if (!dropdown) return { found: false };

    const styles = window.getComputedStyle(dropdown);
    return {
      found: true,
      opacity: styles.opacity,
      visibility: styles.visibility,
      className: dropdown.className,
      linksCount: dropdown.querySelectorAll('a').length
    };
  });

  console.log('About us dropdown after hover:', JSON.stringify(aboutCheck, null, 2));

  if (aboutCheck.opacity === '1' && aboutCheck.visibility === 'visible') {
    console.log('✅ SUCCESS: About us dropdown IS visible!');
    await page.screenshot({ path: 'about-dropdown-open.png' });
  } else {
    console.log('❌ FAILURE: About us dropdown NOT visible');
  }

  console.log('\n🖱️  Moving mouse away...');
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);

  console.log('\n🖱️  TEST 4: Hovering over "Contact" button...');
  await page.hover('button:has-text("Contact")');
  await page.waitForTimeout(500);

  const contactCheck = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const contactButton = buttons.find(b => b.textContent.includes('Contact') && !b.textContent.includes('Gratis'));
    const parent = contactButton?.parentElement;
    const dropdown = parent?.querySelector('[class*="opacity"]');

    if (!dropdown) return { found: false };

    const styles = window.getComputedStyle(dropdown);
    return {
      found: true,
      opacity: styles.opacity,
      visibility: styles.visibility,
      className: dropdown.className,
      linksCount: dropdown.querySelectorAll('a').length
    };
  });

  console.log('Contact dropdown after hover:', JSON.stringify(contactCheck, null, 2));

  if (contactCheck.opacity === '1' && contactCheck.visibility === 'visible') {
    console.log('✅ SUCCESS: Contact dropdown IS visible!');
    await page.screenshot({ path: 'contact-dropdown-open.png' });
  } else {
    console.log('❌ FAILURE: Contact dropdown NOT visible');
  }

  console.log('\n📸 SCREENSHOT 2: Final header with dropdowns tested (AFTER)');
  await page.screenshot({ path: 'header-after-all-tests.png', fullPage: false });

  console.log('\n' + '='.repeat(60));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(60));

  const allPassed =
    servicesCheck.opacity === '1' &&
    sectorsCheck.opacity === '1' &&
    aboutCheck.opacity === '1' &&
    contactCheck.opacity === '1';

  if (allPassed) {
    console.log('✅ ALL 4 DROPDOWNS WORKING WITH CSS HOVER!');
    console.log('✅ Services: ' + servicesCheck.linksCount + ' links');
    console.log('✅ Sectors: ' + sectorsCheck.linksCount + ' links');
    console.log('✅ About us: ' + aboutCheck.linksCount + ' links');
    console.log('✅ Contact: ' + contactCheck.linksCount + ' links');
  } else {
    console.log('❌ Some dropdowns still not working:');
    console.log('Services:', servicesCheck.opacity === '1' ? '✅' : '❌');
    console.log('Sectors:', sectorsCheck.opacity === '1' ? '✅' : '❌');
    console.log('About us:', aboutCheck.opacity === '1' ? '✅' : '❌');
    console.log('Contact:', contactCheck.opacity === '1' ? '✅' : '❌');
  }

  console.log('\n📸 Screenshots saved:');
  console.log('  - header-before.png');
  console.log('  - services-dropdown-open.png');
  console.log('  - sectors-dropdown-open.png');
  console.log('  - about-dropdown-open.png');
  console.log('  - contact-dropdown-open.png');
  console.log('  - header-after-all-tests.png');

  await page.waitForTimeout(3000);
  await browser.close();
})();
