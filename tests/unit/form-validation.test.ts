/**
 * Comprehensive Unit Tests for Form Validation Utilities
 * Tests all validation rules, edge cases, and utility functions
 */

import {
  FormValidator,
  CommonValidationRules,
  ContactFormValidator,
  QuoteFormValidator,
  NewsletterFormValidator,
  FormUtils,
  ValidationResult,
  FormValidationRules
} from '@/lib/utils/form-validation'

describe('FormValidator Class', () => {
  describe('Basic Validation', () => {
    const rules: FormValidationRules = {
      name: { required: true, minLength: 2, maxLength: 50 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { pattern: /^[\+]?[0-9\s\-\(\)]{8,}$/ }
    }
    
    const validator = new FormValidator(rules)

    test('should validate all required fields', () => {
      const result = validator.validate({
        name: '',
        email: '',
        phone: ''
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toContain('verplicht')
      expect(result.errors.email).toContain('verplicht')
      expect(result.errors.phone).toBeUndefined() // not required
    })

    test('should validate minimum length requirements', () => {
      const result = validator.validate({
        name: 'A',
        email: 'valid@email.com',
        phone: '123456789'
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toContain('minimaal 2')
    })

    test('should validate maximum length requirements', () => {
      const result = validator.validate({
        name: 'A'.repeat(51),
        email: 'valid@email.com',
        phone: '123456789'
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toContain('maximaal 50')
    })

    test('should validate pattern requirements', () => {
      const result = validator.validate({
        name: 'Valid Name',
        email: 'invalid-email',
        phone: 'abc123'
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toContain('ongeldig formaat')
      expect(result.errors.phone).toContain('ongeldig formaat')
    })

    test('should pass valid data', () => {
      const result = validator.validate({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+31 20 123 4567'
      })
      
      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })
  })

  describe('Custom Validation', () => {
    test('should execute custom validation functions', () => {
      const rules: FormValidationRules = {
        password: {
          required: true,
          custom: (value: string) => {
            if (value.length < 8) return 'Wachtwoord moet minimaal 8 karakters zijn'
            if (!/[A-Z]/.test(value)) return 'Wachtwoord moet een hoofdletter bevatten'
            if (!/[0-9]/.test(value)) return 'Wachtwoord moet een cijfer bevatten'
            return null
          }
        }
      }
      
      const validator = new FormValidator(rules)
      
      const weakPassword = validator.validate({ password: 'weak' })
      expect(weakPassword.isValid).toBe(false)
      expect(weakPassword.errors.password).toContain('minimaal 8')
      
      const noUpperCase = validator.validate({ password: 'password123' })
      expect(noUpperCase.isValid).toBe(false)
      expect(noUpperCase.errors.password).toContain('hoofdletter')
      
      const noNumber = validator.validate({ password: 'Password' })
      expect(noNumber.isValid).toBe(false)
      expect(noNumber.errors.password).toContain('cijfer')
      
      const validPassword = validator.validate({ password: 'Password123' })
      expect(validPassword.isValid).toBe(true)
    })
  })

  describe('Custom Error Messages', () => {
    test('should use custom error messages when provided', () => {
      const rules: FormValidationRules = {
        username: { required: true, minLength: 3 }
      }
      
      const customMessages = {
        username: {
          required: 'Gebruikersnaam is verplicht!',
          minLength: 'Gebruikersnaam te kort!'
        }
      }
      
      const validator = new FormValidator(rules, customMessages)
      
      const result = validator.validate({ username: '' })
      expect(result.errors.username).toBe('Gebruikersnaam is verplicht!')
      
      const result2 = validator.validate({ username: 'ab' })
      expect(result2.errors.username).toBe('Gebruikersnaam te kort!')
    })
  })

  describe('Warnings System', () => {
    test('should generate warnings for disposable email domains', () => {
      const rules: FormValidationRules = {
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
      }
      
      const validator = new FormValidator(rules)
      
      const result = validator.validate({
        email: 'test@10minutemail.com'
      })
      
      expect(result.isValid).toBe(true)
      expect(result.warnings?.email).toContain('Tijdelijke e-mailadressen')
    })
  })
})

describe('Common Validation Rules', () => {
  describe('Email Validation', () => {
    const emailValidator = new FormValidator({ email: CommonValidationRules.email })

    test('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'firstname+lastname@subdomain.example.org',
        'test123@test-domain.com',
        'user@xn--domain-123.com'
      ]
      
      validEmails.forEach(email => {
        const result = emailValidator.validate({ email })
        expect(result.isValid).toBe(true)
      })
    })

    test('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user..name@domain.com',
        'user @domain.com',
        'user@domain .com'
      ]
      
      invalidEmails.forEach(email => {
        const result = emailValidator.validate({ email })
        expect(result.isValid).toBe(false)
      })
    })

    test('should reject emails that are too long', () => {
      const longEmail = 'a'.repeat(250) + '@domain.com'
      const result = emailValidator.validate({ email: longEmail })
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toContain('te lang')
    })
  })

  describe('Name Validation', () => {
    const nameValidator = new FormValidator({ name: CommonValidationRules.name })

    test('should accept valid names', () => {
      const validNames = [
        'John Doe',
        'María José García',
        'Jean-Claude Van Damme',
        "O'Connor",
        'José María Ñoño',
        'François Müller'
      ]
      
      validNames.forEach(name => {
        const result = nameValidator.validate({ name })
        expect(result.isValid).toBe(true)
      })
    })

    test('should require first and last name', () => {
      const result = nameValidator.validate({ name: 'John' })
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toContain('voor- en achternaam')
    })

    test('should reject names with invalid characters', () => {
      const invalidNames = [
        'John123',
        'John@Doe',
        'John<script>',
        'John & Jane'
      ]
      
      invalidNames.forEach(name => {
        const result = nameValidator.validate({ name })
        expect(result.isValid).toBe(false)
      })
    })
  })

  describe('Phone Validation', () => {
    const phoneValidator = new FormValidator({ phone: CommonValidationRules.phone })

    test('should accept valid phone formats', () => {
      const validPhones = [
        '+31 20 123 4567',
        '020-1234567',
        '(020) 123-4567',
        '+1 555-123-4567',
        '0123456789'
      ]
      
      validPhones.forEach(phone => {
        const result = phoneValidator.validate({ phone })
        expect(result.isValid).toBe(true)
      })
    })

    test('should reject phones with insufficient digits', () => {
      const result = phoneValidator.validate({ phone: '1234567' })
      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toContain('minimaal 8 cijfers')
    })

    test('should reject phones with too many digits', () => {
      const result = phoneValidator.validate({ phone: '1234567890123456' })
      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toContain('maximaal 15 cijfers')
    })
  })
})

describe('Form-Specific Validators', () => {
  describe('Contact Form Validator', () => {
    test('should validate complete contact form', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+31 20 123 4567',
        company: 'Test Company',
        subject: 'General Inquiry',
        message: 'This is a test message with sufficient length for validation'
      }
      
      const result = ContactFormValidator.validate(validData)
      expect(result.isValid).toBe(true)
    })

    test('should use custom error messages', () => {
      const result = ContactFormValidator.validate({
        name: 'John Doe',
        email: 'john@example.com',
        subject: '',
        message: ''
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.subject).toBe('Geef aan waar je bericht over gaat.')
      expect(result.errors.message).toBe('Vertel ons waar we je mee kunnen helpen.')
    })
  })

  describe('Quote Form Validator', () => {
    test('should validate services selection', () => {
      const result = QuoteFormValidator.validate({
        name: 'John Doe',
        email: 'john@example.com',
        description: 'This is a detailed project description with sufficient length',
        services: '["managed-it", "cybersecurity"]'
      })
      
      expect(result.isValid).toBe(true)
    })

    test('should reject empty services', () => {
      const result = QuoteFormValidator.validate({
        name: 'John Doe',
        email: 'john@example.com',
        description: 'This is a detailed project description',
        services: '[]'
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.services).toContain('minimaal één dienst')
    })

    test('should reject too many services', () => {
      const result = QuoteFormValidator.validate({
        name: 'John Doe',
        email: 'john@example.com',
        description: 'This is a detailed project description',
        services: '["s1", "s2", "s3", "s4", "s5", "s6"]'
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.services).toContain('maximaal 5 diensten')
    })
  })

  describe('Newsletter Form Validator', () => {
    test('should validate newsletter signup', () => {
      const result = NewsletterFormValidator.validate({
        email: 'newsletter@example.com'
      })
      
      expect(result.isValid).toBe(true)
    })

    test('should use custom newsletter error messages', () => {
      const result = NewsletterFormValidator.validate({
        email: ''
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Voer je e-mailadres in om je aan te melden.')
    })
  })
})

describe('Form Utilities', () => {
  describe('Input Sanitization', () => {
    test('should trim whitespace and normalize spaces', () => {
      expect(FormUtils.sanitizeInput('  hello   world  ')).toBe('hello world')
      expect(FormUtils.sanitizeInput('hello\n\nworld')).toBe('hello world')
    })

    test('should remove potential HTML tags', () => {
      expect(FormUtils.sanitizeInput('hello<script>alert("xss")</script>world'))
        .toBe('helloscript>alert("xss")/script>world')
      expect(FormUtils.sanitizeInput('hello<>world')).toBe('helloworld')
    })
  })

  describe('Phone Number Formatting', () => {
    test('should format Dutch international numbers', () => {
      expect(FormUtils.formatPhoneNumber('31201234567'))
        .toBe('+31 2 0123 4567')
    })

    test('should format Dutch national numbers', () => {
      expect(FormUtils.formatPhoneNumber('0201234567'))
        .toBe('020-123 4567')
    })

    test('should return original for unclear formats', () => {
      expect(FormUtils.formatPhoneNumber('+1 555-123-4567'))
        .toBe('+1 555-123-4567')
    })
  })

  describe('Name Splitting', () => {
    test('should split simple names', () => {
      const result = FormUtils.splitName('John Doe')
      expect(result.firstName).toBe('John')
      expect(result.lastName).toBe('Doe')
    })

    test('should handle compound last names', () => {
      const result = FormUtils.splitName('Jean-Claude Van Damme')
      expect(result.firstName).toBe('Jean-Claude')
      expect(result.lastName).toBe('Van Damme')
    })

    test('should handle single names', () => {
      const result = FormUtils.splitName('Madonna')
      expect(result.firstName).toBe('Madonna')
      expect(result.lastName).toBe('')
    })
  })

  describe('Honeypot Field Generation', () => {
    test('should generate valid honeypot field names', () => {
      const fieldName = FormUtils.getHoneypotFieldName()
      expect(['website_url', 'website_phone', 'website_name']).toContain(fieldName)
    })

    test('should vary field names based on time', () => {
      // Mock different hours
      const originalDate = Date
      
      global.Date = jest.fn(() => ({ getHours: () => 0 })) as any
      expect(FormUtils.getHoneypotFieldName()).toBe('website_url')
      
      global.Date = jest.fn(() => ({ getHours: () => 1 })) as any
      expect(FormUtils.getHoneypotFieldName()).toBe('website_phone')
      
      global.Date = jest.fn(() => ({ getHours: () => 2 })) as any
      expect(FormUtils.getHoneypotFieldName()).toBe('website_name')
      
      global.Date = originalDate
    })
  })
})

describe('Edge Cases and Error Handling', () => {
  test('should handle null and undefined values gracefully', () => {
    const validator = new FormValidator({
      field: { required: true }
    })
    
    const result1 = validator.validate({ field: null })
    const result2 = validator.validate({ field: undefined })
    const result3 = validator.validate({})
    
    expect(result1.isValid).toBe(false)
    expect(result2.isValid).toBe(false)
    expect(result3.isValid).toBe(false)
  })

  test('should handle non-string values', () => {
    const validator = new FormValidator({
      field: { required: true, minLength: 5 }
    })
    
    const result = validator.validate({ field: 12345 })
    expect(result.isValid).toBe(true) // Should convert to string
  })

  test('should handle malformed JSON in services validation', () => {
    const result = QuoteFormValidator.validate({
      name: 'John Doe',
      email: 'john@example.com',
      description: 'This is a detailed project description',
      services: 'invalid-json'
    })
    
    expect(result.isValid).toBe(false)
    expect(result.errors.services).toContain('minimaal één dienst')
  })

  test('should handle empty validation rules', () => {
    const validator = new FormValidator({})
    const result = validator.validate({ anyField: 'anyValue' })
    
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })
})

describe('Performance and Security', () => {
  test('should handle large input gracefully', () => {
    const validator = new FormValidator({
      field: { maxLength: 1000 }
    })
    
    const largeInput = 'a'.repeat(10000)
    const result = validator.validate({ field: largeInput })
    
    expect(result.isValid).toBe(false)
    expect(result.errors.field).toContain('maximaal 1000')
  })

  test('should prevent ReDoS attacks with email validation', () => {
    const maliciousEmail = 'a'.repeat(100000) + '@domain.com'
    
    const start = Date.now()
    const result = ContactFormValidator.validate({
      name: 'Test User',
      email: maliciousEmail,
      subject: 'Test',
      message: 'Test message'
    })
    const end = Date.now()
    
    // Should complete within reasonable time (< 1 second)
    expect(end - start).toBeLessThan(1000)
    expect(result.isValid).toBe(false)
  })

  test('should sanitize potentially dangerous input', () => {
    const dangerousInputs = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img onerror="alert(1)" src="x">',
      '"><script>alert("xss")</script>'
    ]
    
    dangerousInputs.forEach(input => {
      const sanitized = FormUtils.sanitizeInput(input)
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('<img')
    })
  })
})