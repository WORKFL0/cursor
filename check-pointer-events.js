const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('✅ Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const headerDivs = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return null;

    const relativeDivs = Array.from(header.querySelectorAll('.relative'));

    return relativeDivs.map((div, index) => {
      const styles = window.getComputedStyle(div);
      const button = div.querySelector('button');
      const buttonStyles = button ? window.getComputedStyle(button) : null;

      return {
        index,
        buttonText: button?.textContent?.trim(),
        parentPointerEvents: styles.pointerEvents,
        parentDisplay: styles.display,
        parentVisibility: styles.visibility,
        buttonPointerEvents: buttonStyles?.pointerEvents,
        buttonDisplay: buttonStyles?.display
      };
    });
  });

  console.log('\n📋 Header Dropdown Pointer Events:');
  console.log(JSON.stringify(headerDivs, null, 2));

  await browser.close();
})();
