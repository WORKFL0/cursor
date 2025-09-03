import { getChatCompletion, getAnthropicCompletion, AI_CONFIG } from './config';
import { getSearchEngine, SearchableContent } from './search';
import { getHaloClient, HaloChatContext } from '@/lib/integrations/halo-itsm';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestedActions?: string[];
    relatedContent?: Array<{ title: string; url: string }>;
  };
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: {
    userInfo?: {
      name?: string;
      email?: string;
      company?: string;
      industry?: string;
    };
    leadQualification?: {
      budget?: string;
      timeline?: string;
      decisionMaker?: boolean;
      currentSolution?: string;
      painPoints?: string[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatbotResponse {
  message: string;
  suggestedActions?: string[];
  relatedContent?: Array<{ title: string; url: string; type: string }>;
  shouldCollectInfo?: boolean;
  nextQuestion?: string;
}

// Intent classification
export type ChatIntent = 
  | 'greeting'
  | 'service_inquiry'
  | 'pricing_question'
  | 'technical_support'
  | 'contact_request'
  | 'general_question'
  | 'lead_qualification'
  | 'complaint'
  | 'feedback';

export class WorkBot {
  private searchEngine = getSearchEngine();
  private haloClient = getHaloClient();
  
  // Classify user intent (Dutch and English)
  private async classifyIntent(message: string): Promise<{ intent: ChatIntent; confidence: number }> {
    const intents: Record<ChatIntent, string[]> = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings', 'hallo', 'hoi', 'goedendag', 'goedemorgen', 'goedemiddag', 'dag'],
      service_inquiry: ['service', 'managed it', 'cloud', 'backup', 'security', 'microsoft', 'voip', 'hardware', 'dienst', 'diensten', 'beheer', 'beveiliging', 'telefonie', 'opslag'],
      pricing_question: ['price', 'cost', 'pricing', 'how much', 'quote', 'budget', 'expensive', 'prijs', 'kosten', 'hoeveel', 'offerte', 'tarief', 'duur', 'goedkoop'],
      technical_support: ['help', 'support', 'problem', 'issue', 'not working', 'error', 'broken', 'hulp', 'ondersteuning', 'probleem', 'storing', 'werkt niet', 'fout', 'kapot'],
      contact_request: ['contact', 'call', 'email', 'speak', 'talk', 'reach', 'appointment', 'bellen', 'mailen', 'spreken', 'afspraak', 'bereiken'],
      lead_qualification: ['interested', 'looking for', 'need', 'want', 'considering', 'evaluate', 'geïnteresseerd', 'zoek', 'nodig', 'wil', 'overweeg', 'evalueren'],
      complaint: ['unhappy', 'disappointed', 'frustrated', 'angry', 'terrible', 'bad', 'ontevreden', 'teleurgesteld', 'gefrustreerd', 'boos', 'slecht', 'vreselijk'],
      feedback: ['feedback', 'suggestion', 'improve', 'better', 'love', 'great', 'excellent', 'suggestie', 'verbeteren', 'beter', 'geweldig', 'uitstekend', 'top'],
      general_question: ['what', 'how', 'why', 'when', 'where', 'tell me', 'wat', 'hoe', 'waarom', 'wanneer', 'waar', 'vertel'],
    };
    
    const lowerMessage = message.toLowerCase();
    let bestIntent: ChatIntent = 'general_question';
    let highestScore = 0;
    
    for (const [intent, keywords] of Object.entries(intents)) {
      const score = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (score > highestScore) {
        highestScore = score;
        bestIntent = intent as ChatIntent;
      }
    }
    
    const confidence = Math.min(highestScore / 3, 1); // Normalize confidence
    return { intent: bestIntent, confidence };
  }
  
  // Generate contextual response
  public async generateResponse(
    message: string,
    session?: ChatSession,
    useAI: boolean = true
  ): Promise<ChatbotResponse> {
    const { intent, confidence } = await this.classifyIntent(message);
    
    // Search for relevant content
    const searchResults = await this.searchEngine.search(message, { limit: 3 });
    const relatedContent = searchResults.map(r => ({
      title: r.title,
      url: r.url,
      type: r.type,
    }));
    
    let response: ChatbotResponse = {
      message: '',
      relatedContent,
    };
    
    // Handle different intents
    switch (intent) {
      case 'greeting':
        response = this.handleGreeting();
        break;
        
      case 'service_inquiry':
        response = await this.handleServiceInquiry(message, searchResults);
        break;
        
      case 'pricing_question':
        response = this.handlePricingQuestion();
        break;
        
      case 'technical_support':
        response = await this.handleTechnicalSupport(message, session);
        break;
        
      case 'contact_request':
        response = this.handleContactRequest();
        break;
        
      case 'lead_qualification':
        response = await this.handleLeadQualification(message, session);
        break;
        
      case 'complaint':
        response = this.handleComplaint();
        break;
        
      case 'feedback':
        response = this.handleFeedback();
        break;
        
      default:
        if (useAI) {
          response = await this.generateAIResponse(message, session, searchResults);
        } else {
          response = this.generateFallbackResponse();
        }
    }
    
    response.relatedContent = relatedContent;
    return response;
  }
  
  // Handle greeting
  private handleGreeting(): ChatbotResponse {
    const greetings = [
      "Hallo! Welkom bij Workflo. Ik ben WorkBot, je digitale IT-adviseur. Waar kan ik je mee helpen?",
      "Goedendag! Ik ben WorkBot en help je graag met al jouw vragen over onze IT-diensten. Wat wil je weten?",
      "Welkom bij Workflo! Als WorkBot sta ik klaar om je te informeren over onze managed IT services, cloud oplossingen en meer. Waar ben je in geïnteresseerd?",
    ];
    
    return {
      message: greetings[Math.floor(Math.random() * greetings.length)] || greetings[0] || "Hallo! Hoe kan ik je helpen?",
      suggestedActions: [
        "Vertel over jullie diensten",
        "Ik heb IT ondersteuning nodig",
        "Vraag een offerte aan",
        "Contact met verkoop",
      ],
    };
  }
  
  // Handle service inquiry
  private async handleServiceInquiry(
    message: string,
    searchResults: any[]
  ): Promise<ChatbotResponse> {
    const services = {
      'managed it': {
        title: 'Managed IT Services',
        description: 'Complete IT-beheer en ondersteuning voor jouw bedrijf',
        url: '/diensten/managed-it',
      },
      'cloud': {
        title: 'Cloud Oplossingen',
        description: 'Schaalbare cloud infrastructuur en migratie diensten',
        url: '/diensten/cloud',
      },
      'security': {
        title: 'Cybersecurity',
        description: 'Uitgebreide beveiligingsoplossingen om jouw bedrijf te beschermen',
        url: '/diensten/cybersecurity',
      },
      'backup': {
        title: 'Backup & Disaster Recovery',
        description: 'Betrouwbare data backup en bedrijfscontinuïteit oplossingen',
        url: '/diensten/backup-disaster-recovery',
      },
      'microsoft': {
        title: 'Microsoft 365',
        description: 'Complete Microsoft 365 implementatie en ondersteuning',
        url: '/diensten/microsoft-365',
      },
      'voip': {
        title: 'VoIP Telefonie',
        description: 'Moderne zakelijke telefoonsystemen in de cloud',
        url: '/diensten/voip-telefonie',
      },
      'hardware': {
        title: 'Hardware as a Service',
        description: 'Flexibele hardware lease en beheer',
        url: '/diensten/hardware-as-a-service',
      },
    };
    
    const lowerMessage = message.toLowerCase();
    let matchedService = null;
    
    for (const [key, service] of Object.entries(services)) {
      if (lowerMessage.includes(key)) {
        matchedService = service;
        break;
      }
    }
    
    if (matchedService) {
      return {
        message: `${matchedService.title}: ${matchedService.description}\n\nWil je meer weten over deze dienst of met ons team spreken?`,
        suggestedActions: [
          "Meer informatie",
          "Offerte aanvragen",
          "Consultatie plannen",
          "Andere diensten bekijken",
        ],
        relatedContent: [{
          title: matchedService.title,
          url: matchedService.url,
          type: 'service',
        }],
      };
    }
    
    return {
      message: "Wij bieden een uitgebreid scala aan IT-diensten waaronder Managed IT, Cloud Oplossingen, Cybersecurity, Backup & Recovery, Microsoft 365, VoIP Telefonie en Hardware as a Service. Welk gebied interesseert je het meest?",
      suggestedActions: Object.values(services).map(s => s.title),
    };
  }
  
  // Handle pricing questions
  private handlePricingQuestion(): ChatbotResponse {
    return {
      message: "Onze prijzen worden afgestemd op jouw specifieke behoeften en bedrijfsgrootte. We bieden flexibele pakketten vanaf €99/maand voor kleine bedrijven. Wil je een persoonlijke offerte ontvangen?",
      suggestedActions: [
        "Persoonlijke offerte aanvragen",
        "Prijscalculator bekijken",
        "Consultatie plannen",
        "Service pakketten bekijken",
      ],
      shouldCollectInfo: true,
      nextQuestion: "Om een nauwkeurige offerte te maken, kun je mij vertellen over jouw bedrijfsgrootte en belangrijkste IT-behoeften?",
    };
  }
  
  // Handle technical support
  private async handleTechnicalSupport(message: string, session?: ChatSession): Promise<ChatbotResponse> {
    const response: ChatbotResponse = {
      message: "Ik kan je direct helpen met technische ondersteuning. Wat is het probleem dat je ervaart?",
      suggestedActions: [
        "Systeem is niet bereikbaar",
        "Login problemen",
        "E-mail werkt niet",
        "Nieuwe ticket aanmaken",
        "Status van bestaande ticket",
      ],
      shouldCollectInfo: true,
    };

    // Check if this is a follow-up about creating a ticket
    if (message.toLowerCase().includes('ticket') || message.toLowerCase().includes('probleem')) {
      response.message = "Ik kan direct een support ticket voor je aanmaken. Kun je het probleem beschrijven?";
      response.nextQuestion = "Beschrijf het technische probleem dat je ervaart:";
    }

    return response;
  }
  
  // Handle contact request
  private handleContactRequest(): ChatbotResponse {
    return {
      message: "Ik breng je graag in contact met ons team! Je kunt ons bereiken via:\n\n📧 E-mail: info@workflo.nl\n📞 Telefoon: +31 20 123 4567\n📍 Kantoor: Amsterdam\n\nWil je een consultatie inplannen?",
      suggestedActions: [
        "Consultatie inplannen",
        "E-mail sturen",
        "Nu bellen",
        "Kantoor bezoeken",
      ],
      shouldCollectInfo: true,
    };
  }
  
  // Handle lead qualification
  private async handleLeadQualification(
    message: string,
    session?: ChatSession
  ): Promise<ChatbotResponse> {
    const questions = [
      "What's your company name and industry?",
      "How many employees does your company have?",
      "What are your main IT challenges currently?",
      "What's your timeline for implementing a solution?",
      "What's your approximate budget range?",
    ];
    
    const currentStep = session?.context.leadQualification ? 
      Object.keys(session.context.leadQualification).length : 0;
    
    if (currentStep < questions.length) {
      return {
        message: "Great! I'd like to understand your needs better to provide the most relevant information.",
        suggestedActions: ["Continue", "Skip", "Contact sales directly"],
        shouldCollectInfo: true,
        nextQuestion: questions[currentStep],
      };
    }
    
    return {
      message: "Thank you for providing this information! Based on your needs, I've identified several solutions that could help. Our sales team will reach out shortly with a personalized proposal.",
      suggestedActions: ["View recommended services", "Schedule call", "Download brochure"],
    };
  }
  
  // Handle complaints
  private handleComplaint(): ChatbotResponse {
    return {
      message: "Het spijt me te horen dat je problemen ervaart. Jouw tevredenheid is zeer belangrijk voor ons. Wil je direct met een manager spreken, of kun je mij meer vertellen over het probleem zodat ik kan helpen het op te lossen?",
      suggestedActions: [
        "Spreken met manager",
        "Probleem beschrijven",
        "Formele klacht indienen",
        "Terugbelverzoek",
      ],
      shouldCollectInfo: true,
    };
  }
  
  // Handle feedback
  private handleFeedback(): ChatbotResponse {
    return {
      message: "Bedankt voor je feedback! We zijn altijd op zoek naar manieren om onze diensten te verbeteren. Wil je meer details delen over jouw ervaring?",
      suggestedActions: [
        "Gedetailleerde feedback delen",
        "Onze diensten beoordelen",
        "Verbeteringen voorstellen",
        "Nee bedankt",
      ],
      shouldCollectInfo: true,
    };
  }
  
  // Generate AI response using LLM
  private async generateAIResponse(
    message: string,
    session?: ChatSession,
    searchResults?: any[]
  ): Promise<ChatbotResponse> {
    try {
      // Build context from search results
      const context = searchResults?.map(r => 
        `${r.title}: ${r.highlight}`
      ).join('\n\n');
      
      // Build conversation history
      const history = session?.messages.slice(-5).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })) || [];
      
      const systemPrompt = `${AI_CONFIG.chatbot.systemPrompt}
      
      Available context from our knowledge base:
      ${context || 'No specific context available'}
      
      User information:
      ${JSON.stringify(session?.context.userInfo || {})}
      
      Provide a helpful, concise response. If you're not sure about something, offer to connect them with our team.`;
      
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...history,
        { role: 'user' as const, content: message },
      ];
      
      const response = await getChatCompletion(messages);
      
      // Generate suggested actions based on response
      const suggestedActions = this.generateSuggestedActions(response);
      
      return {
        message: response,
        suggestedActions,
      };
    } catch (error) {
      console.error('AI response generation error:', error);
      return this.generateFallbackResponse();
    }
  }
  
  // Generate fallback response
  private generateFallbackResponse(): ChatbotResponse {
    return {
      message: "Ik ben WorkBot en help je graag met informatie over de IT-diensten van Workflo. Kun je jouw vraag anders formuleren, of spreek je liever direct met ons team?",
      suggestedActions: [
        "Bekijk onze diensten",
        "Contact met verkoop",
        "Ondersteuning krijgen",
        "Terugbelverzoek",
      ],
    };
  }
  
  // Generate suggested actions based on context
  private generateSuggestedActions(response: string): string[] {
    const actions: string[] = [];
    
    if (response.toLowerCase().includes('service')) {
      actions.push('View all services');
    }
    if (response.toLowerCase().includes('price') || response.toLowerCase().includes('cost')) {
      actions.push('Get a quote');
    }
    if (response.toLowerCase().includes('contact') || response.toLowerCase().includes('call')) {
      actions.push('Schedule consultation');
    }
    if (actions.length === 0) {
      actions.push('Learn more', 'Contact us', 'View services');
    }
    
    return actions.slice(0, 4);
  }
  
  // Create new chat session
  public createSession(userInfo?: any): ChatSession {
    return {
      id: Math.random().toString(36).substr(2, 9),
      messages: [],
      context: {
        userInfo: userInfo || {},
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  // Add message to session
  public addMessageToSession(
    session: ChatSession,
    message: ChatMessage
  ): ChatSession {
    session.messages.push(message);
    session.updatedAt = new Date();
    
    // Keep only last N messages to prevent context overflow
    if (session.messages.length > AI_CONFIG.chatbot.maxConversationLength) {
      session.messages = session.messages.slice(-AI_CONFIG.chatbot.maxConversationLength);
    }
    
    return session;
  }

  // Create support ticket via Halo ITSM
  public async createSupportTicket(
    session: ChatSession,
    issue: string,
    userInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
    }
  ): Promise<{ success: boolean; ticketNumber?: string; message: string }> {
    try {
      // Build Halo context from chat session
      const haloContext: HaloChatContext = {
        sessionId: session.id,
        conversationHistory: session.messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.timestamp,
        })),
        metadata: {
          source: 'chatbot',
          page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        },
      };

      // Create ticket in Halo ITSM
      const ticketResponse = await this.haloClient.createTicketFromChat(
        haloContext,
        issue,
        userInfo || session.context.userInfo
      );

      return {
        success: true,
        ticketNumber: ticketResponse.ticketNumber,
        message: `Support ticket ${ticketResponse.ticketNumber} is aangemaakt. We nemen zo snel mogelijk contact met je op. Je kunt de status volgen via ${ticketResponse.portalUrl || 'https://servicedesk.workflo.it'}`,
      };
    } catch (error) {
      console.error('Error creating support ticket:', error);
      return {
        success: false,
        message: 'Er ging iets mis bij het aanmaken van het ticket. Neem contact op via support@workflo.it of bel 020-30 80 465.',
      };
    }
  }

  // Check ticket status
  public async checkTicketStatus(ticketId: string): Promise<string> {
    try {
      const ticket = await this.haloClient.getTicketStatus(ticketId);
      
      if (!ticket) {
        return 'Ticket niet gevonden. Controleer het ticketnummer of neem contact op met support.';
      }

      const statusMessages: Record<string, string> = {
        'new': 'Nieuw - Je ticket is ontvangen en wacht op toewijzing',
        'open': 'Open - Een technicus is bezig met je ticket',
        'pending': 'In afwachting - We wachten op aanvullende informatie',
        'resolved': 'Opgelost - Het probleem is verholpen',
        'closed': 'Gesloten - Het ticket is afgerond',
      };

      const statusText = statusMessages[ticket.status || 'new'] || ticket.status;
      
      return `Ticket ${ticketId}: ${statusText}\n\nLaatst bijgewerkt: ${ticket.updatedAt?.toLocaleString('nl-NL')}`;
    } catch (error) {
      console.error('Error checking ticket status:', error);
      return 'Kan de ticketstatus momenteel niet ophalen. Probeer het later opnieuw of neem contact op met support.';
    }
  }
}