import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function checkAllPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:3000';

  // List of all pages to check
  const pages = [
    '/',
    '/contact',
    '/diensten',
    '/over-ons',
    '/prijzen',
    '/werken-bij',
    '/tevredenheidscheck',
    '/nieuws',
    '/faq',
    '/testimonials',
    '/sectoren/architecten',
    '/sectoren/financiele-sector',
    '/sectoren/gezondheidszorg',
    '/sectoren/marketing-reclame',
    '/sectoren/media',
    '/sectoren/retail',
    '/sectoren/zzp',
    '/calculator',
    '/privacy',
    '/terms',
    '/cookies',
  ];

  const results: any[] = [];

  console.log('🔍 Checking all pages...\n');

  for (const pagePath of pages) {
    const url = `${baseUrl}${pagePath}`;
    console.log(`Checking: ${url}`);

    try {
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });

      const status = response?.status() || 0;
      const title = await page.title();

      // Check for errors in console
      const errors: string[] = [];
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });

      await page.waitForTimeout(1000);

      // Check if page has content
      const bodyText = await page.evaluate(() => document.body.innerText);
      const hasContent = bodyText.length > 100;

      const result = {
        path: pagePath,
        url,
        status,
        title,
        hasContent,
        errors,
        working: status === 200 && hasContent && errors.length === 0,
      };

      results.push(result);

      if (result.working) {
        console.log(`  ✅ Working - ${status} - ${title}`);
      } else {
        console.log(`  ❌ Issue - ${status} - ${title}`);
        if (errors.length > 0) {
          console.log(`     Errors: ${errors.join(', ')}`);
        }
      }
    } catch (error) {
      console.log(`  ❌ Failed to load: ${error}`);
      results.push({
        path: pagePath,
        url,
        status: 0,
        title: '',
        hasContent: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        working: false,
      });
    }
  }

  // Save results
  const reportDir = path.join(process.cwd(), 'page-audit');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportDir, 'page-audit-report.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2)
  );

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const working = results.filter(r => r.working).length;
  const broken = results.filter(r => !r.working).length;

  console.log(`✅ Working pages: ${working}/${results.length}`);
  console.log(`❌ Broken pages: ${broken}/${results.length}`);

  if (broken > 0) {
    console.log('\n❌ Pages with issues:');
    results.filter(r => !r.working).forEach(r => {
      console.log(`   - ${r.path} (Status: ${r.status})`);
    });
  }

  console.log(`\n📝 Full report saved to: ${path.join(reportDir, 'page-audit-report.json')}`);

  await browser.close();
}

checkAllPages().catch(console.error);
