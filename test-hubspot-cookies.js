const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔍 TESTING HUBSPOT COOKIES & FORM SUBMISSION\n');

  // Track all requests
  page.on('request', request => {
    const url = request.url();
    if (url.includes('hubspot') || url.includes('hsforms')) {
      console.log(`📤 REQUEST: ${request.method()} ${url.substring(0, 100)}`);
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('hubspot') || url.includes('hsforms')) {
      const headers = response.headers();
      console.log(`📥 RESPONSE: ${response.status()} ${url.substring(0, 100)}`);
      if (headers['set-cookie']) {
        console.log(`   🍪 Set-Cookie: ${headers['set-cookie']}`);
      }
    }
  });

  console.log('1️⃣  Navigating to contact page...\n');
  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle' });

  // First accept cookies if banner appears
  console.log('\n2️⃣  Checking for cookie banner...');
  const cookieBanner = await page.$('text=Accepteer cookies, text=Accept cookies, button:has-text("Accepteren"), button:has-text("Accept")');
  if (cookieBanner) {
    console.log('   Cookie banner found, clicking accept...');
    await cookieBanner.click();
    await page.waitForTimeout(1000);
  } else {
    console.log('   No cookie banner found');
  }

  await page.waitForTimeout(5000);

  console.log('\n3️⃣  Checking cookies after page load...');
  const cookies = await context.cookies();
  const hubspotCookies = cookies.filter(c =>
    c.name.includes('hubspot') ||
    c.name.includes('hstc') ||
    c.name.includes('hubspotutk') ||
    c.name.includes('__hs')
  );

  console.log(`   Total cookies: ${cookies.length}`);
  console.log(`   HubSpot cookies: ${hubspotCookies.length}`);

  if (hubspotCookies.length > 0) {
    console.log('\n   HubSpot cookies found:');
    hubspotCookies.forEach(c => {
      console.log(`     - ${c.name}: ${c.value.substring(0, 50)}...`);
    });
  } else {
    console.log('   ⚠️  NO HUBSPOT COOKIES FOUND!');
  }

  console.log('\n4️⃣  Checking iframe and form...');
  const iframeElement = await page.$('#hubspot-contact-form iframe');

  if (!iframeElement) {
    console.log('   ❌ No iframe found!');
    await browser.close();
    return;
  }

  const frame = await iframeElement.contentFrame();

  // Check for form
  const formExists = await frame.$('form');
  if (!formExists) {
    console.log('   ❌ No form found in iframe!');
    await browser.close();
    return;
  }

  console.log('   ✅ Form found in iframe');

  console.log('\n5️⃣  Filling form...');
  await frame.fill('[name="firstname"]', 'Jan');
  await frame.fill('[name="email"]', 'jan.devries@gmail.com');
  await page.waitForTimeout(1000);

  console.log('\n6️⃣  Attempting to submit...');

  try {
    // Try to click submit with force to bypass any overlays
    await frame.click('input[type="submit"]', { force: true, timeout: 5000 });
    console.log('   ✅ Submit clicked');
  } catch (e) {
    console.log('   ⚠️  Could not click submit:', e.message);
  }

  console.log('\n7️⃣  Waiting for submission...');
  await page.waitForTimeout(3000);

  // Check what happened
  const result = await frame.evaluate(() => {
    const body = document.body.textContent;
    const errors = document.querySelectorAll('.hs-error-msg');

    return {
      hasThankYou: body.includes('Thank') || body.includes('Bedankt') || body.includes('Dank'),
      hasErrors: errors.length > 0,
      errorTexts: Array.from(errors).map(e => e.textContent.trim()),
      formStillVisible: !!document.querySelector('form'),
      bodySnippet: body.substring(0, 300)
    };
  });

  console.log('\n📊 SUBMISSION RESULT:');
  console.log('   Has thank you:', result.hasThankYou ? '✅ YES' : '❌ NO');
  console.log('   Has errors:', result.hasErrors ? '⚠️ YES' : '✅ NO');
  console.log('   Form still visible:', result.formStillVisible ? '⚠️ YES' : '✅ HIDDEN (success)');

  if (result.hasErrors) {
    console.log('\n   Errors:');
    result.errorTexts.forEach(t => console.log(`     - ${t}`));
  }

  if (!result.hasThankYou && !result.hasErrors) {
    console.log('\n   Body content:', result.bodySnippet);
  }

  console.log('\n8️⃣  Final cookie check...');
  const finalCookies = await context.cookies();
  const finalHubspotCookies = finalCookies.filter(c =>
    c.name.includes('hubspot') ||
    c.name.includes('hstc') ||
    c.name.includes('hubspotutk') ||
    c.name.includes('__hs')
  );

  console.log(`   HubSpot cookies after submission: ${finalHubspotCookies.length}`);

  console.log('\n' + '='.repeat(60));
  console.log('CONCLUSION:\n');

  if (hubspotCookies.length === 0) {
    console.log('⚠️  PROBLEM: HubSpot cookies are NOT being set!');
    console.log('This could be caused by:');
    console.log('  1. Cookie consent banner blocking tracking cookies');
    console.log('  2. Browser privacy settings');
    console.log('  3. CSP blocking cookie setting');
    console.log('  4. HubSpot script not running properly');
  } else {
    console.log('✅ HubSpot cookies are being set correctly');
  }

  if (result.hasThankYou || !result.formStillVisible) {
    console.log('✅ FORM SUBMISSION WORKS!');
  } else if (result.hasErrors) {
    console.log('⚠️  Form has validation errors');
  } else {
    console.log('❓ Form submission status unclear');
  }

  console.log('\nBrowser will stay open for 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
})();
