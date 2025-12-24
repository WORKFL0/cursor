const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  console.log('Taking screenshot of header...');
  await page.screenshot({ 
    path: 'header-current.png',
    fullPage: false 
  });
  
  console.log('Inspecting header DOM for dropdowns...');
  const headerHTML = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header ? header.outerHTML.substring(0, 2000) : 'No header found';
  });
  
  console.log('Header HTML (first 2000 chars):');
  console.log(headerHTML);
  
  console.log('\nChecking for dropdown elements...');
  const dropdownCount = await page.evaluate(() => {
    const dropdowns = document.querySelectorAll('[class*="dropdown"], [onmouseenter*="dropdown"]');
    return dropdowns.length;
  });
  
  console.log(`Found ${dropdownCount} dropdown-related elements`);
  
  console.log('\nChecking nav structure...');
  const navLinks = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    if (!nav) return 'No nav element found';
    const links = Array.from(nav.querySelectorAll('a, span, button'));
    return links.map(l => ({
      tag: l.tagName,
      text: l.textContent?.trim().substring(0, 50),
      hasChevron: l.innerHTML.includes('chevron') || l.innerHTML.includes('ChevronDown')
    }));
  });
  
  console.log('Nav links:', JSON.stringify(navLinks, null, 2));
  
  await browser.close();
  console.log('\nScreenshot saved as header-current.png');
})();
