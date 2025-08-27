import { test, expect } from '@playwright/test'

test.describe('Form Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Contact Form', () => {
    test('should validate required fields', async ({ page }) => {
      await page.goto('/contact')
      
      // Try to submit empty form
      await page.click('button[type="submit"]')
      
      // Check for validation errors
      await expect(page.locator('text=Naam is verplicht')).toBeVisible()
      await expect(page.locator('text=E-mail is verplicht')).toBeVisible()
      await expect(page.locator('text=Onderwerp is verplicht')).toBeVisible()
      await expect(page.locator('text=Bericht is verplicht')).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      await page.goto('/contact')
      
      await page.fill('input[name="email"]', 'invalid-email')
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Voer een geldig e-mailadres in')).toBeVisible()
    })

    test('should validate phone format when provided', async ({ page }) => {
      await page.goto('/contact')
      
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="phone"]', 'invalid-phone')
      await page.selectOption('select[name="subject"]', 'general-inquiry')
      await page.fill('textarea[name="message"]', 'Test message with sufficient length')
      
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Voer een geldig telefoonnummer in')).toBeVisible()
    })

    test('should validate message length', async ({ page }) => {
      await page.goto('/contact')
      
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.selectOption('select[name="subject"]', 'general-inquiry')
      await page.fill('textarea[name="message"]', 'Short')
      
      await page.click('button[type="submit"]')
      
      await expect(page.locator('text=Bericht moet minimaal 10 karakters bevatten')).toBeVisible()
    })
  })

  test.describe('Newsletter Signup', () => {
    test('should validate email in newsletter signup', async ({ page }) => {
      // Find newsletter signup form
      const newsletterForm = page.locator('form').filter({ hasText: 'Inschrijven' }).first()
      
      if (await newsletterForm.isVisible()) {
        await newsletterForm.locator('input[type="email"]').fill('invalid-email')
        await newsletterForm.locator('button[type="submit"]').click()
        
        await expect(page.locator('text=Voer een geldig e-mailadres in')).toBeVisible()
      }
    })

    test('should show loading state during submission', async ({ page }) => {
      const newsletterForm = page.locator('form').filter({ hasText: 'Inschrijven' }).first()
      
      if (await newsletterForm.isVisible()) {
        await newsletterForm.locator('input[type="email"]').fill('test@example.com')
        
        // Mock slow response
        await page.route('/api/newsletter', async route => {
          await new Promise(resolve => setTimeout(resolve, 2000))
          await route.fulfill({ json: { success: true } })
        })
        
        await newsletterForm.locator('button[type="submit"]').click()
        
        // Check for loading state
        await expect(page.locator('text=Bezig...')).toBeVisible()
      }
    })
  })

  test.describe('Pricing Calculator', () => {
    test('should validate pricing calculator inputs', async ({ page }) => {
      await page.goto('/prijzen')
      
      // Check if pricing calculator is present
      const calculator = page.locator('.pricing-calculator').first()
      
      if (await calculator.isVisible()) {
        // Test slider interactions
        const slider = calculator.locator('input[type="range"]').first()
        if (await slider.isVisible()) {
          await slider.fill('50')
          await expect(slider).toHaveValue('50')
        }
      }
    })

    test('should show price updates in real-time', async ({ page }) => {
      await page.goto('/prijzen')
      
      const calculator = page.locator('.pricing-calculator').first()
      
      if (await calculator.isVisible()) {
        const initialPrice = await calculator.locator('.price-display').first().textContent()
        
        // Change quantity
        const slider = calculator.locator('input[type="range"]').first()
        if (await slider.isVisible()) {
          await slider.fill('75')
          
          // Wait for price update
          await page.waitForTimeout(500)
          const newPrice = await calculator.locator('.price-display').first().textContent()
          
          expect(newPrice).not.toBe(initialPrice)
        }
      }
    })
  })
})

test.describe('Error Handling', () => {
  test('should show custom 404 page', async ({ page }) => {
    await page.goto('/non-existent-page')
    
    await expect(page.locator('text=Error 404: Pagina Niet Gevonden')).toBeVisible()
    await expect(page.locator('text=Blue Screen of Death')).toBeVisible()
    await expect(page.locator('text=Workflo tip')).toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/contact')
    
    // Mock API error
    await page.route('/api/contact', async route => {
      await route.fulfill({ 
        status: 500, 
        json: { success: false, error: 'Server error' }
      })
    })
    
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.selectOption('select[name="subject"]', 'general-inquiry')
    await page.fill('textarea[name="message"]', 'Test message with sufficient length')
    
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Er ging iets mis')).toBeVisible()
  })
})

test.describe('Loading States', () => {
  test('should show loading states during form submission', async ({ page }) => {
    await page.goto('/contact')
    
    // Mock slow API response
    await page.route('/api/contact', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.fulfill({ json: { success: true } })
    })
    
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.selectOption('select[name="subject"]', 'general-inquiry')
    await page.fill('textarea[name="message"]', 'Test message with sufficient length')
    
    await page.click('button[type="submit"]')
    
    // Check for loading state
    await expect(page.locator('text=Bezig met verzenden')).toBeVisible()
    await expect(page.locator('.animate-spin')).toBeVisible()
  })
})