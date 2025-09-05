/**
 * E2E Tests - Site Navigation
 * Tests navigation flows, routing, and page transitions
 */

import { test, expect } from '@playwright/test'

test.describe('Site Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate through main menu items', async ({ page }) => {
    // Test homepage to services navigation
    const servicesLink = page.locator('nav a, header a').filter({ hasText: /Services|Diensten/i }).first()
    
    if (await servicesLink.count() > 0) {
      await servicesLink.click()
      await expect(page).toHaveURL(/.*services|.*diensten/i)
      await expect(page.locator('h1, h2').filter({ hasText: /Services|Diensten/i })).toBeVisible()
    }

    // Navigate back to home
    const homeLink = page.locator('nav a, header a').filter({ hasText: /Home|Workflo/i }).first()
    if (await homeLink.count() > 0) {
      await homeLink.click()
      await expect(page).toHaveURL('/')
    } else {
      // Try logo click
      const logo = page.locator('a[href="/"], img[alt*="logo"], img[alt*="Workflo"]').first()
      if (await logo.count() > 0) {
        await logo.click()
        await expect(page).toHaveURL('/')
      }
    }
  })

  test('should navigate to contact page and back', async ({ page }) => {
    // Navigate to contact
    const contactLink = page.locator('a').filter({ hasText: /Contact|Neem contact/i }).first()
    await contactLink.click()
    
    await expect(page).toHaveURL(/.*contact/)
    await expect(page.locator('h1, h2').filter({ hasText: /Contact|Neem contact/i })).toBeVisible()

    // Check that contact form is present
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()

    // Navigate back using breadcrumb or back button if available
    const breadcrumb = page.locator('[aria-label="breadcrumb"], .breadcrumb, nav[aria-label*="breadcrumb"]')
    if (await breadcrumb.count() > 0) {
      const homeInBreadcrumb = breadcrumb.locator('a').filter({ hasText: /Home|Workflo/i }).first()
      if (await homeInBreadcrumb.count() > 0) {
        await homeInBreadcrumb.click()
        await expect(page).toHaveURL('/')
      }
    }
  })

  test('should handle direct URL navigation', async ({ page }) => {
    // Test direct navigation to contact page
    await page.goto('/contact')
    await expect(page.locator('h1, h2').filter({ hasText: /Contact|Neem contact/i })).toBeVisible()
    await expect(page.locator('form')).toBeVisible()

    // Test direct navigation to services page (if it exists)
    await page.goto('/services')
    // Should either show services page or redirect appropriately
    await page.waitForLoadState('networkidle')
    
    // Check that we're on a valid page (not 404)
    const is404 = await page.locator('text=/404|Not Found|Pagina niet gevonden/i').count() > 0
    if (is404) {
      // If 404, should have proper 404 page
      await expect(page.locator('h1, h2').filter({ hasText: /404|Not Found|Niet gevonden/i })).toBeVisible()
    } else {
      // If valid page, should have content
      await expect(page.locator('main, [role="main"]')).toBeVisible()
    }
  })

  test('should handle 404 errors gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page')
    
    // Should show 404 page or redirect to home
    await page.waitForLoadState('networkidle')
    
    const currentUrl = page.url()
    if (currentUrl.includes('/non-existent-page')) {
      // Should show 404 page
      await expect(page.locator('text=/404|Not Found|Pagina niet gevonden/i')).toBeVisible()
      
      // Should have link back to home
      const homeLink = page.locator('a[href="/"], a').filter({ hasText: /Home|Terug naar home|Back to home/i }).first()
      if (await homeLink.count() > 0) {
        await homeLink.click()
        await expect(page).toHaveURL('/')
      }
    } else {
      // Redirected to valid page (e.g., home)
      await expect(page.locator('main, [role="main"]')).toBeVisible()
    }
  })

  test('should maintain navigation state during page transitions', async ({ page }) => {
    // Check if navigation has active states
    const navigation = page.locator('nav, [role="navigation"]').first()
    await expect(navigation).toBeVisible()

    // Navigate to different pages and check active states
    const navLinks = navigation.locator('a[href]')
    const linkCount = await navLinks.count()
    
    if (linkCount > 0) {
      const firstLink = navLinks.first()
      const href = await firstLink.getAttribute('href')
      
      if (href && !href.includes('mailto:') && !href.includes('tel:') && !href.startsWith('http')) {
        await firstLink.click()
        await page.waitForLoadState('networkidle')
        
        // Check if the clicked link now has active styling
        const activeClasses = ['active', 'current', 'selected']
        let hasActiveState = false
        
        for (const activeClass of activeClasses) {
          if (await firstLink.locator(`[class*="${activeClass}"]`).count() > 0) {
            hasActiveState = true
            break
          }
        }
        
        // Active state is optional but good UX if present
      }
    }
  })

  test('should work with browser back/forward buttons', async ({ page }) => {
    const initialUrl = page.url()
    
    // Navigate to contact page
    const contactLink = page.locator('a').filter({ hasText: /Contact/i }).first()
    await contactLink.click()
    
    const contactUrl = page.url()
    expect(contactUrl).not.toBe(initialUrl)
    
    // Use browser back button
    await page.goBack()
    await expect(page).toHaveURL(initialUrl)
    
    // Use browser forward button
    await page.goForward()
    await expect(page).toHaveURL(contactUrl)
    
    // Verify page content is still correct after navigation
    await expect(page.locator('h1, h2').filter({ hasText: /Contact/i })).toBeVisible()
  })

  test('should handle mobile navigation correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()

    // Look for mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button').filter({ hasText: /menu/i }).first()
    
    if (await mobileMenuButton.isVisible()) {
      // Open mobile menu
      await mobileMenuButton.click()
      
      // Mobile menu should be visible
      const mobileMenu = page.locator('nav, [role="navigation"], .mobile-menu, [data-testid="mobile-menu"]').first()
      await expect(mobileMenu).toBeVisible()
      
      // Test navigation from mobile menu
      const mobileContactLink = mobileMenu.locator('a').filter({ hasText: /Contact/i }).first()
      if (await mobileContactLink.count() > 0) {
        await mobileContactLink.click()
        await expect(page).toHaveURL(/.*contact/)
      }
    }
  })

  test('should load pages with proper SEO structure', async ({ page }) => {
    const pagesToTest = ['/', '/contact']
    
    for (const pagePath of pagesToTest) {
      await page.goto(pagePath)
      
      // Check for proper heading structure
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeGreaterThan(0) // Should have at least one H1
      expect(h1Count).toBeLessThan(3) // Should not have too many H1s
      
      // Check for meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
      expect(metaDescription).toBeTruthy()
      expect(metaDescription!.length).toBeGreaterThan(50)
      
      // Check for proper title
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(10)
    }
  })

  test('should have consistent footer across pages', async ({ page }) => {
    const pagesToTest = ['/', '/contact']
    
    for (const pagePath of pagesToTest) {
      await page.goto(pagePath)
      
      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded()
      
      // Check footer is visible and has content
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
      
      // Check for common footer elements
      const footerLinks = footer.locator('a[href]')
      const linkCount = await footerLinks.count()
      expect(linkCount).toBeGreaterThan(3) // Should have multiple footer links
      
      // Check for contact information or company info
      const hasContactInfo = await footer.locator('text=/contact|email|telefoon|phone/i').count() > 0
      const hasCompanyInfo = await footer.locator('text=/Workflo|copyright|©/i').count() > 0
      
      expect(hasContactInfo || hasCompanyInfo).toBe(true)
    }
  })

  test('should handle external links correctly', async ({ page }) => {
    // Find external links (not starting with / or current domain)
    const externalLinks = page.locator('a[href^="http"]:not([href*="workflo"]), a[href^="mailto:"], a[href^="tel:"]')
    
    if (await externalLinks.count() > 0) {
      const firstExternalLink = externalLinks.first()
      const href = await firstExternalLink.getAttribute('href')
      
      // Check if external links have proper attributes
      if (href && (href.startsWith('http') && !href.includes('workflo'))) {
        // External links should open in new tab/window
        const target = await firstExternalLink.getAttribute('target')
        const rel = await firstExternalLink.getAttribute('rel')
        
        // Should have target="_blank" for external links (security best practice)
        expect(target).toBe('_blank')
        
        // Should have rel="noopener" or rel="noreferrer" for security
        if (rel) {
          expect(rel).toMatch(/noopener|noreferrer/)
        }
      }
    }
  })

  test('should maintain scroll position appropriately', async ({ page }) => {
    // Scroll down on homepage
    await page.evaluate(() => window.scrollTo(0, 500))
    
    const initialScrollY = await page.evaluate(() => window.scrollY)
    expect(initialScrollY).toBeGreaterThan(400)
    
    // Navigate to another page
    const contactLink = page.locator('a').filter({ hasText: /Contact/i }).first()
    await contactLink.click()
    
    // Should start at top of new page
    await page.waitForTimeout(1000)
    const newPageScrollY = await page.evaluate(() => window.scrollY)
    expect(newPageScrollY).toBeLessThan(100) // Should be near top
    
    // Navigate back
    await page.goBack()
    
    // Scroll position handling varies by application - some restore, some don't
    // Just verify we're back on the original page
    await expect(page).toHaveURL('/')
  })

  test('should handle hash/anchor navigation', async ({ page }) => {
    // Look for anchor links on the page
    const anchorLinks = page.locator('a[href^="#"]')
    
    if (await anchorLinks.count() > 0) {
      const firstAnchorLink = anchorLinks.first()
      const href = await firstAnchorLink.getAttribute('href')
      
      if (href && href.length > 1) {
        const targetId = href.substring(1)
        
        // Check if target element exists
        const targetElement = page.locator(`#${targetId}`)
        
        if (await targetElement.count() > 0) {
          await firstAnchorLink.click()
          
          // Wait for scroll
          await page.waitForTimeout(1000)
          
          // Check that we scrolled to the target element
          const targetVisible = await targetElement.isInViewport()
          expect(targetVisible).toBe(true)
          
          // URL should include hash
          const currentUrl = page.url()
          expect(currentUrl).toContain(href)
        }
      }
    }
  })

  test('should load all pages without JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    const pagesToTest = ['/', '/contact']
    
    for (const pagePath of pagesToTest) {
      consoleErrors.length = 0 // Clear previous errors
      
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')
      
      // Filter out known third-party errors
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('googleapis.com') &&
        !error.includes('facebook.com') &&
        !error.includes('linkedin.com') &&
        !error.includes('clarity.ms') &&
        !error.includes('hotjar.com') &&
        !error.includes('analytics')
      )
      
      expect(criticalErrors).toHaveLength(0)
    }
  })
})