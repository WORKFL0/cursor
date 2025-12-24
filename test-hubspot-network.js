const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🔍 TESTING HUBSPOT NETWORK REQUESTS\n');

  // Track all network requests
  const requests = [];
  const failures = [];

  page.on('request', request => {
    if (request.url().includes('hubspot') || request.url().includes('hsforms')) {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
      console.log(`📤 REQUEST: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('hubspot') || response.url().includes('hsforms')) {
      console.log(`📥 RESPONSE: ${response.status()} ${response.url()}`);
      if (response.status() >= 400) {
        failures.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    }
  });

  page.on('requestfailed', request => {
    if (request.url().includes('hubspot') || request.url().includes('hsforms')) {
      const failure = request.failure();
      console.log(`❌ REQUEST FAILED: ${request.url()}`);
      console.log(`   Error: ${failure.errorText}`);
      failures.push({
        url: request.url(),
        error: failure.errorText
      });
    }
  });

  console.log('\nNavigating to /contact...\n');
  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(5000);

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY\n');
  console.log('Total HubSpot requests:', requests.length);
  console.log('Failed requests:', failures.length);

  if (failures.length > 0) {
    console.log('\n❌ FAILURES:');
    failures.forEach(f => {
      console.log(`  URL: ${f.url}`);
      if (f.status) console.log(`  Status: ${f.status} ${f.statusText}`);
      if (f.error) console.log(`  Error: ${f.error}`);
    });
  }

  await browser.close();
})();
