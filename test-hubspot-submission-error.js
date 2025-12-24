const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔍 TESTING HUBSPOT FORM SUBMISSION WITH ERROR TRACKING\n');

  // Track console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('HubSpot') || text.includes('hubspot') || text.includes('error') || text.includes('Error')) {
      console.log(`📋 CONSOLE [${msg.type()}]:`, text);
    }
  });

  // Track all network requests to HubSpot
  const hubspotRequests = [];
  page.on('request', request => {
    const url = request.url();
    if (url.includes('hubspot') || url.includes('hsforms')) {
      hubspotRequests.push({
        method: request.method(),
        url: url,
        headers: request.headers()
      });
      console.log(`📤 REQUEST: ${request.method()} ${url.substring(0, 120)}`);
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('hubspot') || url.includes('hsforms')) {
      const status = response.status();
      console.log(`📥 RESPONSE: ${status} ${url.substring(0, 120)}`);

      // If it's a form submission, try to get the response body
      if (url.includes('submissions') || url.includes('submit')) {
        try {
          const body = await response.text();
          console.log(`📄 RESPONSE BODY:`, body.substring(0, 500));
        } catch (e) {
          console.log(`⚠️  Could not read response body`);
        }
      }
    }
  });

  console.log('1️⃣  Navigating to contact page...\n');
  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  console.log('\n2️⃣  Filling form...\n');
  const iframeElement = await page.$('#hubspot-contact-form iframe');

  if (!iframeElement) {
    console.log('❌ No iframe found!');
    await browser.close();
    return;
  }

  const frame = await iframeElement.contentFrame();

  // Fill form
  await frame.fill('[name="firstname"]', 'Test');
  await frame.fill('[name="email"]', 'test@example.com');
  await page.waitForTimeout(1000);

  console.log('\n3️⃣  Submitting form...\n');
  await frame.click('input[type="submit"]');

  console.log('\n4️⃣  Waiting for response...\n');
  await page.waitForTimeout(5000);

  // Check for any error messages in the form
  const errors = await frame.evaluate(() => {
    const errorElements = document.querySelectorAll('.hs-error-msg, .hs_error_rollup, [class*="error"]');
    return Array.from(errorElements).map(el => ({
      class: el.className,
      text: el.textContent.trim()
    }));
  });

  console.log('\n📊 RESULTS:\n');
  console.log('Total HubSpot requests:', hubspotRequests.length);
  console.log('Form errors found:', errors.length);

  if (errors.length > 0) {
    console.log('\n❌ FORM ERRORS:');
    errors.forEach(err => {
      console.log(`  - [${err.class}]: ${err.text}`);
    });
  }

  console.log('\n💡 DIAGNOSIS:');
  console.log('If you see a 403 or 400 error above, it means HubSpot is blocking the submission.');
  console.log('This is likely because localhost:3003 is not in the allowed domains list.');
  console.log('\nTO FIX IN HUBSPOT:');
  console.log('1. Go to HubSpot Settings → Security → Allowed Domains');
  console.log('2. Add: localhost:3003');
  console.log('3. Or disable domain restrictions for this form');

  console.log('\nBrowser will stay open for 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
})();
