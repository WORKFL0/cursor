/**
 * Critical E2E Tests - Homepage
 * Tests the most critical user flows on the homepage
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage Critical Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    // Verify page loads without errors
    await expect(page).toHaveTitle(/Workflo/i)
    
    // Check for critical elements
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should display hero section with key elements', async ({ page }) => {
    // Check hero section is visible
    const heroSection = page.locator('[data-testid="hero-section"], .hero-section').first()
    await expect(heroSection).toBeVisible()

    // Check for main heading
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/Workflo|IT|Services/i)

    // Check for CTA buttons
    const ctaButtons = page.locator('a[href*="contact"], button').filter({ hasText: /Contact|Offerte|Start/i })
    await expect(ctaButtons.first()).toBeVisible()
  })

  test('should navigate to contact page from CTA', async ({ page }) => {
    // Find and click contact CTA
    const contactCTA = page.locator('a[href*="contact"], a').filter({ hasText: /Contact|Neem contact/i }).first()
    await expect(contactCTA).toBeVisible()
    
    await contactCTA.click()
    
    // Verify navigation
    await expect(page).toHaveURL(/.*contact/)
    await expect(page.locator('h1, h2').filter({ hasText: /Contact|Neem contact/i })).toBeVisible()
  })

  test('should display services section', async ({ page }) => {
    // Check for services section
    const servicesSection = page.locator('[data-testid="services-section"], .services-section').first()
    
    // If not visible, scroll to find it
    if (!(await servicesSection.isVisible())) {
      await page.locator('text=/Services|Diensten/i').first().scrollIntoViewIfNeeded()
    }

    const servicesHeading = page.locator('h2, h3').filter({ hasText: /Services|Diensten/i }).first()
    await expect(servicesHeading).toBeVisible()

    // Check for at least 3 service items
    const serviceItems = page.locator('[data-testid*="service"], .service-card, .service-item')
    const count = await serviceItems.count()
    expect(count).toBeGreaterThan(2)
  })

  test('should have functional navigation menu', async ({ page }) => {
    const navigation = page.locator('nav, [role="navigation"]').first()
    await expect(navigation).toBeVisible()

    // Check for key navigation items
    const navItems = [
      /Services|Diensten/i,
      /About|Over ons/i,
      /Contact/i
    ]

    for (const item of navItems) {
      const navLink = navigation.locator('a').filter({ hasText: item }).first()
      if (await navLink.count() > 0) {
        await expect(navLink).toBeVisible()
      }
    }
  })

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Filter out known third-party errors that we can't control
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('googleapis.com') &&
      !error.includes('facebook.com') &&
      !error.includes('linkedin.com') &&
      !error.includes('clarity.ms') &&
      !error.includes('hotjar.com')
    )

    expect(criticalErrors).toHaveLength(0)
  })

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check title
    const title = await page.title()
    expect(title.length).toBeGreaterThan(10)
    expect(title.length).toBeLessThan(60)

    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(50)
    expect(description!.length).toBeLessThan(160)

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toBeAttached()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()

    // Check mobile navigation
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"]').first()
    
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      
      // Check that navigation items are now visible
      const navigation = page.locator('nav, [role="navigation"]').first()
      await expect(navigation).toBeVisible()
    }

    // Check hero section is still visible and readable
    const heroHeading = page.locator('h1').first()
    await expect(heroHeading).toBeVisible()
    
    // Verify text is not cut off
    const boundingBox = await heroHeading.boundingBox()
    expect(boundingBox?.width).toBeLessThan(375) // Should fit in mobile viewport
  })

  test('should load key resources successfully', async ({ page }) => {
    const resourceErrors: string[] = []
    
    page.on('response', (response) => {
      if (response.status() >= 400) {
        resourceErrors.push(`${response.status()} ${response.url()}`)
      }
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Filter out expected third-party failures
    const criticalResourceErrors = resourceErrors.filter(error => 
      !error.includes('googleapis.com') &&
      !error.includes('facebook.com') &&
      !error.includes('linkedin.com') &&
      !error.includes('analytics') &&
      !error.includes('ads')
    )

    expect(criticalResourceErrors).toHaveLength(0)
  })

  test('should have working footer links', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded()
    
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Test a few key footer links
    const footerLinks = footer.locator('a[href]')
    const linkCount = await footerLinks.count()
    
    expect(linkCount).toBeGreaterThan(5) // Should have multiple footer links

    // Test that at least one internal link works
    const internalLinks = footer.locator('a[href^="/"], a[href^="./"], a[href*="workflo"]')
    if (await internalLinks.count() > 0) {
      const firstInternalLink = internalLinks.first()
      const href = await firstInternalLink.getAttribute('href')
      
      if (href && !href.includes('mailto:') && !href.includes('tel:')) {
        await firstInternalLink.click()
        await expect(page).toHaveURL(new RegExp(href))
      }
    }
  })
})

test.describe('Homepage Performance', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should load within 5 seconds on a good connection
    expect(loadTime).toBeLessThan(5000)
  })

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/')
    
    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
        
        // Fallback timeout
        setTimeout(() => resolve(0), 10000)
      })
    })

    // LCP should be under 2.5 seconds (good threshold)
    expect(lcp).toBeLessThan(2500)
  })
})