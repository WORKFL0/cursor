const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Non-headless to see what happens
  const page = await browser.newPage();

  console.log('🔍 TESTING HUBSPOT FORM SUBMISSION\n');
  console.log('=' . repeat(60));

  // Track network requests
  const requests = [];
  const responses = [];

  page.on('request', request => {
    if (request.url().includes('hubspot') || request.url().includes('hsforms')) {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    }
  });

  page.on('response', async response => {
    if (response.url().includes('hubspot') || response.url().includes('hsforms')) {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  // Listen for console messages from the page
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('error') || text.includes('Error') || text.includes('submit')) {
      console.log(`[CONSOLE ${msg.type()}] ${text}`);
    }
  });

  console.log('\n1️⃣  Navigating to contact page...');
  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle', timeout: 15000 });

  console.log('   Waiting for form to load...');
  await page.waitForTimeout(5000);

  console.log('\n2️⃣  Looking for HubSpot iframe...');
  const iframeElement = await page.$('#hubspot-contact-form iframe');

  if (!iframeElement) {
    console.log('   ❌ No iframe found!');
    await browser.close();
    return;
  }

  console.log('   ✅ Iframe found, switching to iframe context...');
  const frame = await iframeElement.contentFrame();

  if (!frame) {
    console.log('   ❌ Could not access iframe content!');
    await browser.close();
    return;
  }

  console.log('\n3️⃣  Inspecting form fields inside iframe...');

  // Wait for form to be ready
  await frame.waitForSelector('form', { timeout: 10000 }).catch(() => null);

  const formInfo = await frame.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return { found: false };

    const inputs = form.querySelectorAll('input, textarea, select');
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');

    return {
      found: true,
      formAction: form.action,
      formMethod: form.method,
      totalFields: inputs.length,
      fields: Array.from(inputs).slice(0, 10).map(input => ({
        name: input.name,
        type: input.type || input.tagName.toLowerCase(),
        required: input.required,
        value: input.value
      })),
      submitButton: submitBtn ? {
        type: submitBtn.type,
        value: submitBtn.value,
        text: submitBtn.textContent,
        disabled: submitBtn.disabled,
        className: submitBtn.className
      } : null
    };
  });

  if (!formInfo.found) {
    console.log('   ❌ No form found in iframe!');
    await browser.close();
    return;
  }

  console.log('   ✅ Form found!');
  console.log('   Form action:', formInfo.formAction);
  console.log('   Form method:', formInfo.formMethod);
  console.log('   Total fields:', formInfo.totalFields);
  console.log('   Submit button:', formInfo.submitButton ? 'FOUND' : 'NOT FOUND');

  if (formInfo.submitButton) {
    console.log('     - Type:', formInfo.submitButton.type);
    console.log('     - Text:', formInfo.submitButton.value || formInfo.submitButton.text);
    console.log('     - Disabled:', formInfo.submitButton.disabled);
  }

  console.log('\n4️⃣  Attempting to fill and submit form...');

  // Fill out the form
  try {
    const fields = formInfo.fields;

    for (const field of fields) {
      if (field.type === 'text' || field.type === 'email') {
        const selector = `input[name="${field.name}"]`;
        await frame.fill(selector, field.name.includes('email') ? 'test@example.com' : 'Test Value');
        console.log(`   ✅ Filled ${field.name}`);
      }
    }

    console.log('\n5️⃣  Clicking submit button...');

    // Try to find and click submit button
    const submitSelector = 'input[type="submit"], button[type="submit"]';
    const submitExists = await frame.$(submitSelector);

    if (submitExists) {
      console.log('   Submit button found, clicking...');
      await frame.click(submitSelector);
      console.log('   ✅ Submit button clicked!');

      // Wait a bit to see what happens
      await page.waitForTimeout(3000);

      console.log('\n6️⃣  Checking for submission response...');
      console.log('   Network requests made:', requests.filter(r => r.method === 'POST').length);
      console.log('   Network responses:', responses.filter(r => r.status === 200 || r.status === 302).length);

      // Check if form shows success message
      const afterSubmit = await frame.evaluate(() => {
        const body = document.body.textContent;
        return {
          hasThankYou: body.includes('Thank') || body.includes('Thanks') || body.includes('Bedankt'),
          hasError: body.includes('error') || body.includes('Error'),
          bodyText: body.substring(0, 500)
        };
      });

      console.log('   Has thank you message:', afterSubmit.hasThankYou ? '✅ YES' : '❌ NO');
      console.log('   Has error message:', afterSubmit.hasError ? '⚠️ YES' : '✅ NO');

    } else {
      console.log('   ❌ Submit button not found!');
    }

  } catch (error) {
    console.log('   ❌ Error during form interaction:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Test completed. Browser will close in 5 seconds...');
  await page.waitForTimeout(5000);

  await browser.close();
})();
