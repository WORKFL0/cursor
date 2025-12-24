const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('🔍 LIVE VERIFICATION - Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  console.log('📸 Taking initial screenshot...');
  await page.screenshot({ path: 'live-check-1-initial.png' });

  console.log('\n🔍 STEP 1: Checking which header component is actually rendered...');
  const headerInfo = await page.evaluate(() => {
    const headers = document.querySelectorAll('header');
    return {
      headerCount: headers.length,
      headerHTML: headers[0]?.outerHTML.substring(0, 500),
      hasServicesButton: !!document.querySelector('button:has-text("Services")'),
      hasDienstenButton: !!document.querySelector('button:has-text("Diensten")'),
      allButtons: Array.from(document.querySelectorAll('header button, header a')).map(el => el.textContent?.trim()).filter(t => t)
    };
  });

  console.log('Header Info:', headerInfo);

  console.log('\n🔍 STEP 2: Looking for dropdown divs in the DOM...');
  const dropdownInfo = await page.evaluate(() => {
    const allDivs = document.querySelectorAll('header div');
    const dropdownDivs = Array.from(allDivs).filter(div =>
      div.className.includes('opacity') ||
      div.className.includes('absolute') ||
      div.textContent?.includes('Managed IT')
    );

    return {
      totalDivsInHeader: allDivs.length,
      potentialDropdowns: dropdownDivs.length,
      dropdownClasses: dropdownDivs.slice(0, 5).map(d => ({
        class: d.className,
        text: d.textContent?.substring(0, 100)
      }))
    };
  });

  console.log('Dropdown Info:', dropdownInfo);

  console.log('\n🖱️ STEP 3: Trying to hover over navigation items...');

  // Try finding any navigation button
  const navButtons = await page.locator('header button, header a').all();
  console.log(`Found ${navButtons.length} navigation items`);

  for (let i = 0; i < Math.min(navButtons.length, 5); i++) {
    const text = await navButtons[i].textContent();
    console.log(`  ${i + 1}. "${text}"`);
  }

  // Try to hover over the first few buttons
  if (navButtons.length > 0) {
    console.log('\n🖱️ Hovering over first navigation button...');
    await navButtons[0].hover();
    await page.waitForTimeout(1000);

    console.log('📸 Taking screenshot after hover...');
    await page.screenshot({ path: 'live-check-2-after-hover.png' });

    const afterHover = await page.evaluate(() => {
      const visibleDropdowns = document.querySelectorAll('[class*="opacity-100"]:not(header)');
      return {
        visibleCount: visibleDropdowns.length,
        visibleContent: Array.from(visibleDropdowns).slice(0, 3).map(d => d.textContent?.substring(0, 100))
      };
    });

    console.log('After hover:', afterHover);
  }

  console.log('\n⏸️ Pausing for 5 seconds so you can inspect the browser...');
  await page.waitForTimeout(5000);

  await browser.close();
  console.log('\n✅ Verification complete. Check screenshots: live-check-1-initial.png and live-check-2-after-hover.png');
})();
