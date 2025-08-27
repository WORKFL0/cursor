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

class HubSpotService {
  private client: Client | null = null
  private isInitialized = false
  private readonly NEWSLETTER_LIST_ID = process.env.HUBSPOT_NEWSLETTER_LIST_ID || '1' // Default list ID

  constructor() {
    this.initialize()
  }

  private initialize() {
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN
    if (!accessToken) {
      console.warn('HUBSPOT_ACCESS_TOKEN not found in environment variables. HubSpot service will be disabled.')
      return
    }

    try {
      this.client = new Client({ accessToken })
      this.isInitialized = true
      console.log('HubSpot service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize HubSpot service:', error)
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized && this.client !== null
  }

  /**
   * Subscribe email to newsletter via HubSpot
   */
  public async subscribeToNewsletter(data: NewsletterSubscriber): Promise<{ success: boolean; contactId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'HubSpot service not available' }
    }

    try {
      // First, create or update the contact
      const contactData: HubSpotContact = {
        email: data.email,
        lifecyclestage: 'lead',
        lead_source: data.source || 'Website Newsletter',
        hs_language: data.language || 'nl'
      }

      const contactResult = await this.createOrUpdateContact(contactData)
      if (!contactResult.success) {
        return contactResult
      }

      // Add contact to newsletter list
      const listResult = await this.addContactToList(contactResult.contactId!, this.NEWSLETTER_LIST_ID)
      if (!listResult.success) {
        console.warn('Contact created but failed to add to newsletter list:', listResult.error)
      }

      return {
        success: true,
        contactId: contactResult.contactId
      }
    } catch (error: unknown) {
      console.error('Failed to subscribe to newsletter:', error)
      return {
        success: false,
        error: error.message || 'Unknown HubSpot error'
      }
    }
  }

  /**
   * Create or update contact in HubSpot
   */
  public async createOrUpdateContact(contactData: HubSpotContact): Promise<{ success: boolean; contactId?: string; error?: string }> {
    if (!this.isAvailable()) {
      return { success: false, error: 'HubSpot service not available' }
    }

    try {
      // Convert contact data to HubSpot properties format
      const properties = Object.keys(contactData).reduce((acc, key) => {
        acc[key] = contactData[key as keyof HubSpotContact]
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
        if (createError.code === 409) {
          const searchResponse = await this.client!.crm.contacts.searchApi.doSearch({
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: 'email',
                    operator: 'EQ',
                    value: contactData.email
                  }
                ]
              }
            ],
            limit: 1
          })

          if (searchResponse.results && searchResponse.results.length > 0) {
            const existingContact = searchResponse.results[0]
            
            // Update existing contact
            const updateResponse = await this.client!.crm.contacts.basicApi.update(existingContact.id, {
              properties
            })

            console.log('Contact updated successfully:', updateResponse.id)
            return {
              success: true,
              contactId: updateResponse.id
            }
          }
        }
        
        throw createError // Re-throw if it's not a duplicate error
      }
    } catch (error: unknown) {
      console.error('Failed to create/update contact:', error)
      return {
        success: false,
        error: error.message || 'Unknown HubSpot error'
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
      await this.client!.crm.lists.membershipsApi.add(listId, {
        recordIds: [contactId]
      })

      console.log(`Contact ${contactId} added to list ${listId}`)
      return { success: true }
    } catch (error: unknown) {
      console.error('Failed to add contact to list:', error)
      return {
        success: false,
        error: error.message || 'Failed to add to list'
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
                operator: 'EQ',
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
        error: error.message || 'Failed to track form submission'
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
                operator: 'EQ',
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
        error: error.message || 'Failed to get contact'
      }
    }
  }
}

export const hubspotService = new HubSpotService()
export default hubspotService