const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🔍 TESTING HUBSPOT CONTACT FORM\n');
  console.log('=' . repeat(60));

  // Listen to console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    if (text.includes('HubSpot') || text.includes('hbspt') || text.includes('Failed')) {
      console.log(`[${msg.type().toUpperCase()}] ${text}`);
    }
  });

  // Listen to page errors
  page.on('pageerror', error => {
    console.log(`❌ PAGE ERROR: ${error.message}`);
  });

  console.log('\n1️⃣  Navigating to /contact page...');
  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log('\n2️⃣  Checking if HubSpot script is loaded...');
  const scriptCheck = await page.evaluate(() => {
    return {
      hasHbsptGlobal: typeof window.hbspt !== 'undefined',
      hasHubSpotScript: !!document.querySelector('script[src*="hsforms.net"]'),
      scriptSrc: document.querySelector('script[src*="hsforms.net"]')?.src || 'Not found',
      loadingFlag: window.__hubspotScriptLoading,
      loadedFlag: window.__hubspotScriptLoaded
    };
  });

  console.log('  HubSpot global (window.hbspt):', scriptCheck.hasHbsptGlobal ? '✅ EXISTS' : '❌ NOT FOUND');
  console.log('  HubSpot script tag:', scriptCheck.hasHubSpotScript ? '✅ FOUND' : '❌ NOT FOUND');
  console.log('  Script src:', scriptCheck.scriptSrc);
  console.log('  Loading flag:', scriptCheck.loadingFlag);
  console.log('  Loaded flag:', scriptCheck.loadedFlag);

  console.log('\n3️⃣  Checking for contact form container...');
  const formContainer = await page.evaluate(() => {
    const container = document.querySelector('#hubspot-contact-form');
    return {
      exists: !!container,
      hasContent: container ? container.children.length > 0 : false,
      className: container?.className || 'N/A',
      innerHTML: container ? container.innerHTML.substring(0, 200) : 'N/A'
    };
  });

  console.log('  Form container (#hubspot-contact-form):', formContainer.exists ? '✅ EXISTS' : '❌ NOT FOUND');
  console.log('  Has form content:', formContainer.hasContent ? '✅ YES' : '❌ EMPTY');
  console.log('  Container classes:', formContainer.className);
  console.log('  Container content preview:', formContainer.innerHTML);

  console.log('\n4️⃣  Checking for loading/error states...');
  const uiState = await page.evaluate(() => {
    const bodyText = document.body.textContent;
    return {
      showingLoader: bodyText.includes('Formulier laden') || bodyText.includes('Loading form'),
      showingError: bodyText.includes('Formulier kon niet worden geladen') || bodyText.includes('Form could not be loaded'),
      hasContactInfo: bodyText.includes('info@workflo.it')
    };
  });

  console.log('  Showing loader:', uiState.showingLoader ? '⏳ YES' : '✅ NO');
  console.log('  Showing error:', uiState.showingError ? '❌ YES' : '✅ NO');
  console.log('  Has fallback contact:', uiState.hasContactInfo ? '✅ YES' : '⚠️ NO');

  console.log('\n5️⃣  Checking if HubSpot form is actually rendered...');
  await page.waitForTimeout(3000); // Give it more time to fully load

  const formFields = await page.evaluate(() => {
    const container = document.querySelector('#hubspot-contact-form');
    if (!container) return { found: false };

    const inputs = container.querySelectorAll('input, textarea, select');
    const submitButton = container.querySelector('input[type="submit"], button[type="submit"]');

    return {
      found: true,
      totalInputs: inputs.length,
      inputTypes: Array.from(inputs).map(i => i.type || i.tagName.toLowerCase()),
      hasSubmitButton: !!submitButton,
      submitButtonText: submitButton?.value || submitButton?.textContent || 'N/A'
    };
  });

  if (formFields.found) {
    console.log('  ✅ FORM IS RENDERED!');
    console.log('  Total form fields:', formFields.totalInputs);
    console.log('  Field types:', formFields.inputTypes.join(', '));
    console.log('  Has submit button:', formFields.hasSubmitButton ? '✅ YES' : '❌ NO');
    console.log('  Submit button text:', formFields.submitButtonText);
  } else {
    console.log('  ❌ FORM NOT RENDERED');
  }

  console.log('\n6️⃣  Taking screenshot...');
  await page.screenshot({ path: 'hubspot-contact-form-test.png', fullPage: true });
  console.log('  ✅ Screenshot saved as hubspot-contact-form-test.png');

  console.log('\n7️⃣  Console messages summary:');
  const hubspotMessages = consoleMessages.filter(m =>
    m.text.includes('HubSpot') || m.text.includes('hbspt') || m.text.includes('Failed')
  );

  if (hubspotMessages.length > 0) {
    hubspotMessages.forEach(msg => {
      console.log(`  [${msg.type}] ${msg.text}`);
    });
  } else {
    console.log('  ℹ️ No HubSpot-related console messages');
  }

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY\n');

  const allPassed =
    scriptCheck.hasHbsptGlobal &&
    scriptCheck.hasHubSpotScript &&
    formContainer.exists &&
    formContainer.hasContent &&
    !uiState.showingError &&
    formFields.found &&
    formFields.totalInputs > 0;

  if (allPassed) {
    console.log('✅ HUBSPOT CONTACT FORM IS WORKING!');
    console.log('✅ Script loaded successfully');
    console.log('✅ Form rendered with ' + formFields.totalInputs + ' fields');
    console.log('✅ No errors detected');
  } else {
    console.log('⚠️  HUBSPOT CONTACT FORM HAS ISSUES:');
    if (!scriptCheck.hasHbsptGlobal) console.log('  ❌ HubSpot script not loaded');
    if (!formContainer.exists) console.log('  ❌ Form container not found');
    if (!formContainer.hasContent) console.log('  ❌ Form container is empty');
    if (uiState.showingError) console.log('  ❌ Error state is showing');
    if (!formFields.found || formFields.totalInputs === 0) console.log('  ❌ Form not rendered');
  }

  console.log('='.repeat(60));
})();
