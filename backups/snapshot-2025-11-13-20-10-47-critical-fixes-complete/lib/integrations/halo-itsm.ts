/**
 * Halo ITSM Integration Module
 * Provides integration with Halo ITSM for ticket management
 * Documentation: https://usehalo.com/nl/haloitsm/guides/2294/
 */

export interface HaloConfig {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  tenantId?: string;
  authMethod: 'oauth' | 'apikey';
}

export interface HaloTicket {
  id?: string;
  summary: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  category?: string;
  requesterName?: string;
  requesterEmail?: string;
  requesterPhone?: string;
  status?: 'new' | 'open' | 'pending' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  customFields?: Record<string, any>;
}

export interface HaloTicketResponse {
  ticketId: string;
  ticketNumber: string;
  status: string;
  createdAt: string;
  portalUrl?: string;
}

export interface HaloChatContext {
  sessionId: string;
  userId?: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  metadata?: {
    source: 'website' | 'chatbot' | 'email';
    page?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export class HaloITSMClient {
  private config: HaloConfig;
  private accessToken?: string;
  private tokenExpiry?: Date;
  private isMockMode: boolean = false;

  constructor(config: HaloConfig) {
    this.config = config;
    // Enable mock mode if credentials are not configured
    this.isMockMode = !config.clientId || !config.clientSecret || 
                      config.clientId === '' || config.clientSecret === '';
    
    if (this.isMockMode) {
      console.log('Halo ITSM running in mock mode - configure credentials in .env.local');
    }
  }

  /**
   * Authenticate with Halo ITSM
   */
  private async authenticate(): Promise<void> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return; // Token still valid
    }

    if (this.config.authMethod === 'oauth') {
      await this.authenticateOAuth();
    } else {
      // API key authentication is handled in headers
      this.accessToken = this.config.clientSecret;
    }
  }

  /**
   * OAuth authentication flow
   */
  private async authenticateOAuth(): Promise<void> {
    try {
      const authUrl = `${this.config.apiUrl}/auth/token`;
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          ...(this.config.tenantId && { tenant: this.config.tenantId }),
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      
      // Set token expiry (typically 1 hour)
      const expiresIn = data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
    } catch (error) {
      console.error('Halo ITSM authentication error:', error);
      throw new Error('Failed to authenticate with Halo ITSM');
    }
  }

  /**
   * Create headers for API requests
   */
  private async getHeaders(): Promise<HeadersInit> {
    await this.authenticate();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config.authMethod === 'oauth') {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    } else {
      headers['X-API-Key'] = this.accessToken || '';
    }

    return headers;
  }

  /**
   * Create a support ticket from chat conversation
   */
  async createTicketFromChat(
    context: HaloChatContext,
    issue: string,
    userInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
    }
  ): Promise<HaloTicketResponse> {
    // Mock mode for development
    if (this.isMockMode) {
      const mockTicketNumber = `MOCK-${Date.now().toString().slice(-6)}`;
      console.log('Mock ticket created:', {
        ticketNumber: mockTicketNumber,
        issue,
        userInfo,
        sessionId: context.sessionId
      });
      
      return {
        ticketId: mockTicketNumber,
        ticketNumber: mockTicketNumber,
        status: 'new',
        createdAt: new Date().toISOString(),
        portalUrl: `https://servicedesk.workflo.it/ticket/${mockTicketNumber}`,
      };
    }
    
    try {
      const headers = await this.getHeaders();
      
      // Build ticket description with conversation history
      const conversationText = context.conversationHistory
        .map(msg => `${msg.role === 'user' ? 'Klant' : 'WorkBot'}: ${msg.content}`)
        .join('\n\n');

      const ticket: HaloTicket = {
        summary: issue.substring(0, 100), // Limit summary length
        description: `
=== Automatisch gegenereerd via WorkBot Chatbot ===

PROBLEEM:
${issue}

GESPREK GESCHIEDENIS:
${conversationText}

SESSIE INFO:
- Sessie ID: ${context.sessionId}
- Bron: ${context.metadata?.source || 'chatbot'}
- Pagina: ${context.metadata?.page || 'Onbekend'}
- Tijd: ${new Date().toLocaleString('nl-NL')}
        `.trim(),
        priority: this.determinePriority(issue),
        category: 'Support Request',
        requesterName: userInfo?.name,
        requesterEmail: userInfo?.email,
        requesterPhone: userInfo?.phone,
        customFields: {
          source: 'chatbot',
          sessionId: context.sessionId,
          company: userInfo?.company,
        },
      };

      const url = `${this.config.apiUrl}/Tickets`;
      console.log('Creating Halo ticket at:', url);
      console.log('Ticket data:', JSON.stringify(ticket, null, 2));
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(ticket),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Halo API Error Response:', errorText);
        throw new Error(`Failed to create ticket: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      return {
        ticketId: data.id,
        ticketNumber: data.ticket_number || data.id,
        status: data.status || 'new',
        createdAt: data.created_at || new Date().toISOString(),
        portalUrl: data.portal_url,
      };
    } catch (error) {
      console.error('Error creating Halo ticket:', error);
      throw new Error('Failed to create support ticket');
    }
  }

  /**
   * Get ticket status
   */
  async getTicketStatus(ticketId: string): Promise<HaloTicket | null> {
    // Mock mode for development
    if (this.isMockMode) {
      if (ticketId.startsWith('MOCK-')) {
        return {
          id: ticketId,
          summary: 'Mock Ticket - Development Mode',
          description: 'This is a mock ticket for testing purposes',
          priority: 'normal',
          status: 'open',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return null;
    }
    
    try {
      const headers = await this.getHeaders();
      
      const response = await fetch(`${this.config.apiUrl}/api/tickets/${ticketId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to get ticket: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        summary: data.summary,
        description: data.description,
        priority: data.priority,
        status: data.status,
        assignedTo: data.assigned_to,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error getting ticket status:', error);
      throw new Error('Failed to get ticket status');
    }
  }

  /**
   * Update ticket with additional information
   */
  async updateTicket(
    ticketId: string,
    updates: Partial<HaloTicket>
  ): Promise<boolean> {
    try {
      const headers = await this.getHeaders();
      
      const response = await fetch(`${this.config.apiUrl}/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating ticket:', error);
      return false;
    }
  }

  /**
   * Add a note/comment to a ticket
   */
  async addTicketNote(
    ticketId: string,
    note: string,
    isPublic: boolean = true
  ): Promise<boolean> {
    try {
      const headers = await this.getHeaders();
      
      const response = await fetch(`${this.config.apiUrl}/api/tickets/${ticketId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: note,
          is_public: isPublic,
          created_by: 'WorkBot',
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error adding ticket note:', error);
      return false;
    }
  }

  /**
   * Search for existing tickets
   */
  async searchTickets(query: {
    email?: string;
    status?: string;
    createdAfter?: Date;
  }): Promise<HaloTicket[]> {
    try {
      const headers = await this.getHeaders();
      
      const params = new URLSearchParams();
      if (query.email) params.append('requester_email', query.email);
      if (query.status) params.append('status', query.status);
      if (query.createdAfter) {
        params.append('created_after', query.createdAfter.toISOString());
      }

      const response = await fetch(
        `${this.config.apiUrl}/api/tickets?${params.toString()}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search tickets: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.tickets || [];
    } catch (error) {
      console.error('Error searching tickets:', error);
      return [];
    }
  }

  /**
   * Determine ticket priority based on issue content
   */
  private determinePriority(issue: string): 'low' | 'normal' | 'high' | 'critical' {
    const lowerIssue = issue.toLowerCase();
    
    // Critical keywords
    if (
      lowerIssue.includes('down') ||
      lowerIssue.includes('niet bereikbaar') ||
      lowerIssue.includes('critical') ||
      lowerIssue.includes('urgent') ||
      lowerIssue.includes('storing') ||
      lowerIssue.includes('uitval')
    ) {
      return 'critical';
    }
    
    // High priority keywords
    if (
      lowerIssue.includes('error') ||
      lowerIssue.includes('fout') ||
      lowerIssue.includes('werkt niet') ||
      lowerIssue.includes('probleem') ||
      lowerIssue.includes('kapot')
    ) {
      return 'high';
    }
    
    // Low priority keywords
    if (
      lowerIssue.includes('vraag') ||
      lowerIssue.includes('informatie') ||
      lowerIssue.includes('hoe') ||
      lowerIssue.includes('wat')
    ) {
      return 'low';
    }
    
    return 'normal';
  }

  /**
   * Create a webhook endpoint for Halo updates
   */
  async registerWebhook(
    webhookUrl: string,
    events: string[] = ['ticket.created', 'ticket.updated', 'ticket.resolved']
  ): Promise<boolean> {
    try {
      const headers = await this.getHeaders();
      
      const response = await fetch(`${this.config.apiUrl}/api/webhooks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          url: webhookUrl,
          events,
          active: true,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error registering webhook:', error);
      return false;
    }
  }
}

// Singleton instance
let haloClient: HaloITSMClient | null = null;

/**
 * Initialize Halo ITSM client
 */
export function initializeHaloClient(config?: HaloConfig): HaloITSMClient {
  if (!haloClient) {
    const haloConfig = config || {
      apiUrl: process.env.HALO_API_URL || 'https://servicedesk.workflo.it',
      clientId: process.env.HALO_CLIENT_ID || '',
      clientSecret: process.env.HALO_CLIENT_SECRET || '',
      tenantId: process.env.HALO_TENANT_ID,
      authMethod: (process.env.HALO_AUTH_METHOD as 'oauth' | 'apikey') || 'oauth',
    };
    
    // Debug logging
    console.log('Initializing Halo client with config:', {
      apiUrl: haloConfig.apiUrl,
      hasClientId: !!haloConfig.clientId && haloConfig.clientId.length > 0,
      hasClientSecret: !!haloConfig.clientSecret && haloConfig.clientSecret.length > 0,
      authMethod: haloConfig.authMethod,
      tenantId: haloConfig.tenantId
    });
    
    haloClient = new HaloITSMClient(haloConfig);
  }
  
  return haloClient;
}

/**
 * Get the Halo ITSM client instance
 */
export function getHaloClient(): HaloITSMClient {
  if (!haloClient) {
    return initializeHaloClient();
  }
  return haloClient;
}