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

// Helper function for chat completion
export async function getChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
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
    throw error;
  }
}

// Helper function for Anthropic chat
export async function getAnthropicCompletion(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt?: string
): Promise<string> {
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
    throw error;
  }
}