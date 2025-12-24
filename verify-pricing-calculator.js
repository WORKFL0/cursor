const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🔍 PRICING CALCULATOR VERIFICATION\n');

  await page.goto('http://localhost:3000/prijzen', { waitUntil: 'networkidle', timeout: 15000 });

  // Wait for page to fully load
  await page.waitForTimeout(2000);

  // Check for key elements
  const verification = await page.evaluate(() => {
    const results = {
      slider: null,
      adhoc: null,
      prepaid: null,
      msp: null,
      aanbevolen: null,
      euro120: null,
      euro60: null,
      euro90: null,
      perGebruiker: null,
      threeColumns: null,
    };

    // Check for slider
    results.slider = document.querySelector('input[type="range"]') || document.querySelector('[role="slider"]');

    // Check for Ad-Hoc text
    results.adhoc = document.body.textContent.includes('Ad-Hoc') || document.body.textContent.includes('ad-hoc');

    // Check for Pre-Paid text
    results.prepaid = document.body.textContent.includes('Pre-Paid') || document.body.textContent.includes('Vooruitbetaald');

    // Check for MSP text
    results.msp = document.body.textContent.includes('Fixed-Fee') || document.body.textContent.includes('Managed Services');

    // Check for AANBEVOLEN badge
    results.aanbevolen = document.body.textContent.includes('AANBEVOLEN');

    // Check for €120
    results.euro120 = document.body.textContent.includes('€120') || document.body.textContent.includes('120');

    // Check for €60
    results.euro60 = document.body.textContent.includes('€60') || document.body.textContent.includes('60/gebruiker');

    // Check for €90
    results.euro90 = document.body.textContent.includes('€90') || document.body.textContent.includes('90/gebruiker');

    // Check for "per gebruiker"
    results.perGebruiker = document.body.textContent.includes('per gebruiker') || document.body.textContent.includes('gebruikers');

    // Check for 3-column grid layout
    const gridElements = Array.from(document.querySelectorAll('[class*="grid"]')).filter(el =>
      el.className.includes('lg:grid-cols-3') || el.className.includes('grid-cols-3')
    );
    results.threeColumns = gridElements.length > 0;

    // Get all card titles to see what's displayed
    const cardTitles = Array.from(document.querySelectorAll('[class*="CardTitle"]')).map(el => el.textContent?.trim());
    results.cardTitles = cardTitles;

    return results;
  });

  console.log('✅ Verification Results:');
  console.log('  Slider found:', !!verification.slider);
  console.log('  "Ad-Hoc" text found:', verification.adhoc);
  console.log('  "Pre-Paid" text found:', verification.prepaid);
  console.log('  "MSP/Fixed-Fee" text found:', verification.msp);
  console.log('  "AANBEVOLEN" badge found:', verification.aanbevolen);
  console.log('  "€120" found:', verification.euro120);
  console.log('  "€60" found:', verification.euro60);
  console.log('  "€90" found:', verification.euro90);
  console.log('  "per gebruiker" found:', verification.perGebruiker);
  console.log('  3-column grid found:', verification.threeColumns);
  console.log('\n📋 Card titles found:', verification.cardTitles);

  // Take screenshot
  await page.screenshot({ path: 'pricing-calculator-current.png', fullPage: true });
  console.log('\n📸 Screenshot saved: pricing-calculator-current.png');

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  if (verification.adhoc && verification.euro120 && verification.aanbevolen && verification.slider) {
    console.log('✅ NEW CALCULATOR DETECTED - All key elements present!');
  } else {
    console.log('❌ OLD CALCULATOR STILL SHOWING - Missing key elements:');
    if (!verification.adhoc) console.log('  - Ad-Hoc text missing');
    if (!verification.euro120) console.log('  - €120 price missing');
    if (!verification.aanbevolen) console.log('  - AANBEVOLEN badge missing');
    if (!verification.slider) console.log('  - Slider missing');
  }
  console.log('='.repeat(60));
})();
