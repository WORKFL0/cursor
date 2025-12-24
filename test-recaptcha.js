const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 CHECKING FOR RECAPTCHA IN HUBSPOT FORM\n');

  // Track all network requests
  page.on('request', request => {
    const url = request.url();
    if (url.includes('recaptcha') || url.includes('google.com/recaptcha')) {
      console.log(`📤 RECAPTCHA REQUEST: ${url.substring(0, 100)}`);
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('recaptcha') || url.includes('google.com/recaptcha')) {
      console.log(`📥 RECAPTCHA RESPONSE: ${response.status()} ${url.substring(0, 100)}`);
    }
  });

  console.log('1️⃣  Navigating to contact page...\n');
  await page.goto('http://localhost:3003/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  console.log('\n2️⃣  Checking for reCAPTCHA elements...\n');

  const iframeElement = await page.$('#hubspot-contact-form iframe');
  if (!iframeElement) {
    console.log('❌ No HubSpot iframe found!');
    await browser.close();
    return;
  }

  const frame = await iframeElement.contentFrame();

  // Check for reCAPTCHA elements
  const recaptchaCheck = await frame.evaluate(() => {
    // Check for reCAPTCHA v2 checkbox
    const recaptchaV2 = document.querySelector('.g-recaptcha');

    // Check for reCAPTCHA v3 (invisible)
    const recaptchaV3 = document.querySelector('[data-sitekey]');

    // Check for any Google reCAPTCHA scripts
    const recaptchaScripts = Array.from(document.querySelectorAll('script')).filter(s =>
      s.src.includes('recaptcha') || s.src.includes('google.com/recaptcha')
    );

    // Check for reCAPTCHA iframe
    const recaptchaIframe = document.querySelector('iframe[src*="recaptcha"]');

    // Check for any element with recaptcha in the class or id
    const recaptchaElements = document.querySelectorAll('[class*="recaptcha"], [id*="recaptcha"]');

    return {
      hasRecaptchaV2: !!recaptchaV2,
      hasRecaptchaV3: !!recaptchaV3,
      recaptchaScriptsCount: recaptchaScripts.length,
      recaptchaScriptsSrc: recaptchaScripts.map(s => s.src),
      hasRecaptchaIframe: !!recaptchaIframe,
      recaptchaElementsCount: recaptchaElements.length,
      recaptchaElementsInfo: Array.from(recaptchaElements).map(el => ({
        tag: el.tagName,
        class: el.className,
        id: el.id,
        visible: el.offsetParent !== null
      }))
    };
  });

  console.log('📊 RECAPTCHA CHECK RESULTS:\n');
  console.log('Has reCAPTCHA v2 (checkbox):', recaptchaCheck.hasRecaptchaV2 ? '✅ YES' : '❌ NO');
  console.log('Has reCAPTCHA v3 (invisible):', recaptchaCheck.hasRecaptchaV3 ? '✅ YES' : '❌ NO');
  console.log('reCAPTCHA scripts found:', recaptchaCheck.recaptchaScriptsCount);

  if (recaptchaCheck.recaptchaScriptsSrc.length > 0) {
    console.log('\nreCAPTCHA scripts:');
    recaptchaCheck.recaptchaScriptsSrc.forEach(src => console.log(`  - ${src}`));
  }

  console.log('\nreCAPTCHA elements found:', recaptchaCheck.recaptchaElementsCount);

  if (recaptchaCheck.recaptchaElementsInfo.length > 0) {
    console.log('\nreCAPTCHA element details:');
    recaptchaCheck.recaptchaElementsInfo.forEach((el, i) => {
      console.log(`  ${i + 1}. <${el.tag}> class="${el.class}" id="${el.id}" visible=${el.visible}`);
    });
  }

  // Check the form HTML for any recaptcha references
  const formHTML = await frame.evaluate(() => {
    const form = document.querySelector('form');
    return form ? form.innerHTML : '';
  });

  const hasRecaptchaInHTML = formHTML.toLowerCase().includes('recaptcha');
  console.log('\nreCAPTCHA mentioned in form HTML:', hasRecaptchaInHTML ? '✅ YES' : '❌ NO');

  console.log('\n💡 DIAGNOSIS:\n');

  if (!recaptchaCheck.hasRecaptchaV2 && !recaptchaCheck.hasRecaptchaV3 && recaptchaCheck.recaptchaScriptsCount === 0) {
    console.log('⚠️  NO RECAPTCHA DETECTED!');
    console.log('\nPossible reasons:');
    console.log('1. reCAPTCHA is not enabled for this form in HubSpot');
    console.log('2. reCAPTCHA is being blocked by CSP (Content Security Policy)');
    console.log('3. reCAPTCHA script failed to load');
    console.log('\nTO FIX:');
    console.log('- Check HubSpot form settings to see if reCAPTCHA is required');
    console.log('- Check browser console for CSP errors blocking google.com/recaptcha');
    console.log('- If CSP is blocking, add to next.config.ts:');
    console.log('  script-src: https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/');
    console.log('  frame-src: https://www.google.com/recaptcha/');
  } else {
    console.log('✅ reCAPTCHA elements detected');
    if (!recaptchaCheck.hasRecaptchaV2 && recaptchaCheck.hasRecaptchaV3) {
      console.log('ℹ️  Using reCAPTCHA v3 (invisible) - no user interaction needed');
    }
  }

  console.log('\n3️⃣  Checking CSP headers...\n');

  const cspHeaders = await page.evaluate(() => {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return meta ? meta.getAttribute('content') : 'No CSP meta tag found';
  });

  console.log('CSP from meta tag:', cspHeaders);

  console.log('\nBrowser will stay open for 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
})();
