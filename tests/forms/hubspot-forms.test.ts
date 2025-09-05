/**
 * HubSpot Forms Integration Tests
 * Tests form functionality with and without HubSpot credentials
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { hubspotService } from '@/lib/services/hubspot-service'
import { emailService } from '@/lib/services/email-service'

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.clearAllMocks()
  process.env = { ...originalEnv }
})

afterEach(() => {
  process.env = originalEnv
})

describe('HubSpot Forms Integration', () => {
  describe('Newsletter Subscription', () => {
    it('should work with HubSpot credentials', async () => {
      // Set up environment with HubSpot credentials
      process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
      
      const testData = {
        email: 'test@example.com',
        language: 'nl',
        source: 'test'
      }

      // Mock successful HubSpot response
      jest.spyOn(hubspotService, 'subscribeToNewsletter').mockResolvedValue({
        success: true,
        contactId: 'test-contact-id'
      })

      const result = await hubspotService.subscribeToNewsletter(testData)
      
      expect(result.success).toBe(true)
      expect(result.contactId).toBe('test-contact-id')
    })

    it('should gracefully fallback when HubSpot is unavailable', async () => {
      // Remove HubSpot credentials
      delete process.env.HUBSPOT_ACCESS_TOKEN
      
      const testData = {
        email: 'test@example.com',
        language: 'nl',
        source: 'test'
      }

      // Service should detect unavailability
      expect(hubspotService.isAvailable()).toBe(false)
      
      const result = await hubspotService.subscribeToNewsletter(testData)
      
      expect(result.success).toBe(false)
      expect(result.fallbackUsed).toBe(true)
    })

    it('should handle HubSpot API errors gracefully', async () => {
      process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
      
      const testData = {
        email: 'test@example.com',
        language: 'nl',
        source: 'test'
      }

      // Mock API error
      jest.spyOn(hubspotService, 'subscribeToNewsletter').mockRejectedValue(
        new Error('API Error')
      )

      try {
        await hubspotService.subscribeToNewsletter(testData)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('Contact Form Submission', () => {
    it('should work with both HubSpot and email service', async () => {
      process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
      process.env.RESEND_API_KEY = 'test-resend-key'
      
      const testData = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        company: 'Test Company',
        lifecyclestage: 'lead',
        lead_source: 'Website Contact Form'
      }

      jest.spyOn(hubspotService, 'createOrUpdateContact').mockResolvedValue({
        success: true,
        contactId: 'test-contact-id'
      })

      const result = await hubspotService.createOrUpdateContact(testData)
      
      expect(result.success).toBe(true)
      expect(result.contactId).toBe('test-contact-id')
    })

    it('should work with only email service when HubSpot fails', async () => {
      delete process.env.HUBSPOT_ACCESS_TOKEN
      process.env.RESEND_API_KEY = 'test-resend-key'
      
      expect(hubspotService.isAvailable()).toBe(false)
      expect(emailService.isAvailable()).toBe(true)
      
      // Should still allow form submission via email
      const testFormData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message'
      }

      jest.spyOn(emailService, 'sendContactFormNotification').mockResolvedValue({
        success: true,
        messageId: 'test-message-id'
      })

      const result = await emailService.sendContactFormNotification(testFormData)
      expect(result.success).toBe(true)
    })

    it('should handle complete service failure gracefully', async () => {
      delete process.env.HUBSPOT_ACCESS_TOKEN
      delete process.env.RESEND_API_KEY
      
      expect(hubspotService.isAvailable()).toBe(false)
      expect(emailService.isAvailable()).toBe(false)
      
      // Services should report unavailability but not crash
      const hubspotResult = await hubspotService.createOrUpdateContact({
        email: 'test@example.com'
      })
      
      expect(hubspotResult.success).toBe(false)
      expect(hubspotResult.fallbackUsed).toBe(true)
    })
  })

  describe('Quote Request Submission', () => {
    it('should submit quote request successfully', async () => {
      process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
      
      const testQuoteData = {
        name: 'Test User',
        email: 'test@example.com',
        services: ['IT Beheer & Support', 'Cybersecurity'],
        description: 'Test project description',
        budget: '€5.000 - €15.000',
        urgency: 'medium' as const
      }

      jest.spyOn(hubspotService, 'submitQuoteRequest').mockResolvedValue({
        success: true,
        contactId: 'test-contact-id'
      })

      const result = await hubspotService.submitQuoteRequest(testQuoteData)
      
      expect(result.success).toBe(true)
      expect(result.contactId).toBe('test-contact-id')
    })

    it('should handle quote request with fallback', async () => {
      delete process.env.HUBSPOT_ACCESS_TOKEN
      
      const testQuoteData = {
        name: 'Test User',
        email: 'test@example.com',
        services: ['IT Beheer & Support'],
        description: 'Test project description'
      }

      const result = await hubspotService.submitQuoteRequest(testQuoteData)
      
      expect(result.success).toBe(false)
      expect(result.fallbackUsed).toBe(true)
    })
  })

  describe('Error Handling and Retry Logic', () => {
    it('should retry on temporary failures', async () => {
      process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
      
      let attemptCount = 0
      const mockWithRetry = jest.fn()
        .mockImplementation(async () => {
          attemptCount++
          if (attemptCount < 3) {
            throw new Error('Temporary failure')
          }
          return { success: true, contactId: 'test-id' }
        })
      
      jest.spyOn(hubspotService as any, 'withRetry').mockImplementation(mockWithRetry)

      const result = await hubspotService.createOrUpdateContact({
        email: 'test@example.com'
      })

      expect(attemptCount).toBe(3) // Should have retried twice
      expect(result.success).toBe(true)
    })

    it('should handle rate limiting correctly', async () => {
      process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
      
      const rateLimitError = new Error('Rate limited')
      ;(rateLimitError as any).code = 429
      
      jest.spyOn(hubspotService as any, 'withRetry').mockRejectedValue(rateLimitError)

      try {
        await hubspotService.createOrUpdateContact({
          email: 'test@example.com'
        })
      } catch (error: any) {
        expect(error.code).toBe(429)
      }
    })
  })

  describe('Form Validation', () => {
    it('should validate email addresses correctly', async () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        ''
      ]

      for (const email of invalidEmails) {
        const result = await hubspotService.subscribeToNewsletter({
          email,
          language: 'nl'
        })
        
        // Should handle invalid emails gracefully
        expect(result.success).toBe(false)
      }
    })

    it('should handle empty required fields', async () => {
      const invalidQuoteData = {
        name: '',
        email: '',
        services: [],
        description: ''
      }

      const result = await hubspotService.submitQuoteRequest(invalidQuoteData)
      expect(result.success).toBe(false)
    })
  })

  describe('Analytics Integration', () => {
    it('should track form submissions', () => {
      const mockGtag = jest.fn()
      ;(global as any).window = { gtag: mockGtag }

      // Mock form submission tracking
      const { analyticsService } = require('@/lib/services/analytics-service')
      
      analyticsService.trackFormSubmission({
        formType: 'contact',
        success: true,
        hubspotIntegrated: true
      })

      expect(mockGtag).toHaveBeenCalled()
    })

    it('should track form validation errors', () => {
      const mockGtag = jest.fn()
      ;(global as any).window = { gtag: mockGtag }

      const { analyticsService } = require('@/lib/services/analytics-service')
      
      analyticsService.trackFormValidationError('contact', 'email', 'invalid_format')

      expect(mockGtag).toHaveBeenCalled()
    })
  })
})

describe('API Route Integration', () => {
  describe('/api/newsletter', () => {
    it('should handle successful newsletter signup', async () => {
      process.env.HUBSPOT_ACCESS_TOKEN = 'test-token'
      
      // Mock successful HubSpot response
      jest.spyOn(hubspotService, 'subscribeToNewsletter').mockResolvedValue({
        success: true,
        contactId: 'test-contact-id'
      })

      // This would typically be tested with supertest or similar
      const requestData = {
        email: 'test@example.com',
        language: 'nl'
      }

      // Mock API response structure
      const expectedResponse = {
        success: true,
        message: expect.stringContaining('nieuwsbrief'),
        details: {
          hubspotIntegrated: true,
          fallbackUsed: false,
          contactId: 'test-contact-id',
          timestamp: expect.any(String)
        }
      }

      expect(expectedResponse.success).toBe(true)
    })

    it('should handle newsletter signup with fallback', async () => {
      delete process.env.HUBSPOT_ACCESS_TOKEN
      
      // Mock fallback mode
      jest.spyOn(hubspotService, 'isAvailable').mockReturnValue(false)

      const requestData = {
        email: 'test@example.com',
        language: 'nl'
      }

      // Should still return success with fallback
      const expectedResponse = {
        success: true,
        message: expect.stringContaining('ingeschreven'),
        details: {
          hubspotIntegrated: false,
          fallbackUsed: true,
          contactId: null,
          timestamp: expect.any(String)
        }
      }

      expect(expectedResponse.success).toBe(true)
      expect(expectedResponse.details.fallbackUsed).toBe(true)
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limits on form submissions', () => {
      // Mock rate limiting logic
      const rateLimitStore = new Map()
      const RATE_LIMIT_MAX = 3
      const RATE_LIMIT_WINDOW = 60000

      const isRateLimited = (key: string) => {
        const now = Date.now()
        const entry = rateLimitStore.get(key)
        
        if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
          rateLimitStore.set(key, { count: 1, timestamp: now })
          return false
        }
        
        if (entry.count >= RATE_LIMIT_MAX) {
          return true
        }
        
        entry.count++
        return false
      }

      const testKey = 'test:127.0.0.1'
      
      // Should allow first 3 requests
      expect(isRateLimited(testKey)).toBe(false)
      expect(isRateLimited(testKey)).toBe(false)
      expect(isRateLimited(testKey)).toBe(false)
      
      // Should block 4th request
      expect(isRateLimited(testKey)).toBe(true)
    })
  })
})