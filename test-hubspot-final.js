const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🔍 FINAL HUBSPOT CONTACT FORM TEST\n');
  console.log('=' . repeat(60));

  console.log('\n1️⃣  Navigating to /contact...');
  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000); // Give HubSpot time to load

  console.log('\n2️⃣  Checking HubSpot script...');
  const scriptLoaded = await page.evaluate(() => {
    return {
      hasHbspt: typeof window.hbspt !== 'undefined',
      scriptLoaded: window.__hubspotScriptLoaded === true
    };
  });
  console.log('  window.hbspt exists:', scriptLoaded.hasHbspt ? '✅ YES' : '❌ NO');
  console.log('  Script loaded flag:', scriptLoaded.scriptLoaded ? '✅ TRUE' : '❌ FALSE');

  console.log('\n3️⃣  Checking for HubSpot iframe...');
  const iframeCheck = await page.evaluate(() => {
    const iframe = document.querySelector('#hubspot-contact-form iframe');
    return {
      iframeExists: !!iframe,
      iframeId: iframe?.id || 'N/A',
      iframeTitle: iframe?.title || 'N/A',
      iframeHeight: iframe?.style.height || 'N/A',
      iframeSrc: iframe?.src || 'N/A'
    };
  });

  console.log('  Iframe exists:', iframeCheck.iframeExists ? '✅ YES' : '❌ NO');
  console.log('  Iframe ID:', iframeCheck.iframeId);
  console.log('  Iframe title:', iframeCheck.iframeTitle);
  console.log('  Iframe height:', iframeCheck.iframeHeight);
  console.log('  Iframe src:', iframeCheck.iframeSrc.substring(0, 100) + '...');

  console.log('\n4️⃣  Checking UI state...');
  const uiState = await page.evaluate(() => {
    const text = document.body.textContent;
    return {
      showingLoader: text.includes('Formulier laden') || text.includes('Loading form'),
      showingError: text.includes('Formulier kon niet worden geladen'),
      hasTitle: text.includes('Stuur ons een bericht') || text.includes('Send us a message')
    };
  });

  console.log('  Loading state:', uiState.showingLoader ? '⏳ SHOWING' : '✅ HIDDEN');
  console.log('  Error state:', uiState.showingError ? '❌ SHOWING' : '✅ HIDDEN');
  console.log('  Has form title:', uiState.hasTitle ? '✅ YES' : '❌ NO');

  console.log('\n5️⃣  Taking screenshot...');
  await page.screenshot({ path: 'hubspot-form-final.png', fullPage: true });
  console.log('  ✅ Screenshot saved: hubspot-form-final.png');

  await browser.close();

  // Final verdict
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL VERDICT\n');

  const isWorking =
    scriptLoaded.hasHbspt &&
    scriptLoaded.scriptLoaded &&
    iframeCheck.iframeExists &&
    !uiState.showingError &&
    !uiState.showingLoader;

  if (isWorking) {
    console.log('✅✅✅ HUBSPOT CONTACT FORM IS WORKING! ✅✅✅');
    console.log('');
    console.log('✅ HubSpot script loaded successfully');
    console.log('✅ Form iframe created');
    console.log('✅ No errors or loading states');
    console.log('✅ Ready for user input');
    console.log('');
    console.log('The form is now functional and ready to receive submissions!');
  } else {
    console.log('⚠️  ISSUES DETECTED:');
    if (!scriptLoaded.hasHbspt) console.log('  ❌ HubSpot script not loaded');
    if (!iframeCheck.iframeExists) console.log('  ❌ Form iframe not created');
    if (uiState.showingError) console.log('  ❌ Error state showing');
    if (uiState.showingLoader) console.log('  ❌ Still loading');
  }

  console.log('='.repeat(60));
})();
