/**
 * E2E Tests - Contact Form
 * Tests the complete contact form submission flow
 */

import { test, expect } from '@playwright/test'

test.describe('Contact Form E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display contact form with all fields', async ({ page }) => {
    // Wait for form to load
    await expect(page.locator('form')).toBeVisible()

    // Check for all required fields
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="phone"]')).toBeVisible()
    await expect(page.locator('input[name="company"]')).toBeVisible()
    await expect(page.locator('select[name="subject"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()

    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).not.toBeDisabled()
  })

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    
    // Try to submit empty form
    await submitButton.click()

    // Wait for validation errors
    await page.waitForTimeout(1000)

    // Check for error messages or styling
    const nameField = page.locator('input[name="name"]')
    const emailField = page.locator('input[name="email"]')
    const subjectField = page.locator('select[name="subject"]')
    const messageField = page.locator('textarea[name="message"]')

    // HTML5 validation or custom validation should prevent submission
    const isNameInvalid = await nameField.evaluate(el => !el.checkValidity())
    const isEmailInvalid = await emailField.evaluate(el => !el.checkValidity())
    const isSubjectInvalid = await subjectField.evaluate(el => !el.checkValidity())
    const isMessageInvalid = await messageField.evaluate(el => !el.checkValidity())

    expect(isNameInvalid || isEmailInvalid || isSubjectInvalid || isMessageInvalid).toBe(true)
  })

  test('should reject invalid email format', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'invalid-email-format')
    await page.selectOption('select[name="subject"]', { index: 1 })
    await page.fill('textarea[name="message"]', 'This is a test message with sufficient length for validation requirements.')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Wait for validation
    await page.waitForTimeout(1000)

    // Check that email field shows validation error
    const emailField = page.locator('input[name="email"]')
    const isEmailInvalid = await emailField.evaluate(el => !el.checkValidity())
    expect(isEmailInvalid).toBe(true)
  })

  test('should successfully submit valid form', async ({ page }) => {
    // Mock the API response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Thank you for your message! We will contact you within 4 working hours.'
        })
      })
    })

    // Fill out the form with valid data
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+31 20 123 4567')
    await page.fill('input[name="company"]', 'Test Company B.V.')
    await page.selectOption('select[name="subject"]', 'algemene-vraag')
    await page.fill('textarea[name="message"]', 'This is a comprehensive test message to validate the contact form functionality. I am interested in learning more about your IT services and would appreciate a consultation to discuss our company\'s specific needs.')

    // Submit the form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Wait for success message
    await expect(page.locator('text=/success|bedankt|thank you/i')).toBeVisible({ timeout: 10000 })
    
    // Or check for redirect to thank you page
    await page.waitForTimeout(2000)
    const currentUrl = page.url()
    const isSuccessPage = currentUrl.includes('/thank-you') || currentUrl.includes('/success')
    const hasSuccessMessage = await page.locator('text=/success|bedankt|thank you/i').isVisible()
    
    expect(isSuccessPage || hasSuccessMessage).toBe(true)
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal server error'
        })
      })
    })

    // Fill and submit form
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.selectOption('select[name="subject"]', 'technisch-probleem')
    await page.fill('textarea[name="message"]', 'This should trigger an error response from the mocked API.')

    await page.locator('button[type="submit"]').click()

    // Wait for error message
    await expect(page.locator('text=/error|fout|probleem/i')).toBeVisible({ timeout: 10000 })
  })

  test('should preserve form data during validation', async ({ page }) => {
    // Fill out partial form
    const name = 'John Doe'
    const email = 'john@example.com'
    const phone = '+31 20 123 4567'
    const company = 'Test Company'
    const message = 'Test message for validation preservation'

    await page.fill('input[name="name"]', name)
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="phone"]', phone)
    await page.fill('input[name="company"]', company)
    await page.fill('textarea[name="message"]', message)
    
    // Don't select subject (required field)
    // Try to submit
    await page.locator('button[type="submit"]').click()
    
    // Wait for validation
    await page.waitForTimeout(1000)

    // Check that all filled data is preserved
    await expect(page.locator('input[name="name"]')).toHaveValue(name)
    await expect(page.locator('input[name="email"]')).toHaveValue(email)
    await expect(page.locator('input[name="phone"]')).toHaveValue(phone)
    await expect(page.locator('input[name="company"]')).toHaveValue(company)
    await expect(page.locator('textarea[name="message"]')).toHaveValue(message)
  })

  test('should handle form submission with honeypot protection', async ({ page }) => {
    // Add honeypot field if present
    await page.evaluate(() => {
      const form = document.querySelector('form')
      if (form && !form.querySelector('input[name*="honeypot"], input[name*="website"]')) {
        const honeypot = document.createElement('input')
        honeypot.type = 'text'
        honeypot.name = 'website_url'
        honeypot.style.display = 'none'
        form.appendChild(honeypot)
      }
    })

    // Mock successful response
    await page.route('/api/contact', async route => {
      const postData = await route.request().postData()
      const data = JSON.parse(postData || '{}')
      
      // If honeypot is filled, should still return success (silent rejection)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      })
    })

    // Fill form including honeypot (simulating spam bot)
    await page.fill('input[name="name"]', 'Spam Bot')
    await page.fill('input[name="email"]', 'spam@bot.com')
    await page.selectOption('select[name="subject"]', 'algemene-vraag')
    await page.fill('textarea[name="message"]', 'This is spam content')
    
    // Fill honeypot field if it exists
    const honeypotField = page.locator('input[name*="honeypot"], input[name*="website"]')
    if (await honeypotField.count() > 0) {
      await honeypotField.fill('https://spam-website.com')
    }

    await page.locator('button[type="submit"]').click()
    
    // Should still show success to user (honeypot protection is silent)
    await page.waitForTimeout(3000)
    // The form should appear to submit successfully
  })

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()

    // Check form is still usable
    await expect(page.locator('form')).toBeVisible()
    
    // Fill form on mobile
    await page.fill('input[name="name"]', 'Mobile User')
    await page.fill('input[name="email"]', 'mobile@test.com')
    
    // Check select dropdown works on mobile
    await page.locator('select[name="subject"]').click()
    await page.selectOption('select[name="subject"]', 'it-support')
    
    await page.fill('textarea[name="message"]', 'Testing form submission on mobile device')

    // Check that submit button is accessible and clickable
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
    
    // Scroll to submit button if needed
    await submitButton.scrollIntoViewIfNeeded()
    
    // Check button is within viewport and clickable
    const buttonBox = await submitButton.boundingBox()
    expect(buttonBox?.x).toBeGreaterThan(0)
    expect(buttonBox?.x).toBeLessThan(375)
  })

  test('should handle network timeouts gracefully', async ({ page }) => {
    // Mock slow/timeout response
    await page.route('/api/contact', async route => {
      // Delay response to simulate timeout
      await new Promise(resolve => setTimeout(resolve, 30000))
      await route.fulfill({
        status: 408,
        body: 'Request timeout'
      })
    })

    // Fill and submit form
    await page.fill('input[name="name"]', 'Timeout Test')
    await page.fill('input[name="email"]', 'timeout@test.com')
    await page.selectOption('select[name="subject"]', 'technisch-probleem')
    await page.fill('textarea[name="message"]', 'Testing timeout handling')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Check that form shows loading state
    await expect(submitButton).toBeDisabled({ timeout: 1000 })
    
    // After timeout, should show error message
    await expect(page.locator('text=/timeout|time-out|time out/i')).toBeVisible({ timeout: 35000 })
  })

  test('should validate message length limits', async ({ page }) => {
    // Test minimum length
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.selectOption('select[name="subject"]', 'algemene-vraag')
    await page.fill('textarea[name="message"]', 'Short') // Too short

    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(1000)

    // Should show validation error for too short message
    const messageField = page.locator('textarea[name="message"]')
    const isInvalid = await messageField.evaluate(el => !el.checkValidity())
    expect(isInvalid).toBe(true)

    // Test maximum length
    const longMessage = 'A'.repeat(2001) // Assuming max length is 2000
    await page.fill('textarea[name="message"]', longMessage)
    
    // Check that input is truncated or validation prevents it
    const actualValue = await messageField.inputValue()
    expect(actualValue.length).toBeLessThanOrEqual(2000)
  })

  test('should have proper accessibility features', async ({ page }) => {
    // Check form has proper labels
    const nameInput = page.locator('input[name="name"]')
    const nameLabel = page.locator('label[for="name"], label:has(input[name="name"])')
    await expect(nameLabel).toBeVisible()

    // Check form has proper ARIA attributes
    const form = page.locator('form')
    
    // Check that required fields are marked
    const requiredFields = page.locator('input[required], select[required], textarea[required]')
    const requiredCount = await requiredFields.count()
    expect(requiredCount).toBeGreaterThan(0)

    // Check form can be navigated with keyboard
    await page.keyboard.press('Tab') // Should focus first field
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Tab through all form fields
    for (let i = 0; i < 7; i++) { // 6 fields + submit button
      await page.keyboard.press('Tab')
    }
    
    // Should end up on submit button
    const finalFocus = page.locator(':focus')
    await expect(finalFocus).toHaveAttribute('type', 'submit')
  })
})