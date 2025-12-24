import { chromium } from '@playwright/test'

async function testHubSpotForm() {
  console.log('🧪 Testing HubSpot Form Loading...\n')

  const browser = await chromium.launch({ headless: false }) // Non-headless to see what's happening
  const context = await browser.newContext()
  const page = await context.newPage()

  // Listen to all console messages
  const consoleMessages: Array<{ type: string; text: string }> = []
  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() })
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`)
  })

  // Listen to network requests
  const networkRequests: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (url.includes('hsforms') || url.includes('hs-scripts')) {
      networkRequests.push(url)
      console.log(`📡 Request: ${url}`)
    }
  })

  try {
    console.log('📄 Loading contact page...\n')
    await page.goto('http://localhost:3001/contact', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    console.log('\n⏳ Waiting 10 seconds for HubSpot form to load...\n')
    await page.waitForTimeout(10000)

    // Check for HubSpot form elements
    console.log('\n🔍 Checking for HubSpot elements:\n')

    const hbsptFormDiv = await page.locator('.hbspt-form').count()
    console.log(`  - .hbspt-form divs: ${hbsptFormDiv}`)

    const hubspotIframes = await page.locator('iframe[title*="Form"]').count()
    console.log(`  - HubSpot iframes: ${hubspotIframes}`)

    const formContainer = await page.locator('#hubspot-form-container').count()
    console.log(`  - Form container: ${formContainer}`)

    const loadingText = await page.locator('text="Formulier laden..."').count()
    console.log(`  - Loading text: ${loadingText}`)

    const errorText = await page.locator('text="Formulier kon niet worden geladen"').count()
    console.log(`  - Error text: ${errorText}`)

    // Check for hbspt object
    const hbsptExists = await page.evaluate(() => {
      return typeof (window as any).hbspt !== 'undefined'
    })
    console.log(`\n  - window.hbspt exists: ${hbsptExists}`)

    if (hbsptExists) {
      const hbsptForms = await page.evaluate(() => {
        return typeof (window as any).hbspt?.forms !== 'undefined'
      })
      console.log(`  - window.hbspt.forms exists: ${hbsptForms}`)
    }

    console.log('\n📡 Network requests to HubSpot:')
    if (networkRequests.length > 0) {
      networkRequests.forEach((url) => console.log(`  - ${url}`))
    } else {
      console.log('  - No HubSpot requests detected')
    }

    console.log('\n📋 Console messages:')
    if (consoleMessages.length > 0) {
      consoleMessages.forEach(({ type, text }) => {
        if (text.includes('hubspot') || text.includes('hbspt') || text.includes('form')) {
          console.log(`  [${type.toUpperCase()}] ${text}`)
        }
      })
    }

    // Take a screenshot
    console.log('\n📸 Taking screenshot...')
    await page.screenshot({
      path: 'scripts/screenshots/hubspot-form-test.png',
      fullPage: true,
    })
    console.log('✅ Screenshot saved')

    console.log('\n⏸️ Keeping browser open for 30 seconds for manual inspection...')
    await page.waitForTimeout(30000)
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await browser.close()
  }
}

testHubSpotForm()
