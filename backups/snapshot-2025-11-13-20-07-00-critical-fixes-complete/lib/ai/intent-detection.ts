import { getChatCompletion, getAnthropicCompletion } from './config';

// Intent types
export enum UserIntent {
  // Service inquiries
  SERVICE_INQUIRY = 'service_inquiry',
  SERVICE_COMPARISON = 'service_comparison',
  PRICING_REQUEST = 'pricing_request',
  
  // Support
  TECHNICAL_SUPPORT = 'technical_support',
  URGENT_ISSUE = 'urgent_issue',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_ISSUE = 'account_issue',
  
  // Sales
  QUOTE_REQUEST = 'quote_request',
  DEMO_REQUEST = 'demo_request',
  CONTACT_SALES = 'contact_sales',
  
  // Information
  GENERAL_INFORMATION = 'general_information',
  DOCUMENTATION = 'documentation',
  FAQ = 'faq',
  
  // Navigation
  NAVIGATION = 'navigation',
  SEARCH = 'search',
  
  // Action
  SCHEDULE_MEETING = 'schedule_meeting',
  FILE_TICKET = 'file_ticket',
  FEEDBACK = 'feedback',
  
  // Unknown
  UNKNOWN = 'unknown'
}

// Intent detection result
export interface IntentResult {
  intent: UserIntent;
  confidence: number;
  entities?: Record<string, any>;
  suggestedAction?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

// Keywords and patterns for each intent
const INTENT_PATTERNS = {
  [UserIntent.SERVICE_INQUIRY]: {
    keywords: ['dienst', 'service', 'aanbod', 'wat doen jullie', 'kunnen jullie', 'bieden jullie'],
    patterns: [/wat (is|zijn) .* dienst/i, /welke services/i, /wat bieden jullie/i],
  },
  [UserIntent.SERVICE_COMPARISON]: {
    keywords: ['verschil', 'vergelijk', 'versus', 'vs', 'beter', 'kiezen tussen'],
    patterns: [/wat is het verschil tussen/i, /welke is beter/i, /versus/i],
  },
  [UserIntent.PRICING_REQUEST]: {
    keywords: ['prijs', 'kosten', 'tarief', 'betalen', 'euro', 'budget', 'offerte'],
    patterns: [/wat kost/i, /hoeveel betaal/i, /wat is de prijs/i, /tarieven/i],
  },
  [UserIntent.TECHNICAL_SUPPORT]: {
    keywords: ['probleem', 'werkt niet', 'storing', 'error', 'fout', 'bug', 'help'],
    patterns: [/werkt niet/i, /heb een probleem/i, /krijg een error/i, /is stuk/i],
  },
  [UserIntent.URGENT_ISSUE]: {
    keywords: ['urgent', 'spoed', 'direct', 'meteen', 'kritiek', 'down', 'offline', 'emergency'],
    patterns: [/server is down/i, /alles ligt plat/i, /urgent help/i, /spoedeisend/i],
  },
  [UserIntent.PASSWORD_RESET]: {
    keywords: ['wachtwoord', 'password', 'reset', 'vergeten', 'inloggen', 'toegang'],
    patterns: [/wachtwoord vergeten/i, /kan niet inloggen/i, /reset password/i],
  },
  [UserIntent.QUOTE_REQUEST]: {
    keywords: ['offerte', 'quote', 'prijsopgave', 'voorstel', 'aanbieding'],
    patterns: [/offerte aanvragen/i, /graag een offerte/i, /prijsvoorstel/i],
  },
  [UserIntent.DEMO_REQUEST]: {
    keywords: ['demo', 'demonstratie', 'laten zien', 'uitproberen', 'trial'],
    patterns: [/demo aanvragen/i, /kan ik .* uitproberen/i, /gratis trial/i],
  },
  [UserIntent.SCHEDULE_MEETING]: {
    keywords: ['afspraak', 'meeting', 'gesprek', 'bellen', 'contact', 'spreken'],
    patterns: [/afspraak maken/i, /kunnen we bellen/i, /gesprek plannen/i],
  },
  [UserIntent.FILE_TICKET]: {
    keywords: ['ticket', 'melding', 'aanmaken', 'indienen', 'rapporteren'],
    patterns: [/ticket aanmaken/i, /melding maken/i, /probleem melden/i],
  },
  [UserIntent.NAVIGATION]: {
    keywords: ['waar', 'vind', 'pagina', 'link', 'ga naar', 'navigeer'],
    patterns: [/waar vind ik/i, /hoe kom ik bij/i, /link naar/i],
  },
  [UserIntent.FAQ]: {
    keywords: ['vraag', 'faq', 'veelgestelde', 'hoe', 'wat', 'waarom'],
    patterns: [/hoe werkt/i, /wat is/i, /waarom/i, /kan ik/i],
  },
};

// Urgency keywords
const URGENCY_INDICATORS = {
  critical: ['urgent', 'spoed', 'kritiek', 'emergency', 'down', 'plat', 'immediately'],
  high: ['snel', 'zsm', 'vandaag', 'direct', 'meteen', 'asap'],
  medium: ['binnenkort', 'deze week', 'spoedig'],
  low: ['wanneer mogelijk', 'geen haast', 'informatie', 'vraag'],
};

export class IntentDetector {
  private static instance: IntentDetector;
  
  private constructor() {}
  
  static getInstance(): IntentDetector {
    if (!IntentDetector.instance) {
      IntentDetector.instance = new IntentDetector();
    }
    return IntentDetector.instance;
  }
  
  /**
   * Detect user intent from input text
   */
  async detectIntent(text: string, useAI: boolean = true): Promise<IntentResult> {
    // First try rule-based detection
    const ruleBasedResult = this.detectIntentFromRules(text);
    
    // If confidence is high enough or AI is disabled, return rule-based result
    if (ruleBasedResult.confidence > 0.8 || !useAI) {
      return ruleBasedResult;
    }
    
    // Use AI for more accurate detection
    try {
      const aiResult = await this.detectIntentWithAI(text);
      
      // Combine rule-based and AI results
      if (aiResult.confidence > ruleBasedResult.confidence) {
        return aiResult;
      }
    } catch (error) {
      console.error('AI intent detection failed:', error);
    }
    
    return ruleBasedResult;
  }
  
  /**
   * Rule-based intent detection
   */
  private detectIntentFromRules(text: string): IntentResult {
    const lowerText = text.toLowerCase();
    const scores: Map<UserIntent, number> = new Map();
    
    // Check each intent pattern
    for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
      let score = 0;
      
      // Check keywords
      for (const keyword of config.keywords) {
        if (lowerText.includes(keyword)) {
          score += 0.3;
        }
      }
      
      // Check patterns
      for (const pattern of config.patterns) {
        if (pattern.test(lowerText)) {
          score += 0.5;
        }
      }
      
      if (score > 0) {
        scores.set(intent as UserIntent, Math.min(score, 1));
      }
    }
    
    // Get the highest scoring intent
    let bestIntent = UserIntent.UNKNOWN;
    let bestScore = 0;
    
    scores.forEach((score, intent) => {
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    });
    
    // Detect urgency
    const urgency = this.detectUrgency(lowerText);
    
    // Extract entities
    const entities = this.extractEntities(text);
    
    // Get suggested action
    const suggestedAction = this.getSuggestedAction(bestIntent);
    
    return {
      intent: bestIntent,
      confidence: bestScore,
      entities,
      urgency,
      suggestedAction,
    };
  }
  
  /**
   * AI-powered intent detection
   */
  private async detectIntentWithAI(text: string): Promise<IntentResult> {
    const prompt = `Analyze the following user input and determine their intent.
    
User Input: "${text}"

Possible intents:
- service_inquiry: Asking about services
- service_comparison: Comparing services
- pricing_request: Asking about prices
- technical_support: Technical problem
- urgent_issue: Critical/urgent problem
- password_reset: Password issues
- quote_request: Requesting a quote
- demo_request: Requesting a demo
- schedule_meeting: Want to schedule a meeting
- file_ticket: Want to create a support ticket
- navigation: Looking for specific page/content
- faq: General question
- unknown: Cannot determine intent

Response format (JSON):
{
  "intent": "intent_name",
  "confidence": 0.0-1.0,
  "reason": "brief explanation",
  "urgency": "low|medium|high|critical",
  "entities": { "key": "value" }
}`;

    try {
      const response = await getChatCompletion([
        { role: 'system', content: 'You are an intent detection system. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ], { temperature: 0.3, maxTokens: 200 });
      
      const result = JSON.parse(response);
      
      return {
        intent: result.intent as UserIntent || UserIntent.UNKNOWN,
        confidence: result.confidence || 0.5,
        entities: result.entities || {},
        urgency: result.urgency || 'low',
        suggestedAction: this.getSuggestedAction(result.intent),
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw error;
    }
  }
  
  /**
   * Detect urgency level from text
   */
  private detectUrgency(text: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerText = text.toLowerCase();
    
    for (const [level, keywords] of Object.entries(URGENCY_INDICATORS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return level as 'low' | 'medium' | 'high' | 'critical';
        }
      }
    }
    
    return 'low';
  }
  
  /**
   * Extract entities from text (services, products, etc.)
   */
  private extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {};
    const lowerText = text.toLowerCase();
    
    // Service names
    const services = [
      'managed it', 'cloud', 'backup', 'cybersecurity', 'voip',
      'microsoft 365', 'office 365', 'azure', 'aws', 'hardware'
    ];
    
    const mentionedServices = services.filter(service => lowerText.includes(service));
    if (mentionedServices.length > 0) {
      entities.services = mentionedServices;
    }
    
    // Email detection
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      entities.email = emailMatch[0];
    }
    
    // Phone number detection (Dutch format)
    const phoneMatch = text.match(/(?:\+31|0)\d{9,10}/);
    if (phoneMatch) {
      entities.phone = phoneMatch[0];
    }
    
    return entities;
  }
  
  /**
   * Get suggested action based on intent
   */
  private getSuggestedAction(intent: UserIntent): string {
    const actions: Record<UserIntent, string> = {
      [UserIntent.SERVICE_INQUIRY]: 'Browse our services',
      [UserIntent.SERVICE_COMPARISON]: 'Compare service features',
      [UserIntent.PRICING_REQUEST]: 'Request a custom quote',
      [UserIntent.TECHNICAL_SUPPORT]: 'Open support ticket',
      [UserIntent.URGENT_ISSUE]: 'Contact emergency support',
      [UserIntent.PASSWORD_RESET]: 'Reset password',
      [UserIntent.ACCOUNT_ISSUE]: 'Contact account support',
      [UserIntent.QUOTE_REQUEST]: 'Fill quote request form',
      [UserIntent.DEMO_REQUEST]: 'Schedule a demo',
      [UserIntent.CONTACT_SALES]: 'Connect with sales team',
      [UserIntent.GENERAL_INFORMATION]: 'Browse knowledge base',
      [UserIntent.DOCUMENTATION]: 'View documentation',
      [UserIntent.FAQ]: 'Check FAQ section',
      [UserIntent.NAVIGATION]: 'Use site search',
      [UserIntent.SEARCH]: 'Search for content',
      [UserIntent.SCHEDULE_MEETING]: 'Book a meeting',
      [UserIntent.FILE_TICKET]: 'Create support ticket',
      [UserIntent.FEEDBACK]: 'Submit feedback',
      [UserIntent.UNKNOWN]: 'Contact support',
    };
    
    return actions[intent] || 'How can we help?';
  }
  
  /**
   * Get intent-based routing
   */
  getRouting(intent: UserIntent): { 
    department: string; 
    priority: number; 
    autoResponse: boolean;
  } {
    const routing: Record<UserIntent, any> = {
      [UserIntent.SERVICE_INQUIRY]: { department: 'sales', priority: 2, autoResponse: true },
      [UserIntent.SERVICE_COMPARISON]: { department: 'sales', priority: 2, autoResponse: true },
      [UserIntent.PRICING_REQUEST]: { department: 'sales', priority: 2, autoResponse: false },
      [UserIntent.TECHNICAL_SUPPORT]: { department: 'support', priority: 3, autoResponse: false },
      [UserIntent.URGENT_ISSUE]: { department: 'support', priority: 5, autoResponse: false },
      [UserIntent.PASSWORD_RESET]: { department: 'support', priority: 2, autoResponse: true },
      [UserIntent.ACCOUNT_ISSUE]: { department: 'support', priority: 3, autoResponse: false },
      [UserIntent.QUOTE_REQUEST]: { department: 'sales', priority: 3, autoResponse: false },
      [UserIntent.DEMO_REQUEST]: { department: 'sales', priority: 3, autoResponse: false },
      [UserIntent.CONTACT_SALES]: { department: 'sales', priority: 2, autoResponse: false },
      [UserIntent.GENERAL_INFORMATION]: { department: 'general', priority: 1, autoResponse: true },
      [UserIntent.DOCUMENTATION]: { department: 'general', priority: 1, autoResponse: true },
      [UserIntent.FAQ]: { department: 'general', priority: 1, autoResponse: true },
      [UserIntent.NAVIGATION]: { department: 'general', priority: 1, autoResponse: true },
      [UserIntent.SEARCH]: { department: 'general', priority: 1, autoResponse: true },
      [UserIntent.SCHEDULE_MEETING]: { department: 'sales', priority: 2, autoResponse: false },
      [UserIntent.FILE_TICKET]: { department: 'support', priority: 3, autoResponse: false },
      [UserIntent.FEEDBACK]: { department: 'general', priority: 1, autoResponse: true },
      [UserIntent.UNKNOWN]: { department: 'general', priority: 1, autoResponse: false },
    };
    
    return routing[intent] || { department: 'general', priority: 1, autoResponse: false };
  }
}

// Export singleton instance
export const intentDetector = IntentDetector.getInstance();