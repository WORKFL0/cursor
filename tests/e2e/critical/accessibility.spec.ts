/**
 * E2E Accessibility Tests
 * Tests keyboard navigation, screen reader compatibility, and WCAG compliance
 */

import { test, expect } from '@playwright/test'

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Start tabbing through the page
    let tabCount = 0
    const maxTabs = 20 // Prevent infinite loop
    const focusableElements: string[] = []

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      tabCount++
      
      const focusedElement = await page.locator(':focus')
      
      if (await focusedElement.count() > 0) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase())
        const role = await focusedElement.getAttribute('role')
        const ariaLabel = await focusedElement.getAttribute('aria-label')
        
        focusableElements.push(`${tagName}${role ? `[role="${role}"]` : ''}${ariaLabel ? ` "${ariaLabel}"` : ''}`)
        
        // Check that focused element is visible
        await expect(focusedElement).toBeVisible()
        
        // Check that focus is clearly visible (should have focus outline)
        const hasOutline = await focusedElement.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return styles.outline !== 'none' && styles.outline !== '0px'
        })
        
        if (!hasOutline) {
          // Check for alternative focus indicators
          const hasBoxShadow = await focusedElement.evaluate(el => {
            const styles = window.getComputedStyle(el)
            return styles.boxShadow && styles.boxShadow !== 'none'
          })
          
          const hasBorder = await focusedElement.evaluate(el => {
            const styles = window.getComputedStyle(el)
            return styles.border && styles.border !== 'none' && styles.borderWidth !== '0px'
          })
          
          expect(hasBoxShadow || hasBorder).toBe(true)
        }
      }
    }
    
    // Should have found multiple focusable elements
    expect(focusableElements.length).toBeGreaterThan(3)
    
    // Common focusable elements should be present
    const elementTypes = focusableElements.join(' ')
    expect(elementTypes).toMatch(/button|a|input/)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
    
    // Should have at least one heading
    expect(headings.length).toBeGreaterThan(0)
    
    // Check heading levels
    const headingLevels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll(elements => 
      elements.map(el => parseInt(el.tagName.substring(1)))
    )
    
    // Should start with h1
    expect(headingLevels[0]).toBe(1)
    
    // Check for proper hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i]
      const previous = headingLevels[i - 1]
      
      // Level should not increase by more than 1
      if (current > previous) {
        expect(current - previous).toBeLessThanOrEqual(1)
      }
    }
  })

  test('should have proper form labels and ARIA attributes', async ({ page }) => {
    await page.goto('/contact')
    
    // Check that all form inputs have labels
    const inputs = page.locator('input, select, textarea')
    const inputCount = await inputs.count()
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i)
      const inputId = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      
      if (inputId) {
        // Should have corresponding label
        const label = page.locator(`label[for="${inputId}"]`)
        const hasLabel = await label.count() > 0
        
        if (!hasLabel) {
          // Should have aria-label or aria-labelledby
          expect(ariaLabel || ariaLabelledBy).toBeTruthy()
        }
      } else {
        // Without ID, should have aria-label
        expect(ariaLabel).toBeTruthy()
      }
    }
  })

  test('should have sufficient color contrast', async ({ page }) => {
    // Get all text elements
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, a, button, label, span')
    const elementCount = await textElements.count()
    
    // Sample a few elements to check contrast
    const samplesToCheck = Math.min(10, elementCount)
    
    for (let i = 0; i < samplesToCheck; i++) {
      const element = textElements.nth(i * Math.floor(elementCount / samplesToCheck))
      
      if (await element.isVisible()) {
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize
          }
        })
        
        // Basic check - ensure text is not transparent or same as background
        expect(styles.color).not.toBe('rgba(0, 0, 0, 0)')
        expect(styles.color).not.toBe('transparent')
        
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          expect(styles.color).not.toBe(styles.backgroundColor)
        }
      }
    }
  })

  test('should have proper alt text for images', async ({ page }) => {
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const src = await img.getAttribute('src')
      const role = await img.getAttribute('role')
      
      // Decorative images can have empty alt or role="presentation"
      if (role === 'presentation' || role === 'none') {
        continue
      }
      
      // Images should have alt text
      expect(alt).toBeDefined()
      
      // Alt text should be meaningful (not just filename)
      if (alt && src) {
        const filename = src.split('/').pop()?.split('.')[0] || ''
        
        if (filename.length > 0) {
          // Alt text should be different from filename
          expect(alt.toLowerCase()).not.toBe(filename.toLowerCase())
        }
      }
    }
  })

  test('should support screen reader navigation', async ({ page }) => {
    // Check for landmarks
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').count()
    expect(landmarks).toBeGreaterThan(2) // Should have at least main and navigation
    
    // Check for skip links
    const skipLinks = page.locator('a[href^="#"], a').filter({ hasText: /skip|jump/i })
    const hasSkipLinks = await skipLinks.count() > 0
    
    // Skip links are recommended but not required
    if (hasSkipLinks) {
      const firstSkipLink = skipLinks.first()
      const href = await firstSkipLink.getAttribute('href')
      
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1)
        const target = page.locator(`#${targetId}`)
        expect(await target.count()).toBeGreaterThan(0)
      }
    }
  })

  test('should handle focus management correctly', async ({ page }) => {
    // Test modal or dropdown focus management if present
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(3, buttonCount); i++) {
      const button = buttons.nth(i)
      
      if (await button.isVisible()) {
        await button.click()
        await page.waitForTimeout(500)
        
        // Check if a modal or dropdown opened
        const modal = page.locator('[role="dialog"], .modal, [aria-modal="true"]')
        const dropdown = page.locator('[role="menu"], [role="listbox"], .dropdown-menu')
        
        if (await modal.count() > 0) {
          // Focus should be trapped in modal
          const modalFocusable = modal.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')
          
          if (await modalFocusable.count() > 0) {
            const firstFocusable = modalFocusable.first()
            await expect(firstFocusable).toBeFocused()
            
            // Close modal if possible
            const closeButton = modal.locator('button[aria-label*="close"], button').filter({ hasText: /close|×/i }).first()
            if (await closeButton.count() > 0) {
              await closeButton.click()
            } else {
              await page.keyboard.press('Escape')
            }
          }
        }
        
        if (await dropdown.count() > 0) {
          // Focus should move to first item or stay on button
          await page.keyboard.press('Escape') // Close dropdown
        }
      }
    }
  })

  test('should have proper ARIA states and properties', async ({ page }) => {
    // Check for interactive elements with proper ARIA
    const buttons = page.locator('button[aria-expanded], button[aria-haspopup]')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const ariaExpanded = await button.getAttribute('aria-expanded')
      const ariaHaspopup = await button.getAttribute('aria-haspopup')
      
      if (ariaExpanded) {
        expect(['true', 'false']).toContain(ariaExpanded)
        
        // If expanded, should have associated content
        if (ariaExpanded === 'true') {
          const ariaControls = await button.getAttribute('aria-controls')
          if (ariaControls) {
            const controlledElement = page.locator(`#${ariaControls}`)
            expect(await controlledElement.count()).toBe(1)
          }
        }
      }
      
      if (ariaHaspopup) {
        expect(['true', 'false', 'menu', 'listbox', 'tree', 'grid', 'dialog']).toContain(ariaHaspopup)
      }
    }
  })

  test('should be navigable with screen reader shortcuts', async ({ page }) => {
    // Simulate common screen reader navigation
    
    // Navigate by headings (screen readers use this)
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await headings.count()
    expect(headingCount).toBeGreaterThan(0)
    
    // Navigate by links
    const links = page.locator('a[href]')
    const linkCount = await links.count()
    expect(linkCount).toBeGreaterThan(0)
    
    // Navigate by form controls
    await page.goto('/contact')
    const formControls = page.locator('input, select, textarea, button[type="submit"]')
    const formControlCount = await formControls.count()
    expect(formControlCount).toBeGreaterThan(0)
    
    // Each form control should be accessible
    for (let i = 0; i < formControlCount; i++) {
      const control = formControls.nth(i)
      const tagName = await control.evaluate(el => el.tagName.toLowerCase())
      
      // Should have accessible name
      const accessibleName = await control.evaluate(el => {
        // Check various ways to get accessible name
        const ariaLabel = el.getAttribute('aria-label')
        if (ariaLabel) return ariaLabel
        
        const ariaLabelledby = el.getAttribute('aria-labelledby')
        if (ariaLabelledby) {
          const labelElement = document.getElementById(ariaLabelledby)
          if (labelElement) return labelElement.textContent
        }
        
        if (el.id) {
          const label = document.querySelector(`label[for="${el.id}"]`)
          if (label) return label.textContent
        }
        
        const parentLabel = el.closest('label')
        if (parentLabel) return parentLabel.textContent
        
        return el.getAttribute('placeholder') || ''
      })
      
      expect(accessibleName).toBeTruthy()
    }
  })

  test('should handle reduced motion preferences', async ({ page }) => {
    // Test with prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    
    // Animations should be reduced or disabled
    const animatedElements = page.locator('[style*="animation"], [class*="animate"], [class*="transition"]')
    const animatedCount = await animatedElements.count()
    
    // Check a few animated elements
    for (let i = 0; i < Math.min(3, animatedCount); i++) {
      const element = animatedElements.nth(i)
      
      const animationDuration = await element.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return styles.animationDuration
      })
      
      // With reduced motion, animations should be instant or very short
      if (animationDuration && animationDuration !== '0s') {
        const duration = parseFloat(animationDuration.replace('s', ''))
        expect(duration).toBeLessThan(0.5) // Should be very short
      }
    }
  })

  test('should work with high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            background-color: white !important;
            color: black !important;
            border-color: black !important;
          }
        }
      `
    })
    
    await page.reload()
    
    // Check that content is still visible and functional
    const mainContent = page.locator('main, [role="main"]')
    await expect(mainContent).toBeVisible()
    
    // Check that interactive elements are still usable
    const buttons = page.locator('button')
    if (await buttons.count() > 0) {
      await expect(buttons.first()).toBeVisible()
      await expect(buttons.first()).toBeEnabled()
    }
  })
})