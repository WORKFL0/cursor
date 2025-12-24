const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 TESTING WITH REAL EMAIL ADDRESS\n');

  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  const iframeElement = await page.$('#hubspot-contact-form iframe');
  const frame = await iframeElement.contentFrame();

  console.log('Filling form with realistic data...\n');

  // Fill with real-looking data
  await frame.fill('[name="firstname"]', 'Jan');
  await page.waitForTimeout(500);
  console.log('✅ Filled firstname: Jan');

  await frame.fill('[name="lastname"]', 'de Vries');
  await page.waitForTimeout(500);
  console.log('✅ Filled lastname: de Vries');

  // Use a real email domain
  await frame.fill('[name="email"]', 'jan.devries@gmail.com');
  await page.waitForTimeout(500);
  console.log('✅ Filled email: jan.devries@gmail.com');

  await frame.fill('[name="company"]', 'Test BV');
  await page.waitForTimeout(500);
  console.log('✅ Filled company: Test BV');

  await frame.fill('[name="phone"]', '+31612345678');
  await page.waitForTimeout(500);
  console.log('✅ Filled phone: +31612345678');

  await frame.fill('[name="message"]', 'Dit is een test bericht om te controleren of de HubSpot form submission correct werkt.');
  await page.waitForTimeout(500);
  console.log('✅ Filled message');

  console.log('\nWaiting 2 seconds before submit...');
  await page.waitForTimeout(2000);

  console.log('\nChecking email validation status...');
  const emailValidation = await frame.evaluate(() => {
    const emailInput = document.querySelector('[name="email"]');
    const emailError = emailInput?.closest('.hs-form-field')?.querySelector('.hs-error-msg');
    return {
      emailValue: emailInput?.value,
      hasError: !!emailError,
      errorText: emailError?.textContent?.trim() || 'None'
    };
  });

  console.log('Email field value:', emailValidation.emailValue);
  console.log('Has error:', emailValidation.hasError ? '❌ YES' : '✅ NO');
  if (emailValidation.hasError) {
    console.log('Error message:', emailValidation.errorText);
  }

  if (!emailValidation.hasError) {
    console.log('\n✅ No validation errors, clicking submit...\n');

    await frame.click('input[type="submit"]');

    console.log('Waiting for submission response...');
    await page.waitForTimeout(5000);

    const result = await frame.evaluate(() => {
      const body = document.body.textContent;
      const errors = document.querySelectorAll('.hs-error-msg');

      return {
        bodyText: body.substring(0, 500),
        hasThankYou: body.includes('Thank') || body.includes('Bedankt') || body.includes('Dank'),
        hasErrors: errors.length > 0,
        errorMessages: Array.from(errors).map(e => e.textContent.trim()),
        formHidden: !document.querySelector('form')
      };
    });

    console.log('\n📊 SUBMISSION RESULT:');
    console.log('Has thank you message:', result.hasThankYou ? '✅ YES - FORM SUBMITTED!' : '❌ NO');
    console.log('Has errors:', result.hasErrors ? '⚠️ YES' : '✅ NO');
    console.log('Form hidden (success):', result.formHidden ? '✅ YES' : '❌ NO');

    if (result.hasErrors) {
      console.log('\nErrors:');
      result.errorMessages.forEach(msg => console.log(`  - ${msg}`));
    }

    if (result.hasThankYou || result.formHidden) {
      console.log('\n🎉 SUCCESS! FORM SUBMISSION WORKS!');
    } else if (result.hasErrors) {
      console.log('\n⚠️ Form validation failed');
    } else {
      console.log('\n⚠️ Unclear submission state');
      console.log('Body text:', result.bodyText);
    }
  } else {
    console.log('\n❌ Cannot submit - validation errors present');
  }

  console.log('\nBrowser will stay open for 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
})();
