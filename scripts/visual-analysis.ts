import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function analyzeVisuals() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  // Create screenshots directory
  const screenshotsDir = path.join(process.cwd(), 'visual-analysis');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const pages = [
    { name: 'homepage', url: 'http://localhost:3000' },
    { name: 'tevredenheidscheck', url: 'http://localhost:3000/tevredenheidscheck' },
    { name: 'werken-bij', url: 'http://localhost:3000/werken-bij' },
    { name: 'contact', url: 'http://localhost:3000/contact' },
  ];

  const analysis: any = {
    timestamp: new Date().toISOString(),
    pages: [],
  };

  for (const pageInfo of pages) {
    console.log(`\n📸 Analyzing: ${pageInfo.name}...`);

    try {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // Wait for animations

      // Capture full page screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, `${pageInfo.name}-full.png`),
        fullPage: true,
      });

      // Capture viewport screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, `${pageInfo.name}-viewport.png`),
      });

      // Analyze page elements
      const visualData = await page.evaluate(() => {
        const getComputedStyles = (selector: string) => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const styles = window.getComputedStyle(el);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily,
            lineHeight: styles.lineHeight,
            padding: styles.padding,
            margin: styles.margin,
          };
        };

        return {
          title: document.title,
          h1Count: document.querySelectorAll('h1').length,
          h2Count: document.querySelectorAll('h2').length,
          imagesCount: document.querySelectorAll('img').length,
          buttonsCount: document.querySelectorAll('button').length,
          linksCount: document.querySelectorAll('a').length,
          bodyStyles: getComputedStyles('body'),
          h1Styles: getComputedStyles('h1'),
          buttonStyles: getComputedStyles('button'),
          hasHero: !!document.querySelector('[class*="hero"]'),
          hasNav: !!document.querySelector('nav'),
          hasFooter: !!document.querySelector('footer'),
          viewportHeight: window.innerHeight,
          scrollHeight: document.documentElement.scrollHeight,
          colors: Array.from(document.querySelectorAll('*'))
            .map((el) => window.getComputedStyle(el).backgroundColor)
            .filter((c) => c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent')
            .slice(0, 20),
        };
      });

      // Performance metrics
      const metrics = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0] as any;
        return {
          loadTime: perf?.loadEventEnd - perf?.fetchStart,
          domContentLoaded: perf?.domContentLoadedEventEnd - perf?.fetchStart,
        };
      });

      analysis.pages.push({
        name: pageInfo.name,
        url: pageInfo.url,
        visual: visualData,
        performance: metrics,
      });

      console.log(`✅ Analyzed: ${pageInfo.name}`);
      console.log(`   - H1s: ${visualData.h1Count}, H2s: ${visualData.h2Count}`);
      console.log(`   - Images: ${visualData.imagesCount}, Buttons: ${visualData.buttonsCount}`);
      console.log(`   - Load time: ${metrics.loadTime}ms`);
    } catch (error) {
      console.error(`❌ Error analyzing ${pageInfo.name}:`, error);
    }
  }

  // Mobile analysis
  console.log('\n📱 Analyzing mobile view...');
  await context.close();
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const mobilePage = await mobileContext.newPage();

  for (const pageInfo of pages) {
    try {
      await mobilePage.goto(pageInfo.url, { waitUntil: 'networkidle' });
      await mobilePage.waitForTimeout(1000);

      await mobilePage.screenshot({
        path: path.join(screenshotsDir, `${pageInfo.name}-mobile.png`),
        fullPage: true,
      });

      console.log(`✅ Mobile screenshot: ${pageInfo.name}`);
    } catch (error) {
      console.error(`❌ Error mobile ${pageInfo.name}:`, error);
    }
  }

  // Save analysis report
  fs.writeFileSync(
    path.join(screenshotsDir, 'analysis-report.json'),
    JSON.stringify(analysis, null, 2)
  );

  console.log(`\n✅ Analysis complete! Screenshots saved to: ${screenshotsDir}`);
  console.log(`📊 Report saved: ${path.join(screenshotsDir, 'analysis-report.json')}`);

  await mobileContext.close();
  await browser.close();
}

analyzeVisuals().catch(console.error);
