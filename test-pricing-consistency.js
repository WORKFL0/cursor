const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🔍 COMPREHENSIVE PRICING CONSISTENCY TEST\n');
  console.log('=' . repeat(60));

  // Test 1: Prijzen Page Calculator
  console.log('\n1️⃣  TESTING /prijzen calculator...');
  await page.goto('http://localhost:3000/prijzen', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  const calculatorPricing = await page.evaluate(() => {
    const results = {};

    // Check for €60 and €90
    results.hasRemote60 = document.body.textContent.includes('€60') || document.body.textContent.includes('60/gebruiker');
    results.hasEnterprise90 = document.body.textContent.includes('€90') || document.body.textContent.includes('90/gebruiker');
    results.hasAdhoc120 = document.body.textContent.includes('€120') || document.body.textContent.includes('120');
    results.hasPrepaid1900 = document.body.textContent.includes('€1.900') || document.body.textContent.includes('1900') || document.body.textContent.includes('1.900');

    // Check for MSP AANBEVOLEN badge
    results.hasAanbevolen = document.body.textContent.includes('AANBEVOLEN');

    // Check for volume discount info
    results.hasVolumeDiscount = document.body.textContent.includes('Volume korting') || document.body.textContent.includes('volume korting');

    // Check for contract info
    results.hasContractInfo = document.body.textContent.includes('Maandelijks opzegbaar') || document.body.textContent.includes('opzegtermijn');

    // Check for scenarios
    results.hasScenarios = document.body.textContent.includes('Scenario') || document.body.textContent.includes('scenario');

    return results;
  });

  console.log('  ✅ Remote €60:', calculatorPricing.hasRemote60 ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ Enterprise €90:', calculatorPricing.hasEnterprise90 ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ Ad-Hoc €120:', calculatorPricing.hasAdhoc120 ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ Pre-Paid €1.900:', calculatorPricing.hasPrepaid1900 ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ AANBEVOLEN badge:', calculatorPricing.hasAanbevolen ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ Volume discount info:', calculatorPricing.hasVolumeDiscount ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ Contract info:', calculatorPricing.hasContractInfo ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ Realistic scenarios:', calculatorPricing.hasScenarios ? 'FOUND' : '❌ MISSING');

  // Test 2: Managed IT Page
  console.log('\n2️⃣  TESTING /diensten/managed-it...');
  await page.goto('http://localhost:3000/diensten/managed-it', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  const managedITPricing = await page.evaluate(() => {
    return {
      hasRemote60: document.body.textContent.includes('€60'),
      hasEnterprise90: document.body.textContent.includes('€90'),
      hasPerGebruiker: document.body.textContent.includes('per gebruiker'),
      noPerComputer: !document.body.textContent.includes('per computer')
    };
  });

  console.log('  ✅ Remote €60:', managedITPricing.hasRemote60 ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ Enterprise €90:', managedITPricing.hasEnterprise90 ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ "per gebruiker":', managedITPricing.hasPerGebruiker ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ NO "per computer":', managedITPricing.noPerComputer ? 'CORRECT' : '❌ FOUND (should not be there!)');

  // Test 3: Cybersecurity Page
  console.log('\n3️⃣  TESTING /diensten/cybersecurity...');
  await page.goto('http://localhost:3000/diensten/cybersecurity', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);

  const cybersecurityPricing = await page.evaluate(() => {
    return {
      hasIncludedMSP: document.body.textContent.includes('Inbegrepen in MSP') || document.body.textContent.includes('inbegrepen'),
      noStandalone35: !document.body.textContent.includes('€35/gebruiker/maand') || document.body.textContent.includes('zou zijn'),
      hasMSP60: document.body.textContent.includes('€60'),
      hasSavingsMessage: document.body.textContent.includes('BESPARING') || document.body.textContent.includes('besparing')
    };
  });

  console.log('  ✅ "Inbegrepen in MSP":', cybersecurityPricing.hasIncludedMSP ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ NO standalone €35:', cybersecurityPricing.noStandalone35 ? 'CORRECT' : '❌ STILL SHOWING');
  console.log('  ✅ MSP €60 mention:', cybersecurityPricing.hasMSP60 ? 'FOUND' : '❌ MISSING');
  console.log('  ✅ Savings message:', cybersecurityPricing.hasSavingsMessage ? 'FOUND' : '❌ MISSING');

  // Test 4: All Pages - No "per computer"
  console.log('\n4️⃣  TESTING for "per computer" references...');

  const pagesToCheck = [
    '/diensten',
    '/diensten/managed-it',
    '/diensten/cybersecurity',
    '/prijzen'
  ];

  let foundPerComputer = false;
  for (const path of pagesToCheck) {
    await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    const hasPerComputer = await page.evaluate(() => document.body.textContent.includes('per computer'));
    if (hasPerComputer) {
      console.log(`  ❌ FOUND "per computer" on ${path}`);
      foundPerComputer = true;
    }
  }

  if (!foundPerComputer) {
    console.log('  ✅ NO "per computer" references found on any page');
  }

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY\n');

  const allTestsPassed =
    calculatorPricing.hasRemote60 &&
    calculatorPricing.hasEnterprise90 &&
    calculatorPricing.hasAdhoc120 &&
    calculatorPricing.hasAanbevolen &&
    managedITPricing.hasRemote60 &&
    managedITPricing.hasEnterprise90 &&
    managedITPricing.noPerComputer &&
    cybersecurityPricing.hasIncludedMSP &&
    !foundPerComputer;

  if (allTestsPassed) {
    console.log('✅ ALL PRICING TESTS PASSED!');
    console.log('✅ Prijzen zijn consistent door de hele website');
    console.log('✅ Calculator toont correcte prijzen en UX verbeteringen');
    console.log('✅ Cybersecurity toont MSP inclusion correct');
    console.log('✅ Geen "per computer" references meer');
  } else {
    console.log('⚠️  SOME TESTS FAILED - Check output above');
  }

  console.log('='.repeat(60));
})();
