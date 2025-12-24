import { chromium } from '@playwright/test'

async function testContactPage() {
  console.log('🧪 Testing Contact Page...\n')

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    // Test contact page
    console.log('📄 Loading contact page...')
    const response = await page.goto('http://localhost:3001/contact', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    if (!response || response.status() !== 200) {
      console.error(`❌ Failed to load contact page: HTTP ${response?.status()}`)
      return
    }

    console.log('✅ Contact page loaded successfully')

    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(3000) // Give time for HubSpot form to load

    // Check for HubSpot form
    console.log('\n🔍 Checking for HubSpot form...')
    const hubspotFormExists = await page.locator('.hbspt-form').count()
    const hubspotIframeExists = await page.locator('iframe[title*="Form"]').count()

    if (hubspotFormExists > 0 || hubspotIframeExists > 0) {
      console.log('✅ HubSpot form found and loaded')
    } else {
      console.log('⚠️ HubSpot form not found - checking for fallback...')
      const fallbackExists = await page.locator('text="Formulier kon niet worden geladen"').count()
      if (fallbackExists > 0) {
        console.log('✅ Fallback contact info displayed')
      } else {
        console.log('⏳ HubSpot form still loading...')
      }
    }

    // Check for Google Maps
    console.log('\n🗺️ Checking for Google Maps...')
    const mapsIframeExists = await page.locator('iframe[src*="google.com/maps"]').count()

    if (mapsIframeExists > 0) {
      console.log('✅ Google Maps iframe found')
    } else {
      console.log('❌ Google Maps iframe not found')
    }

    // Check for CSP errors
    console.log('\n🔒 Checking for CSP errors...')
    const consoleMessages: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        consoleMessages.push(msg.text())
      }
    })

    // Wait a bit to capture any console errors
    await page.waitForTimeout(2000)

    if (consoleMessages.length > 0) {
      console.log('❌ CSP errors found:')
      consoleMessages.forEach((msg) => console.log(`  - ${msg}`))
    } else {
      console.log('✅ No CSP errors detected')
    }

    // Take a screenshot
    console.log('\n📸 Taking screenshot...')
    await page.screenshot({
      path: 'scripts/screenshots/contact-page-test.png',
      fullPage: true,
    })
    console.log('✅ Screenshot saved to scripts/screenshots/contact-page-test.png')

    console.log('\n✅ Contact page test completed!')
  } catch (error) {
    console.error('❌ Error testing contact page:', error)
  } finally {
    await browser.close()
  }
}

testContactPage()
