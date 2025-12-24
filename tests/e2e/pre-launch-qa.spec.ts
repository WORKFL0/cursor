import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Pre-Launch Quality Assurance Test Suite
 *
 * Critical checks that MUST pass before going live:
 * 1. Dummy numbers (0+, 0., 0%, 0/)
 * 2. Duplicate client logos
 * 3. Empty buttons
 * 4. Video fallback messages
 * 5. Inconsistent CTAs
 * 6. Language inconsistencies (English words in Dutch content)
 */

interface QAIssue {
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  location: string;
  issue: string;
  suggestion: string;
  screenshot?: string;
}

const qaIssues: QAIssue[] = [];
const screenshotDir = path.join(process.cwd(), 'test-results', 'pre-launch-qa');

// Ensure screenshot directory exists
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

/**
 * Helper function to capture screenshot and add issue
 */
async function reportIssue(
  page: Page,
  category: string,
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM',
  location: string,
  issue: string,
  suggestion: string,
  screenshotName?: string
) {
  let screenshotPath: string | undefined;

  if (screenshotName) {
    screenshotPath = path.join(screenshotDir, `${screenshotName}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
  }

  qaIssues.push({
    category,
    priority,
    location,
    issue,
    suggestion,
    screenshot: screenshotPath
  });
}

test.describe('Pre-Launch QA: Homepage Critical Issues', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Wait for page to be fully interactive
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Allow for animations
  });

  test.afterAll(async () => {
    // Generate comprehensive report
    const report = generateQAReport(qaIssues);
    const reportPath = path.join(screenshotDir, 'QA-REPORT.md');
    fs.writeFileSync(reportPath, report);

    console.log('\n' + '='.repeat(80));
    console.log('PRE-LAUNCH QA REPORT GENERATED');
    console.log('='.repeat(80));
    console.log(report);
    console.log('='.repeat(80));
    console.log(`Full report saved to: ${reportPath}`);
    console.log('='.repeat(80) + '\n');

    await page.close();
  });

  test('1. CRITICAL: Scan for dummy numbers (0+, 0., 0%, 0/)', async () => {
    console.log('\n🔍 Scanning for dummy numbers...\n');

    // Patterns to detect dummy numbers
    const dummyPatterns = [
      { pattern: /\b0\+/g, description: '0+ (zero plus)' },
      { pattern: /\b0\./g, description: '0. (zero decimal)' },
      { pattern: /\b0%/g, description: '0% (zero percent)' },
      { pattern: /\b0\//g, description: '0/ (zero slash)' },
      { pattern: /\b00\b/g, description: '00 (double zero)' }
    ];

    const bodyText = await page.textContent('body');

    for (const { pattern, description } of dummyPatterns) {
      const matches = bodyText?.match(pattern);
      if (matches) {
        // Find specific elements containing these patterns
        const elements = await page.locator(`text=${matches[0]}`).all();

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const text = await element.textContent();
          const parent = await element.locator('xpath=..').first();
          const parentText = await parent.textContent();

          // Get section context
          const section = await element.locator('xpath=ancestor::section[1]').first();
          let sectionId = 'unknown';
          try {
            sectionId = await section.getAttribute('id') ||
                       await section.getAttribute('class') ||
                       'unknown-section';
          } catch (e) {
            sectionId = 'root-level';
          }

          await reportIssue(
            page,
            'Dummy Numbers',
            'CRITICAL',
            `Section: ${sectionId}, Element ${i + 1}`,
            `Found dummy number: "${text?.trim()}" (${description})`,
            'Replace with actual statistics or remove if data unavailable',
            `dummy-number-${sectionId}-${i}`
          );
        }
      }
    }
  });

  test('2. HIGH: Check for duplicate client logos', async () => {
    console.log('\n🔍 Checking for duplicate client logos...\n');

    // Find all logo images in carousels or client sections
    const logoSelectors = [
      'section[class*="client"] img',
      'section[class*="logo"] img',
      '[class*="carousel"] img',
      '[class*="partner"] img',
      '[id*="client"] img',
      '[id*="logo"] img'
    ];

    const logoMap = new Map<string, number>();

    for (const selector of logoSelectors) {
      const logos = await page.locator(selector).all();

      for (const logo of logos) {
        const src = await logo.getAttribute('src');
        const alt = await logo.getAttribute('alt');

        if (src) {
          const identifier = `${src}-${alt}`;
          logoMap.set(identifier, (logoMap.get(identifier) || 0) + 1);
        }
      }
    }

    // Report duplicates
    for (const [identifier, count] of logoMap.entries()) {
      if (count > 1) {
        const [src, alt] = identifier.split('-');
        await reportIssue(
          page,
          'Duplicate Logos',
          'HIGH',
          'Client/Partner sections',
          `Logo appears ${count} times: ${alt || src}`,
          'Remove duplicate logos from carousel or ensure unique display',
          `duplicate-logo-${alt?.replace(/\s+/g, '-') || 'unknown'}`
        );
      }
    }
  });

  test('3. CRITICAL: Find empty buttons and missing text', async () => {
    console.log('\n🔍 Checking for empty buttons...\n');

    // Find all buttons
    const buttons = await page.locator('button, a[role="button"], input[type="submit"]').all();

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const value = await button.getAttribute('value');

      // Check if button is truly empty
      const isEmpty = !text?.trim() && !ariaLabel && !value;

      if (isEmpty) {
        const classList = await button.getAttribute('class');
        const id = await button.getAttribute('id');

        await button.scrollIntoViewIfNeeded();

        await reportIssue(
          page,
          'Empty Buttons',
          'CRITICAL',
          `Button #${i + 1} (id: ${id || 'none'}, class: ${classList || 'none'})`,
          'Button has no text, aria-label, or value',
          'Add button text or aria-label for accessibility',
          `empty-button-${i}`
        );
      }
    }

    // Special check for newsletter section
    const newsletterButtons = await page.locator('section[class*="newsletter"] button, section[id*="newsletter"] button').all();
    for (let i = 0; i < newsletterButtons.length; i++) {
      const button = newsletterButtons[i];
      const text = await button.textContent();

      if (!text?.trim()) {
        await reportIssue(
          page,
          'Empty Buttons',
          'CRITICAL',
          `Newsletter section, button ${i + 1}`,
          'Newsletter submit button is empty',
          'Add "Inschrijven" or "Aanmelden" text to button',
          `empty-newsletter-button-${i}`
        );
      }
    }
  });

  test('4. MEDIUM: Check video fallback messages', async () => {
    console.log('\n🔍 Checking video elements...\n');

    const videos = await page.locator('video').all();

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const innerHTML = await video.innerHTML();

      // Check for fallback text
      if (innerHTML.includes('Your browser does not support') ||
          innerHTML.includes('browser does not support the video tag')) {

        await video.scrollIntoViewIfNeeded();

        await reportIssue(
          page,
          'Video Fallbacks',
          'MEDIUM',
          `Video element ${i + 1}`,
          'Default browser fallback message visible',
          'Replace with custom Dutch fallback message or ensure video loads properly',
          `video-fallback-${i}`
        );
      }

      // Check if video has sources
      const sources = await video.locator('source').count();
      if (sources === 0) {
        await reportIssue(
          page,
          'Video Fallbacks',
          'HIGH',
          `Video element ${i + 1}`,
          'Video has no source elements',
          'Add proper video source files',
          `video-no-source-${i}`
        );
      }
    }
  });

  test('5. HIGH: Analyze CTA inconsistencies', async () => {
    console.log('\n🔍 Analyzing CTAs for consistency...\n');

    // Common CTA selectors
    const ctaSelectors = [
      'a[class*="cta"]',
      'button[class*="cta"]',
      'a[class*="button"]',
      'a[href*="contact"]',
      'a[href*="gesprek"]',
      'a[href*="scan"]',
      'button[class*="primary"]'
    ];

    const ctaTexts = new Map<string, number>();
    const ctaList: { text: string; location: string }[] = [];

    for (const selector of ctaSelectors) {
      const elements = await page.locator(selector).all();

      for (const element of elements) {
        const text = (await element.textContent())?.trim();
        if (text && text.length > 3) { // Ignore very short text
          ctaTexts.set(text, (ctaTexts.get(text) || 0) + 1);

          const section = await element.locator('xpath=ancestor::section[1]').first();
          let sectionId = 'unknown';
          try {
            sectionId = await section.getAttribute('id') ||
                       await section.getAttribute('class') ||
                       'unknown';
          } catch (e) {
            sectionId = 'root-level';
          }

          ctaList.push({ text, location: sectionId });
        }
      }
    }

    // Check for too many variations
    const uniqueCTAs = Array.from(ctaTexts.keys());
    if (uniqueCTAs.length > 5) {
      const ctaSummary = uniqueCTAs.map(cta => `"${cta}" (${ctaTexts.get(cta)}x)`).join(', ');

      await reportIssue(
        page,
        'CTA Inconsistency',
        'HIGH',
        'Entire homepage',
        `Found ${uniqueCTAs.length} different CTA variations: ${ctaSummary}`,
        'Consolidate to 2-3 consistent CTA messages across the site',
        'cta-inconsistency'
      );
    }

    // List all CTAs for reference
    console.log('\n📋 CTA Summary:');
    for (const [text, count] of ctaTexts.entries()) {
      console.log(`  - "${text}": ${count}x`);
    }
  });

  test('6. HIGH: Check for English words in Dutch content', async () => {
    console.log('\n🔍 Checking for language inconsistencies...\n');

    // Common English words that should be Dutch
    const englishWords = [
      { en: 'setup kosten', nl: 'installatiekosten', context: 'pricing' },
      { en: 'remote working', nl: 'thuiswerken', context: 'working' },
      { en: 'setup', nl: 'installatie', context: 'general' },
      { en: 'remote', nl: 'op afstand', context: 'general' },
      { en: 'business', nl: 'bedrijf', context: 'general' },
      { en: 'software', nl: 'software', context: 'general' }, // Actually OK
      { en: 'cloud', nl: 'cloud', context: 'general' }, // Actually OK
      { en: 'support', nl: 'ondersteuning', context: 'support' },
      { en: 'service', nl: 'dienst', context: 'service' },
    ];

    const bodyText = await page.textContent('body') || '';
    const bodyLower = bodyText.toLowerCase();

    for (const { en, nl, context } of englishWords) {
      // Skip words that are acceptable in Dutch tech context
      if (en === 'software' || en === 'cloud') continue;

      if (bodyLower.includes(en.toLowerCase())) {
        // Find specific occurrences
        const elements = await page.locator(`text=/${en}/i`).all();

        if (elements.length > 0) {
          await reportIssue(
            page,
            'Language Inconsistency',
            'HIGH',
            `Found ${elements.length} occurrence(s)`,
            `English word "${en}" found in Dutch content`,
            `Replace with Dutch equivalent: "${nl}"`,
            `language-${en.replace(/\s+/g, '-')}`
          );
        }
      }
    }
  });

  test('7. COMPREHENSIVE: Full page screenshot for reference', async () => {
    console.log('\n📸 Capturing full page screenshot...\n');

    await page.screenshot({
      path: path.join(screenshotDir, 'homepage-full.png'),
      fullPage: true
    });

    console.log('✅ Full page screenshot saved\n');
  });
});

/**
 * Generate comprehensive QA report in Markdown format
 */
function generateQAReport(issues: QAIssue[]): string {
  const critical = issues.filter(i => i.priority === 'CRITICAL');
  const high = issues.filter(i => i.priority === 'HIGH');
  const medium = issues.filter(i => i.priority === 'MEDIUM');

  let report = `# Pre-Launch QA Report
Generated: ${new Date().toLocaleString('nl-NL')}

## Executive Summary

Total Issues Found: **${issues.length}**
- 🔴 Critical: **${critical.length}** (MUST fix before launch)
- 🟠 High: **${high.length}** (Should fix before launch)
- 🟡 Medium: **${medium.length}** (Fix if time permits)

---

`;

  // Critical Issues
  if (critical.length > 0) {
    report += `## 🔴 CRITICAL ISSUES (${critical.length})\n\n`;
    report += '**These MUST be fixed before going live!**\n\n';

    critical.forEach((issue, index) => {
      report += `### ${index + 1}. ${issue.category}: ${issue.location}\n\n`;
      report += `**Issue:** ${issue.issue}\n\n`;
      report += `**Fix:** ${issue.suggestion}\n\n`;
      if (issue.screenshot) {
        report += `**Screenshot:** \`${issue.screenshot}\`\n\n`;
      }
      report += '---\n\n';
    });
  }

  // High Priority Issues
  if (high.length > 0) {
    report += `## 🟠 HIGH PRIORITY ISSUES (${high.length})\n\n`;
    report += '**Strongly recommended to fix before launch**\n\n';

    high.forEach((issue, index) => {
      report += `### ${index + 1}. ${issue.category}: ${issue.location}\n\n`;
      report += `**Issue:** ${issue.issue}\n\n`;
      report += `**Fix:** ${issue.suggestion}\n\n`;
      if (issue.screenshot) {
        report += `**Screenshot:** \`${issue.screenshot}\`\n\n`;
      }
      report += '---\n\n';
    });
  }

  // Medium Priority Issues
  if (medium.length > 0) {
    report += `## 🟡 MEDIUM PRIORITY ISSUES (${medium.length})\n\n`;

    medium.forEach((issue, index) => {
      report += `### ${index + 1}. ${issue.category}: ${issue.location}\n\n`;
      report += `**Issue:** ${issue.issue}\n\n`;
      report += `**Fix:** ${issue.suggestion}\n\n`;
      if (issue.screenshot) {
        report += `**Screenshot:** \`${issue.screenshot}\`\n\n`;
      }
      report += '---\n\n';
    });
  }

  // Summary by category
  report += `## Summary by Category\n\n`;
  const categories = new Map<string, number>();
  issues.forEach(issue => {
    categories.set(issue.category, (categories.get(issue.category) || 0) + 1);
  });

  categories.forEach((count, category) => {
    report += `- **${category}**: ${count} issue(s)\n`;
  });

  report += `\n## Next Steps\n\n`;
  report += `1. Fix all CRITICAL issues immediately\n`;
  report += `2. Address HIGH priority issues before launch\n`;
  report += `3. Review MEDIUM issues and fix if time allows\n`;
  report += `4. Re-run this test suite after fixes\n`;
  report += `5. Get stakeholder sign-off before deployment\n\n`;

  report += `---\n\n`;
  report += `**Test Environment:** localhost:3000\n`;
  report += `**Test Date:** ${new Date().toLocaleString('nl-NL')}\n`;
  report += `**Screenshots Location:** \`${screenshotDir}\`\n`;

  return report;
}
