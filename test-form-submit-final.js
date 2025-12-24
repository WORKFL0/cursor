const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔍 FINAL FORM SUBMISSION TEST WITH RECAPTCHA\n');

  // Track console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ CONSOLE ERROR: ${msg.text()}`);
    }
  });

  // Track all HubSpot requests
  const requests = [];
  page.on('request', request => {
    const url = request.url();
    if (url.includes('hubspot') || url.includes('hsforms') || url.includes('recaptcha')) {
      requests.push({
        method: request.method(),
        url: url.substring(0, 120),
        type: url.includes('recaptcha') ? 'RECAPTCHA' : 'HUBSPOT'
      });
      console.log(`📤 ${request.method()} ${url.substring(0, 100)}`);
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('submit') || url.includes('submissions')) {
      console.log(`📥 RESPONSE: ${response.status()} ${url.substring(0, 100)}`);
      try {
        const text = await response.text();
        console.log(`📄 RESPONSE BODY: ${text.substring(0, 300)}`);
      } catch (e) {
        // Ignore
      }
    }
  });

  console.log('1️⃣  Navigating to contact page...\n');
  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle' });

  // First, close cookie banner if it appears
  console.log('2️⃣  Checking for cookie banner...\n');
  try {
    const acceptButton = await page.waitForSelector('text=Accepteer alle cookies', { timeout: 3000 });
    if (acceptButton) {
      console.log('   Found cookie banner, clicking accept...');
      await acceptButton.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.log('   No cookie banner found (or already accepted)');
  }

  await page.waitForTimeout(5000);

  console.log('\n3️⃣  Checking if reCAPTCHA loaded...\n');
  const iframeElement = await page.$('#hubspot-contact-form iframe');
  if (!iframeElement) {
    console.log('❌ No iframe found!');
    await browser.close();
    return;
  }

  const frame = await iframeElement.contentFrame();

  const recaptchaStatus = await frame.evaluate(() => {
    const recaptchaDiv = document.querySelector('.hs_recaptcha');
    const recaptchaInput = document.querySelector('#hs-recaptcha-response');
    const recaptchaScripts = Array.from(document.querySelectorAll('script')).filter(s =>
      s.src.includes('recaptcha')
    );

    return {
      hasRecaptchaDiv: !!recaptchaDiv,
      hasRecaptchaInput: !!recaptchaInput,
      recaptchaInputValue: recaptchaInput?.value || '',
      recaptchaScriptsCount: recaptchaScripts.length,
      recaptchaVisible: recaptchaDiv ? recaptchaDiv.offsetParent !== null : false
    };
  });

  console.log('reCAPTCHA status:');
  console.log('  Has reCAPTCHA div:', recaptchaStatus.hasRecaptchaDiv ? '✅' : '❌');
  console.log('  Has reCAPTCHA input:', recaptchaStatus.hasRecaptchaInput ? '✅' : '❌');
  console.log('  reCAPTCHA scripts loaded:', recaptchaStatus.recaptchaScriptsCount);
  console.log('  reCAPTCHA visible:', recaptchaStatus.recaptchaVisible ? '✅' : '❌');
  console.log('  reCAPTCHA input value:', recaptchaStatus.recaptchaInputValue || '(empty)');

  console.log('\n4️⃣  Filling form with valid data...\n');
  await frame.fill('[name="firstname"]', 'Jan');
  await frame.fill('[name="email"]', 'jan.test@gmail.com');
  await page.waitForTimeout(2000);

  console.log('5️⃣  Checking form validation before submit...\n');
  const preSubmitCheck = await frame.evaluate(() => {
    const errors = document.querySelectorAll('.hs-error-msg');
    const submitButton = document.querySelector('input[type="submit"]');
    const recaptchaResponse = document.querySelector('#hs-recaptcha-response');

    return {
      errorCount: errors.length,
      errorMessages: Array.from(errors).map(e => e.textContent.trim()),
      submitButtonDisabled: submitButton?.disabled || false,
      recaptchaValue: recaptchaResponse?.value || 'EMPTY'
    };
  });

  console.log('Form validation:');
  console.log('  Errors:', preSubmitCheck.errorCount);
  if (preSubmitCheck.errorMessages.length > 0) {
    preSubmitCheck.errorMessages.forEach(msg => console.log(`    - ${msg}`));
  }
  console.log('  Submit button disabled:', preSubmitCheck.submitButtonDisabled ? '⚠️ YES' : '✅ NO');
  console.log('  reCAPTCHA value:', preSubmitCheck.recaptchaValue);

  if (preSubmitCheck.errorCount > 0) {
    console.log('\n❌ Cannot submit - validation errors present');
    console.log('\nBrowser will stay open for inspection...');
    await page.waitForTimeout(30000);
    await browser.close();
    return;
  }

  console.log('\n6️⃣  Attempting to submit form...\n');

  try {
    // Try force click to bypass any overlays
    await frame.click('input[type="submit"]', { force: true, timeout: 5000 });
    console.log('✅ Submit button clicked');
  } catch (e) {
    console.log('⚠️  Error clicking submit:', e.message);
  }

  console.log('\n7️⃣  Waiting for submission response...\n');
  await page.waitForTimeout(5000);

  const postSubmitCheck = await frame.evaluate(() => {
    const body = document.body.textContent;
    const errors = document.querySelectorAll('.hs-error-msg');
    const form = document.querySelector('form');
    const thankYouMessage = document.querySelector('.submitted-message');

    return {
      hasThankYou: body.includes('Thank') || body.includes('Bedankt') || body.includes('Dank') || !!thankYouMessage,
      hasErrors: errors.length > 0,
      errorMessages: Array.from(errors).map(e => e.textContent.trim()),
      formVisible: !!form,
      bodySnippet: body.substring(0, 500)
    };
  });

  console.log('📊 SUBMISSION RESULT:\n');
  console.log('Has thank you:', postSubmitCheck.hasThankYou ? '✅ SUCCESS!' : '❌ NO');
  console.log('Has errors:', postSubmitCheck.hasErrors ? '⚠️ YES' : '✅ NO');
  console.log('Form still visible:', postSubmitCheck.formVisible ? '⚠️ YES' : '✅ HIDDEN');

  if (postSubmitCheck.hasErrors) {
    console.log('\n❌ ERRORS:');
    postSubmitCheck.errorMessages.forEach(msg => console.log(`  - ${msg}`));
  }

  if (!postSubmitCheck.hasThankYou && !postSubmitCheck.hasErrors) {
    console.log('\n⚠️  Unclear status. Body content:');
    console.log(postSubmitCheck.bodySnippet);
  }

  console.log('\n📊 NETWORK SUMMARY:');
  console.log(`Total HubSpot requests: ${requests.filter(r => r.type === 'HUBSPOT').length}`);
  console.log(`Total reCAPTCHA requests: ${requests.filter(r => r.type === 'RECAPTCHA').length}`);

  const submissionRequest = requests.find(r => r.url.includes('submit'));
  if (submissionRequest) {
    console.log(`✅ Form submission request was sent: ${submissionRequest.method} ${submissionRequest.url}`);
  } else {
    console.log(`❌ NO submission request detected!`);
    console.log('\nPossible reasons:');
    console.log('  1. reCAPTCHA not completed (Enterprise reCAPTCHA needs token)');
    console.log('  2. Form validation blocking submission');
    console.log('  3. JavaScript error preventing form submission');
  }

  console.log('\nBrowser will stay open for 15 seconds...');
  await page.waitForTimeout(15000);

  await browser.close();
})();
