/**
 * Zod validation schemas for all form inputs
 * Provides type-safe validation with detailed error messages
 */

import { z } from 'zod'

// Common validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[\+]?[0-9\s\-\(\)]{8,}$/
const NAME_REGEX = /^[a-zA-ZàáâäçéèêëíìîïñóòôöúùûüýÿñÀÁÂÄÇÉÈÊËÍÌÎÏÑÓÒÔÖÚÙÛÜÝŸ\s\-']+$/

// Disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'maildrop.cc',
  'getnada.com'
]

// Custom refinements
const emailRefinement = (email: string) => {
  const domain = email.split('@')[1]?.toLowerCase()
  return !domain || !DISPOSABLE_EMAIL_DOMAINS.includes(domain)
}

const phoneRefinement = (phone: string | undefined) => {
  if (!phone) return true
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.length >= 8 && digitsOnly.length <= 15
}

const nameRefinement = (name: string) => {
  const words = name.trim().split(/\s+/)
  return words.length >= 2 // Must have first and last name
}

// Base validation schemas
export const emailSchema = z
  .string()
  .trim()
  .min(1, 'E-mailadres is verplicht')
  .max(254, 'E-mailadres is te lang')
  .regex(EMAIL_REGEX, 'Voer een geldig e-mailadres in')
  .refine(emailRefinement, {
    message: 'Tijdelijke e-mailadressen zijn niet toegestaan'
  })

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Naam moet minimaal 2 karakters bevatten')
  .max(100, 'Naam mag maximaal 100 karakters bevatten')
  .regex(NAME_REGEX, 'Naam bevat ongeldige karakters')
  .refine(nameRefinement, {
    message: 'Voer je volledige naam in (voor- en achternaam)'
  })

export const phoneSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val || val.length === 0) return true
      return PHONE_REGEX.test(val)
    },
    { message: 'Voer een geldig telefoonnummer in' }
  )
  .refine(phoneRefinement, {
    message: 'Telefoonnummer moet tussen 8 en 15 cijfers bevatten'
  })

export const companySchema = z
  .string()
  .trim()
  .max(100, 'Bedrijfsnaam mag maximaal 100 karakters bevatten')
  .optional()

export const subjectSchema = z
  .string()
  .trim()
  .min(5, 'Onderwerp moet minimaal 5 karakters bevatten')
  .max(100, 'Onderwerp mag maximaal 100 karakters bevatten')

export const messageSchema = z
  .string()
  .trim()
  .min(10, 'Bericht moet minimaal 10 karakters bevatten')
  .max(2000, 'Bericht mag maximaal 2000 karakters bevatten')

export const descriptionSchema = z
  .string()
  .trim()
  .min(20, 'Beschrijving moet minimaal 20 karakters bevatten')
  .max(1500, 'Beschrijving mag maximaal 1500 karakters bevatten')

// Valid service options
export const VALID_SERVICES = [
  'IT Beheer & Support',
  'Microsoft 365',
  'Cybersecurity',
  'Cloud Migratie',
  'IT Consultancy',
  'Backup & Herstel',
  'Hardware & Software',
  'Compliance & AVG',
  'Anders'
] as const

export const servicesSchema = z
  .array(z.enum(VALID_SERVICES))
  .min(1, 'Selecteer minimaal één dienst')
  .max(5, 'Selecteer maximaal 5 diensten')

// Valid budget options
export const VALID_BUDGETS = [
  '< €5.000',
  '€5.000 - €15.000',
  '€15.000 - €50.000',
  '> €50.000',
  'Nog niet bepaald'
] as const

export const budgetSchema = z.enum(VALID_BUDGETS).optional()

// Valid timeline options
export const VALID_TIMELINES = [
  'Direct',
  '1-3 maanden',
  '3-6 maanden',
  '6+ maanden',
  'Nog niet bepaald'
] as const

export const timelineSchema = z.enum(VALID_TIMELINES).optional()

// Urgency levels
export const urgencySchema = z.enum(['low', 'medium', 'high']).default('medium')

// Language codes
export const languageSchema = z.enum(['nl', 'en']).default('nl')

// Honeypot field (should always be empty)
export const honeypotSchema = z
  .string()
  .max(0, 'Invalid submission')
  .optional()
  .or(z.literal(''))

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: companySchema,
  subject: subjectSchema,
  message: messageSchema,
  services: z.array(z.string()).optional(),
  honeypot: honeypotSchema
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/**
 * Quote Request Schema
 */
export const quoteRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: companySchema,
  services: servicesSchema,
  budget: budgetSchema,
  timeline: timelineSchema,
  description: descriptionSchema,
  urgency: urgencySchema,
  honeypot: honeypotSchema
})

export type QuoteRequestData = z.infer<typeof quoteRequestSchema>

/**
 * Newsletter Subscription Schema
 */
export const newsletterSchema = z.object({
  email: emailSchema,
  language: languageSchema,
  source: z.string().max(100).optional().default('Website Newsletter')
})

export type NewsletterData = z.infer<typeof newsletterSchema>

/**
 * Referral Form Schema
 */
export const referralFormSchema = z.object({
  // Referrer information
  referrerName: nameSchema,
  referrerEmail: emailSchema,
  referrerPhone: phoneSchema,
  referrerCompany: companySchema,

  // Referred company information
  referredName: nameSchema,
  referredEmail: emailSchema,
  referredPhone: phoneSchema,
  referredCompany: z.string().trim().min(2, 'Bedrijfsnaam is verplicht').max(100),

  // Additional information
  relationship: z
    .string()
    .trim()
    .max(200, 'Relatie beschrijving mag maximaal 200 karakters bevatten')
    .optional(),
  message: z
    .string()
    .trim()
    .max(500, 'Bericht mag maximaal 500 karakters bevatten')
    .optional(),

  honeypot: honeypotSchema
})

export type ReferralFormData = z.infer<typeof referralFormSchema>

/**
 * Pricing Calculator Schema
 */
export const pricingCalculatorSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: companySchema,

  // Pricing selections
  userCount: z.number().int().min(1, 'Minimaal 1 gebruiker').max(10000, 'Maximaal 10.000 gebruikers'),
  selectedPackage: z.enum(['essential', 'professional', 'enterprise']),
  selectedAddons: z.array(z.string()).optional(),

  // Calculated pricing
  monthlyPrice: z.number().min(0),
  yearlyPrice: z.number().min(0),
  setupFee: z.number().min(0),

  // Additional notes
  message: z.string().trim().max(1000).optional(),

  honeypot: honeypotSchema
})

export type PricingCalculatorData = z.infer<typeof pricingCalculatorSchema>

/**
 * Generic API Response Schemas
 */
export const apiSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.any().optional(),
  details: z.record(z.any()).optional()
})

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.any()).optional(),
  retryAfter: z.number().optional()
})

export type ApiSuccessResponse = z.infer<typeof apiSuccessResponseSchema>
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>

/**
 * Validation helper functions
 */

/**
 * Validate data against a schema and return formatted errors
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    errors[path] = issue.message
  }

  return { success: false, errors }
}

/**
 * Sanitize form input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Format phone number to E.164 or local format
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('31')) {
    // Dutch international format: +31 6 1234 5678
    return `+31 ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  } else if (cleaned.startsWith('0')) {
    // Dutch national format: 06-1234 5678
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }

  return phone
}

/**
 * Extract first and last name from full name
 */
export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  }
}

/**
 * Check if email is from a disposable domain
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return !!domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)
}

/**
 * Generate validation error response
 */
export function validationError(errors: Record<string, string>): ApiErrorResponse {
  return {
    success: false,
    error: 'Validatie mislukt. Controleer de ingevoerde gegevens.',
    code: 'VALIDATION_ERROR',
    details: errors
  }
}
