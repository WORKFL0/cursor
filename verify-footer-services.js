const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🔍 FOOTER SERVICES VERIFICATION\n');

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  // Count all service links in footer
  const serviceLinks = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return { error: 'Footer not found' };

    // Find all links within the services section
    const allLinks = Array.from(footer.querySelectorAll('a[href*="/diensten"]'));

    return {
      totalServiceLinks: allLinks.length,
      services: allLinks.map(link => ({
        text: link.textContent?.trim(),
        href: link.getAttribute('href')
      }))
    };
  });

  console.log('Total service links found:', serviceLinks.totalServiceLinks);
  console.log('\nServices in footer:');
  serviceLinks.services.forEach((service, index) => {
    const num = index + 1;
    console.log(`  ${num}. ${service.text} → ${service.href}`);
  });

  await browser.close();

  if (serviceLinks.totalServiceLinks >= 7) {
    console.log('\n✅ FOOTER VERIFICATION: All services present!');
  } else {
    console.log('\n⚠️  FOOTER VERIFICATION: Missing services');
  }
})();
