/**
 * Form validation utilities with comprehensive error handling
 */

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  warnings?: Record<string, string>
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface FormValidationRules {
  [fieldName: string]: ValidationRule
}

export class FormValidator {
  private rules: FormValidationRules
  private customMessages: Record<string, Record<string, string>>

  constructor(rules: FormValidationRules, customMessages?: Record<string, Record<string, string>>) {
    this.rules = rules
    this.customMessages = customMessages || {}
  }

  /**
   * Validate form data against defined rules
   */
  validate(data: Record<string, any>): ValidationResult {
    const errors: Record<string, string> = {}
    const warnings: Record<string, string> = {}

    for (const [fieldName, rule] of Object.entries(this.rules)) {
      const value = data[fieldName]
      const fieldError = this.validateField(fieldName, value, rule)
      
      if (fieldError) {
        errors[fieldName] = fieldError
      }

      // Check for warnings (non-blocking validation issues)
      const warning = this.checkFieldWarning(fieldName, value, rule)
      if (warning) {
        warnings[fieldName] = warning
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings: Object.keys(warnings).length > 0 ? warnings : undefined
    }
  }

  /**
   * Validate a single field
   */
  private validateField(fieldName: string, value: any, rule: ValidationRule): string | null {
    const stringValue = String(value || '').trim()

    // Required validation
    if (rule.required && !stringValue) {
      return this.getErrorMessage(fieldName, 'required') || `${this.formatFieldName(fieldName)} is verplicht.`
    }

    // Skip other validations if field is empty and not required
    if (!stringValue && !rule.required) {
      return null
    }

    // Min length validation
    if (rule.minLength && stringValue.length < rule.minLength) {
      return this.getErrorMessage(fieldName, 'minLength') || 
        `${this.formatFieldName(fieldName)} moet minimaal ${rule.minLength} karakters bevatten.`
    }

    // Max length validation
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return this.getErrorMessage(fieldName, 'maxLength') || 
        `${this.formatFieldName(fieldName)} mag maximaal ${rule.maxLength} karakters bevatten.`
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return this.getErrorMessage(fieldName, 'pattern') || 
        `${this.formatFieldName(fieldName)} heeft een ongeldig formaat.`
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(stringValue)
      if (customError) {
        return customError
      }
    }

    return null
  }

  /**
   * Check for field warnings
   */
  private checkFieldWarning(fieldName: string, value: any, rule: ValidationRule): string | null {
    const stringValue = String(value || '').trim()

    // Email domain warnings
    if (fieldName === 'email' && stringValue) {
      const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com']
      const domain = stringValue.split('@')[1]?.toLowerCase()
      if (domain && disposableDomains.includes(domain)) {
        return 'Tijdelijke e-mailadressen worden afgeraden voor belangrijke communicatie.'
      }
    }

    return null
  }

  /**
   * Get custom error message for field and validation type
   */
  private getErrorMessage(fieldName: string, validationType: string): string | null {
    return this.customMessages[fieldName]?.[validationType] || null
  }

  /**
   * Format field name for display
   */
  private formatFieldName(fieldName: string): string {
    const fieldNameMap: Record<string, string> = {
      name: 'Naam',
      email: 'E-mailadres',
      phone: 'Telefoonnummer',
      company: 'Bedrijf',
      subject: 'Onderwerp',
      message: 'Bericht',
      description: 'Beschrijving',
      services: 'Diensten',
      budget: 'Budget',
      timeline: 'Timeline'
    }
    return fieldNameMap[fieldName] || fieldName
  }
}

/**
 * Common validation rules
 */
export const CommonValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value) return null
      
      // Check for basic email format
      if (!value.includes('@') || !value.includes('.')) {
        return 'Voer een geldig e-mailadres in.'
      }
      
      // Check for suspicious patterns
      if (value.length > 254) {
        return 'E-mailadres is te lang.'
      }
      
      return null
    }
  },
  
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZàáâäçéèêëíìîïñóòôöúùûüýÿñÀÁÂÄÇÉÈÊËÍÌÎÏÑÓÒÔÖÚÙÛÜÝŸ\s\-']+$/,
    custom: (value: string) => {
      if (value.length < 2) return null
      
      const words = value.trim().split(/\s+/)
      if (words.length < 2) {
        return 'Voer je voor- en achternaam in.'
      }
      
      return null
    }
  },
  
  phone: {
    pattern: /^[\+]?[0-9\s\-\(\)]{8,}$/,
    custom: (value: string) => {
      if (!value) return null
      
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length < 8) {
        return 'Telefoonnummer moet minimaal 8 cijfers bevatten.'
      }
      
      if (digitsOnly.length > 15) {
        return 'Telefoonnummer mag maximaal 15 cijfers bevatten.'
      }
      
      return null
    }
  },
  
  company: {
    maxLength: 100
  },
  
  subject: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000
  },
  
  description: {
    required: true,
    minLength: 20,
    maxLength: 1500
  }
}

/**
 * Form-specific validators
 */
export const ContactFormValidator = new FormValidator({
  name: CommonValidationRules.name,
  email: CommonValidationRules.email,
  phone: CommonValidationRules.phone,
  company: CommonValidationRules.company,
  subject: CommonValidationRules.subject,
  message: CommonValidationRules.message
}, {
  subject: {
    required: 'Geef aan waar je bericht over gaat.',
    minLength: 'Het onderwerp is te kort. Wees wat specifieker.'
  },
  message: {
    required: 'Vertel ons waar we je mee kunnen helpen.',
    minLength: 'Je bericht is te kort. Geef wat meer details.'
  }
})

export const QuoteFormValidator = new FormValidator({
  name: CommonValidationRules.name,
  email: CommonValidationRules.email,
  phone: CommonValidationRules.phone,
  company: CommonValidationRules.company,
  description: CommonValidationRules.description,
  services: {
    required: true,
    custom: (value: string) => {
      try {
        const services = JSON.parse(value)
        if (!Array.isArray(services) || services.length === 0) {
          return 'Selecteer minimaal één dienst.'
        }
        if (services.length > 5) {
          return 'Selecteer maximaal 5 diensten.'
        }
      } catch {
        return 'Selecteer minimaal één dienst.'
      }
      return null
    }
  }
}, {
  description: {
    required: 'Beschrijf je project of IT-vraagstuk.',
    minLength: 'Geef wat meer details over je project (minimaal 20 karakters).'
  },
  services: {
    required: 'Selecteer de diensten waar je belangstelling voor hebt.'
  }
})

export const NewsletterFormValidator = new FormValidator({
  email: CommonValidationRules.email
}, {
  email: {
    required: 'Voer je e-mailadres in om je aan te melden.',
    pattern: 'Controleer je e-mailadres, er lijkt een fout in te zitten.'
  }
})

/**
 * Utility functions for form handling
 */
export const FormUtils = {
  /**
   * Sanitize form input
   */
  sanitizeInput(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/[<>]/g, '') // Remove potential HTML tags
  },

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    
    if (cleaned.startsWith('31')) {
      // Dutch international format
      return `+31 ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
    } else if (cleaned.startsWith('0')) {
      // Dutch national format
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
    
    return phone // Return as-is if format is unclear
  },

  /**
   * Extract first and last name from full name
   */
  splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/)
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ')
    }
  },

  /**
   * Generate honeypot field name (changes based on current time to avoid caching)
   */
  getHoneypotFieldName(): string {
    const hour = new Date().getHours()
    return `website_${hour % 3 === 0 ? 'url' : hour % 3 === 1 ? 'phone' : 'name'}`
  }
}