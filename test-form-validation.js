const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 TESTING HUBSPOT FORM VALIDATION & SUBMISSION\n');

  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  const iframeElement = await page.$('#hubspot-contact-form iframe');
  const frame = await iframeElement.contentFrame();

  console.log('1️⃣  Getting all form fields and their requirements...\n');

  const allFields = await frame.evaluate(() => {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input, textarea, select');

    return Array.from(inputs).map(input => {
      // Get the label
      const label = input.closest('.hs-form-field')?.querySelector('label');

      return {
        name: input.name,
        type: input.type || input.tagName.toLowerCase(),
        required: input.required || input.hasAttribute('required'),
        value: input.value,
        placeholder: input.placeholder,
        label: label?.textContent?.trim() || 'N/A'
      };
    });
  });

  console.log('FIELD INVENTORY:');
  allFields.forEach((field, i) => {
    if (field.type !== 'hidden') {
      console.log(`${i + 1}. ${field.label || field.name}`);
      console.log(`   Name: ${field.name}`);
      console.log(`   Type: ${field.type}`);
      console.log(`   Required: ${field.required ? '✅ YES' : '⚪ NO'}`);
      console.log('');
    }
  });

  console.log('2️⃣  Filling ALL required fields with valid data...\n');

  // Fill all visible fields
  for (const field of allFields) {
    if (field.type === 'hidden') continue;

    const selector = `[name="${field.name}"]`;

    try {
      if (field.type === 'text') {
        await frame.fill(selector, 'Test User');
        console.log(`✅ Filled: ${field.label || field.name}`);
      } else if (field.type === 'email') {
        await frame.fill(selector, 'test@example.com');
        console.log(`✅ Filled: ${field.label || field.name}`);
      } else if (field.type === 'tel') {
        await frame.fill(selector, '+31612345678');
        console.log(`✅ Filled: ${field.label || field.name}`);
      } else if (field.type === 'textarea') {
        await frame.fill(selector, 'This is a test message to verify form submission works correctly.');
        console.log(`✅ Filled: ${field.label || field.name}`);
      } else if (field.type === 'select-one') {
        // Select first non-empty option
        const optionFilled = await frame.evaluate((name) => {
          const select = document.querySelector(`[name="${name}"]`);
          const options = Array.from(select.options);
          const validOption = options.find(opt => opt.value && opt.value !== '');
          if (validOption) {
            select.value = validOption.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
          }
          return false;
        }, field.name);

        if (optionFilled) {
          console.log(`✅ Selected: ${field.label || field.name}`);
        }
      }
    } catch (e) {
      console.log(`⚠️  Could not fill ${field.name}: ${e.message}`);
    }
  }

  console.log('\n3️⃣  Checking for validation errors BEFORE submit...\n');

  const preSubmitErrors = await frame.evaluate(() => {
    const errors = document.querySelectorAll('.hs-error-msg, .hs_error_rollup');
    return {
      count: errors.length,
      messages: Array.from(errors).map(e => e.textContent.trim())
    };
  });

  if (preSubmitErrors.count > 0) {
    console.log('⚠️  VALIDATION ERRORS FOUND:');
    preSubmitErrors.messages.forEach(msg => console.log(`   - ${msg}`));
  } else {
    console.log('✅ No validation errors');
  }

  console.log('\n4️⃣  Clicking submit...\n');

  // Click submit and wait for response
  await frame.click('input[type="submit"]');
  await page.waitForTimeout(5000); // Give time for submission

  console.log('5️⃣  Checking submission result...\n');

  const postSubmitState = await frame.evaluate(() => {
    const body = document.body.textContent;
    const errors = document.querySelectorAll('.hs-error-msg, .hs_error_rollup');
    const submitButton = document.querySelector('input[type="submit"]');

    return {
      hasThankYou: body.includes('Thank') || body.includes('Bedankt') || body.includes('Dank'),
      hasErrorMessages: errors.length > 0,
      errorMessages: Array.from(errors).map(e => e.textContent.trim()),
      formStillVisible: !!document.querySelector('form'),
      submitButtonDisabled: submitButton?.disabled || false,
      bodySnippet: body.substring(0, 300)
    };
  });

  console.log('Results:');
  console.log('  Has thank you message:', postSubmitState.hasThankYou ? '✅ YES' : '❌ NO');
  console.log('  Has error messages:', postSubmitState.hasErrorMessages ? '⚠️ YES' : '✅ NO');
  console.log('  Form still visible:', postSubmitState.formStillVisible ? '⚠️ YES' : '✅ NO (success!)');
  console.log('  Submit button disabled:', postSubmitState.submitButtonDisabled ? '✅ YES' : '⚪ NO');

  if (postSubmitState.hasErrorMessages) {
    console.log('\n❌ VALIDATION ERRORS:');
    postSubmitState.errorMessages.forEach(msg => console.log(`   - ${msg}`));
  }

  if (!postSubmitState.hasThankYou && !postSubmitState.hasErrorMessages) {
    console.log('\n⚠️  Form submitted but no clear success/error indication');
    console.log('Body content snippet:', postSubmitState.bodySnippet);
  }

  console.log('\nBrowser will stay open for 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);

  await browser.close();
})();
