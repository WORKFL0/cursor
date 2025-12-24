import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Pinecone } from '@pinecone-database/pinecone';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Initialize Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Initialize Pinecone client for vector database
export const pinecone = process.env.PINECONE_API_KEY ? new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
}) : null;

// AI Configuration
export const AI_CONFIG = {
  // OpenAI settings
  openai: {
    embeddingModel: 'text-embedding-3-small',
    chatModel: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000,
  },
  
  // Anthropic settings
  anthropic: {
    model: 'claude-3-haiku-20240307',
    maxTokens: 2000,
    temperature: 0.7,
  },
  
  // Vector database settings
  vectorDB: {
    indexName: 'workflo-content',
    dimension: 1536, // For text-embedding-3-small
    metric: 'cosine',
    namespace: 'default',
  },
  
  // Search settings
  search: {
    topK: 10,
    minScore: 0.7,
    fuzzyThreshold: 0.3,
  },
  
  // Chatbot settings
  chatbot: {
    systemPrompt: `You are a helpful AI assistant for Workflo B.V., an IT services company in Amsterdam. 
    You help users understand our services, answer questions, and guide them to the right solutions.
    Be professional, friendly, and concise. Focus on Workflo's services: Managed IT, Cloud Solutions, 
    Cybersecurity, Microsoft 365, VoIP, Hardware as a Service, and Backup & Disaster Recovery.`,
    maxConversationLength: 10,
    responseTimeout: 30000,
  },
  
  // Content recommendation settings
  recommendations: {
    maxRecommendations: 5,
    similarityThreshold: 0.6,
    personalizationWeight: 0.3,
  },
};

// Helper function to get embedding
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: AI_CONFIG.openai.embeddingModel,
      input: text,
    });
    return response.data[0]?.embedding || [];
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Helper function for chat completion with fallback
export async function getChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  // Check if OpenAI is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using mock response');
    return getMockChatResponse(messages[messages.length - 1]?.content || '');
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: AI_CONFIG.openai.chatModel,
      messages,
      temperature: options?.temperature || AI_CONFIG.openai.temperature,
      max_tokens: options?.maxTokens || AI_CONFIG.openai.maxTokens,
    });
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error getting chat completion:', error);
    // Fallback to mock response
    return getMockChatResponse(messages[messages.length - 1]?.content || '');
  }
}

// Helper function for Anthropic chat
export async function getAnthropicCompletion(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt?: string
): Promise<string> {
  // Check if Anthropic is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('Anthropic API key not configured, using mock response');
    return getMockChatResponse(messages[messages.length - 1]?.content || '');
  }
  
  try {
    const response = await anthropic.messages.create({
      model: AI_CONFIG.anthropic.model,
      max_tokens: AI_CONFIG.anthropic.maxTokens,
      temperature: AI_CONFIG.anthropic.temperature,
      system: systemPrompt,
      messages,
    });
    
    const textContent = response.content.find(c => c.type === 'text');
    return textContent?.text || '';
  } catch (error) {
    console.error('Error getting Anthropic completion:', error);
    // Fallback to mock response
    return getMockChatResponse(messages[messages.length - 1]?.content || '');
  }
}

// Mock response generator for when AI services are not configured
export function getMockChatResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Service-related responses
  if (lowerMessage.includes('dienst') || lowerMessage.includes('service')) {
    return "Workflo biedt verschillende IT-diensten:\n\n" +
      "• **Managed IT Services** - Complete IT-beheer en ondersteuning\n" +
      "• **Cloud Oplossingen** - Schaalbare cloud infrastructuur\n" +
      "• **Cybersecurity** - Bescherming tegen digitale dreigingen\n" +
      "• **Microsoft 365** - Complete Microsoft implementatie\n" +
      "• **VoIP Telefonie** - Moderne zakelijke telefonie\n" +
      "• **Hardware as a Service** - Flexibele hardware lease\n\n" +
      "Wil je meer informatie over een specifieke dienst?";
  }
  
  // Support-related responses
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || 
      lowerMessage.includes('probleem') || lowerMessage.includes('storing')) {
    return "Ik zie dat je ondersteuning nodig hebt. Momenteel kan ik geen directe tickets aanmaken, maar je kunt:\n\n" +
      "• **Bellen**: 020-30 80 465 (24/7 beschikbaar)\n" +
      "• **E-mail**: support@workflo.it\n" +
      "• **Portal**: https://servicedesk.workflo.it\n\n" +
      "Voor urgente storingen adviseer ik je om direct te bellen.";
  }
  
  // Pricing responses
  if (lowerMessage.includes('prijs') || lowerMessage.includes('kost') || 
      lowerMessage.includes('price') || lowerMessage.includes('offerte')) {
    return "Voor prijsinformatie maken we graag een persoonlijke offerte op maat van jouw bedrijf.\n\n" +
      "• Kleine bedrijven: vanaf €99/maand\n" +
      "• Middelgrote bedrijven: op aanvraag\n" +
      "• Enterprise oplossingen: maatwerk\n\n" +
      "Neem contact op voor een vrijblijvend adviesgesprek: 020-30 80 465 of info@workflo.nl";
  }
  
  // Contact responses
  if (lowerMessage.includes('contact') || lowerMessage.includes('bereik') || 
      lowerMessage.includes('bel') || lowerMessage.includes('mail')) {
    return "Je kunt Workflo bereiken via:\n\n" +
      "📞 **Telefoon**: 020-30 80 465\n" +
      "📧 **E-mail**: info@workflo.nl\n" +
      "🏢 **Kantoor**: Amsterdam\n" +
      "🌐 **Website**: https://workflo.it\n\n" +
      "We zijn bereikbaar op werkdagen van 8:00 tot 18:00 uur. Voor urgente storingen zijn we 24/7 beschikbaar.";
  }
  
  // Default response
  return "Bedankt voor je bericht! Ik ben WorkBot, de digitale assistent van Workflo.\n\n" +
    "Ik kan je helpen met informatie over onze IT-diensten, prijzen, en ondersteuning. " +
    "Voor directe hulp kun je ook bellen naar 020-30 80 465 of mailen naar info@workflo.nl.\n\n" +
    "Waar kan ik je mee helpen?";
}