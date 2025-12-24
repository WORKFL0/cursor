const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });

  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.toString());
  });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait a bit for any delayed errors
  await page.waitForTimeout(2000);

  console.log('\n📋 Console Messages:');
  const errors = consoleMessages.filter(m => m.type === 'error');
  const warnings = consoleMessages.filter(m => m.type === 'warning');

  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(e => console.log(`  - ${e.text}`));
  } else {
    console.log('  ✅ No console errors');
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(w => console.log(`  - ${w.text}`));
  }

  if (pageErrors.length > 0) {
    console.log('\n❌ PAGE ERRORS:');
    pageErrors.forEach(e => console.log(`  - ${e}`));
  }

  // Check if React is hydrated
  const reactStatus = await page.evaluate(() => {
    const root = document.getElementById('__next');
    return {
      hasReactRoot: !!root,
      isHydrated: !!root?.dataset?.reactroot || !!root?._reactRootContainer
    };
  });

  console.log('\n📋 React Status:', reactStatus);

  await browser.close();
})();
