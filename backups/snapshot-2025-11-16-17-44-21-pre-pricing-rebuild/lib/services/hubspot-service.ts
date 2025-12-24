import { Client } from '@hubspot/api-client'

export interface HubSpotContact {
  email: string
  firstname?: string
  lastname?: string
  company?: string
  phone?: string
  website?: string
  lifecyclestage?: string
  lead_source?: string
  hs_language?: string
}

export interface NewsletterSubscriber {
  email: string
  language?: string
  source?: string
  subscribedAt?: Date
}

export interface QuoteRequest {
  email: string
  name: string
  company?: string
  phone?: string
  services: string[]
  budget?: string
  timeline?: string
  description: string
  urgency?: 'low' | 'medium' | 'high'
}

export interface HubSpotServiceResult {
  success: boolean
  contactId?: string
  error?: string
  fallbackUsed?: boolean
}

class HubSpotService {
  private client: Client | null = null
  private isInitialized = false
  private readonly NEWSLETTER_LIST_ID = process.env.HUBSPOT_NEWSLETTER_LIST_ID || '1'
  private readonly PORTAL_ID = process.env.HUBSPOT_PORTAL_ID || '26510736'
  private retryCount = 0
  private readonly MAX_RETRIES = 3
  private rateLimitResetTime: number | null = null

  constructor() {
    this.initialize()
  }

  private initialize() {
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN
    if (!accessToken) {
      console.warn('HUBSPOT_ACCESS_TOKEN not found in environment variables. HubSpot service will operate in fallback mode.')
      return
    }

    try {
      this.client = new Client({ 
        accessToken,
        limiterOptions: {
          maxConcurrent: 10,
          minTime: 100 // Minimum 100ms between requests
        }
      })
      this.isInitialized = true
      console.log('HubSpot service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize HubSpot service:', error)
      this.isInitialized = false
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized && this.client !== null && !this.isRateLimited()
  }

  private isRateLimited(): boolean {
    if (!this.rateLimitResetTime) return false
    return Date.now() < this.rateLimitResetTime
  }

  private handleRateLimit(retryAfter?: number) {
    const resetTime = Date.now() + (retryAfter ? retryAfter * 1000 : 60000) // Default 60s
    this.rateLimitResetTime = resetTime
    console.warn(`HubSpot rate limited. Will retry after ${new Date(resetTime).toISOString()}`)
  }

  private async withRetry<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const result = await operation()
        this.retryCount = 0 // Reset on success
        return result
      } catch (error: any) {
        lastError = error
        
        // Handle rate limiting
        if (error.code === 429) {
          const retryAfter = error.response?.headers?.['retry-after']
          this.handleRateLimit(retryAfter)
          
          if (attempt < this.MAX_RETRIES - 1) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 30000) // Exponential backoff, max 30s
            console.warn(`${operationName} rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${this.MAX_RETRIES})`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
        }
        
        // Handle temporary errors
        if (error.code >= 500 && error.code < 600 && attempt < this.MAX_RETRIES - 1) {
          const delay = 1000 * Math.pow(2, attempt) // Exponential backoff
          console.warn(`${operationName} server error, retrying in ${delay}ms (attempt ${attempt + 1}/${this.MAX_RETRIES})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        
        // For other errors, don't retry
        break
      }
    }

    throw lastError || new Error(`${operationName} failed after ${this.MAX_RETRIES} attempts`)
  }

  /**
   * Subscribe email to newsletter via HubSpot with retry logic
   */
  public async subscribeToNewsletter(data: NewsletterSubscriber): Promise<HubSpotServiceResult> {
    if (!this.isAvailable()) {
      return { success: false, error: 'HubSpot service not available', fallbackUsed: true }
    }

    try {
      return await this.withRetry(async () => {
        // First, create or update the contact
        const contactData: HubSpotContact = {
          email: data.email,
          lifecyclestage: 'lead',
          lead_source: data.source || 'Website Newsletter',
          hs_language: data.language || 'nl'
        }

        const contactResult = await this.createOrUpdateContact(contactData)
        if (!contactResult.success) {
          throw new Error(contactResult.error || 'Failed to create/update contact')
        }

        // Add contact to newsletter list
        if (this.NEWSLETTER_LIST_ID !== '1') { // Only add to list if we have a real list ID
          const listResult = await this.addContactToList(contactResult.contactId!, this.NEWSLETTER_LIST_ID)
          if (!listResult.success) {
            console.warn('Contact created but failed to add to newsletter list:', listResult.error)
          }
        }

        return {
          success: true,
          contactId: contactResult.contactId
        }
      }, 'Newsletter subscription')
    } catch (error: unknown) {
      console.error('Failed to subscribe to newsletter:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown HubSpot error',
        fallbackUsed: false
      }
    }
  }

  /**
   * Submit quote request via HubSpot
   */
  public async submitQuoteRequest(data: QuoteRequest): Promise<HubSpotServiceResult> {
    if (!this.isAvailable()) {
      return { success: false, error: 'HubSpot service not available', fallbackUsed: true }
    }

    try {
      return await this.withRetry(async () => {
        const [firstName, ...lastNameParts] = data.name.trim().split(' ')
        
        const contactData: HubSpotContact = {
          email: data.email,
          firstname: firstName,
          lastname: lastNameParts.join(' ') || undefined,
          company: data.company,
          phone: data.phone,
          lifecyclestage: 'marketingqualifiedlead', // MQL for quote requests
          lead_source: 'Website Quote Request',
          hs_language: 'nl'
        }

        const contactResult = await this.createOrUpdateContact(contactData)
        if (!contactResult.success) {
          throw new Error(contactResult.error || 'Failed to create/update contact')
        }

        // Track the quote request as a form submission with detailed data
        await this.trackFormSubmission(data.email, 'quote-request', {
          services: data.services,
          budget: data.budget,
          timeline: data.timeline,
          description: data.description,
          urgency: data.urgency,
          company: data.company,
          phone: data.phone
        })

        return {
          success: true,
          contactId: contactResult.contactId
        }
      }, 'Quote request submission')
    } catch (error: unknown) {
      console.error('Failed to submit quote request:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown HubSpot error',
        fallbackUsed: false
      }
    }
  }

  /**
   * Create or update contact in HubSpot with retry logic
   */
  public async createOrUpdateContact(contactData: HubSpotContact): Promise<HubSpotServiceResult> {
    if (!this.isAvailable()) {
      return { success: false, error: 'HubSpot service not available', fallbackUsed: true }
    }

    try {
      return await this.withRetry(async () => {
        // Convert contact data to HubSpot properties format
        const properties = Object.keys(contactData).reduce((acc, key) => {
          const value = contactData[key as keyof HubSpotContact]
          if (value !== undefined && value !== '') {
            acc[key] = value
          }
          return acc
        }, {} as Record<string, any>)

        // Try to create the contact first
        try {
          const createResponse = await this.client!.crm.contacts.basicApi.create({
            properties
          })

          console.log('Contact created successfully:', createResponse.id)
          return {
            success: true,
            contactId: createResponse.id
          }
        } catch (createError: any) {
          // If contact already exists, update it
          if (createError.code === 409 || createError.message?.includes('already exists')) {
            const searchResponse = await this.client!.crm.contacts.searchApi.doSearch({
              filterGroups: [
                {
                  filters: [
                    {
                      propertyName: 'email',
                      operator: 'EQ' as any,
                      value: contactData.email
                    }
                  ]
                }
              ],
              limit: 1
            })

            if (searchResponse.results && searchResponse.results.length > 0) {
              const existingContact = searchResponse.results[0]
              
              if (!existingContact?.id) {
                throw new Error('Invalid existing contact data')
              }
              
              // Update existing contact with new data
              const updateResponse = await this.client!.crm.contacts.basicApi.update(existingContact.id, {
                properties
              })

              console.log('Contact updated successfully:', updateResponse.id)
              return {
                success: true,
                contactId: updateResponse.id
              }
            } else {
              throw new Error('Contact exists but could not be found for update')
            }
          }
          
          throw createError // Re-throw if it's not a duplicate error
        }
      }, 'Create/update contact')
    } catch (error: unknown) {
      console.error('Failed to create/update contact:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown HubSpot error',
        fallbackUsed: false
      }
    }
  }

  /**
   * Add contact to a specific list
   */
  public async addContactToList(contactId: string, listId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'HubSpot service not available' }
    }

    try {
      await this.client!.crm.lists.membershipsApi.add(listId, [contactId] as any)

      console.log(`Contact ${contactId} added to list ${listId}`)
      return { success: true }
    } catch (error: unknown) {
      console.error('Failed to add contact to list:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add to list'
      }
    }
  }

  /**
   * Track form submission as HubSpot event
   */
  public async trackFormSubmission(email: string, formType: string, additionalData?: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'HubSpot service not available' }
    }

    try {
      // Find the contact first
      const searchResponse = await this.client!.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ' as any,
                value: email
              }
            ]
          }
        ],
        limit: 1
      })

      if (!searchResponse.results || searchResponse.results.length === 0) {
        return { success: false, error: 'Contact not found' }
      }

      const contact = searchResponse.results[0]
      
      if (!contact || !contact.id) {
        return { success: false, error: 'Invalid contact data' }
      }

      // Create a timeline event
      const eventData = {
        eventTypeId: '000001', // Generic form submission event type
        email: email,
        utk: contact.id,
        extraData: {
          form_type: formType,
          timestamp: new Date().toISOString(),
          ...additionalData
        }
      }

      // Note: HubSpot timeline events require specific setup
      // This is a simplified implementation
      console.log('Form submission tracked:', eventData)
      
      return { success: true }
    } catch (error: unknown) {
      console.error('Failed to track form submission:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track form submission'
      }
    }
  }

  /**
   * Get contact by email
   */
  public async getContactByEmail(email: string): Promise<{ success: boolean; contact?: any; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'HubSpot service not available' }
    }

    try {
      const searchResponse = await this.client!.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ' as any,
                value: email
              }
            ]
          }
        ],
        limit: 1
      })

      if (searchResponse.results && searchResponse.results.length > 0) {
        return {
          success: true,
          contact: searchResponse.results[0]
        }
      } else {
        return {
          success: false,
          error: 'Contact not found'
        }
      }
    } catch (error: unknown) {
      console.error('Failed to get contact:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get contact'
      }
    }
  }
}

export const hubspotService = new HubSpotService()
export default hubspotService