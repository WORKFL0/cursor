import Fuse from 'fuse.js';
import { getEmbedding, getChatCompletion, AI_CONFIG } from './config';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  relatedQuestions?: string[];
  views?: number;
  helpful?: number;
  notHelpful?: number;
  lastUpdated?: Date;
}

export interface FAQMatch {
  faq: FAQ;
  score: number;
  matchType: 'exact' | 'fuzzy' | 'semantic' | 'related';
  highlightedQuestion?: string;
  highlightedAnswer?: string;
  explanation?: string;
}

export interface FAQSuggestion {
  question: string;
  confidence: number;
  basedOn: string;
}

export class IntelligentFAQSystem {
  private faqs: FAQ[] = [];
  private fuseIndex: Fuse<FAQ> | null = null;
  private embeddingCache: Map<string, number[]> = new Map();
  private questionVariants: Map<string, string[]> = new Map();
  private commonQuestions: Map<string, number> = new Map();
  
  constructor(faqs: FAQ[] = []) {
    this.faqs = faqs;
    this.initializeFuseIndex();
    this.initializeQuestionVariants();
  }
  
  // Initialize Fuse.js for fuzzy matching
  private initializeFuseIndex() {
    if (this.faqs.length > 0) {
      this.fuseIndex = new Fuse(this.faqs, {
        keys: [
          { name: 'question', weight: 0.5 },
          { name: 'answer', weight: 0.3 },
          { name: 'tags', weight: 0.2 },
        ],
        threshold: 0.4,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 3,
        shouldSort: true,
      });
    }
  }
  
  // Initialize common question variants (Dutch and English)
  private initializeQuestionVariants() {
    // Common variations for IT support questions in Dutch and English
    this.questionVariants.set('password', [
      'password reset', 'wachtwoord reset',
      'forgot password', 'wachtwoord vergeten',
      'change password', 'wachtwoord wijzigen',
      'reset my password', 'reset mijn wachtwoord',
      'can\'t log in', 'kan niet inloggen',
      'locked out', 'buitengesloten',
    ]);
    
    this.questionVariants.set('email', [
      'email not working', 'email werkt niet',
      'can\'t send email', 'kan geen email verzenden',
      'email issues', 'email problemen',
      'outlook problems', 'outlook problemen',
      'mail delivery', 'mail bezorging',
    ]);
    
    this.questionVariants.set('internet', [
      'internet slow', 'internet traag',
      'wifi not working', 'wifi werkt niet',
      'connection issues', 'verbindingsproblemen',
      'network problems', 'netwerkproblemen',
      'can\'t connect', 'kan niet verbinden',
    ]);
    
    this.questionVariants.set('backup', [
      'data backup', 'data backup',
      'restore files', 'bestanden herstellen',
      'backup frequency', 'backup frequentie',
      'disaster recovery', 'disaster recovery',
      'data protection', 'data bescherming',
      'gegevens backup', 'herstel bestanden',
    ]);
    
    this.questionVariants.set('security', [
      'virus protection', 'virusbescherming',
      'malware', 'malware',
      'phishing', 'phishing',
      'security breach', 'beveiligingslek',
      'data security', 'data beveiliging',
      'cyberbeveiliging', 'cybersecurity',
    ]);
    
    this.questionVariants.set('cloud', [
      'cloud storage', 'cloud opslag',
      'onedrive', 'onedrive',
      'sharepoint', 'sharepoint',
      'file sharing', 'bestanden delen',
      'remote access', 'toegang op afstand',
      'cloud diensten', 'cloud services',
    ]);
    
    this.questionVariants.set('support', [
      'get help', 'hulp krijgen',
      'contact support', 'contact ondersteuning',
      'service hours', 'service uren',
      'response time', 'reactietijd',
      'SLA', 'SLA',
      'ondersteuning', 'support',
    ]);
    
    this.questionVariants.set('telefonie', [
      'voip', 'voip telefonie',
      'phone system', 'telefoonsysteem',
      'zakelijke telefonie', 'business phone',
      'bellen', 'calling',
      'telefooncentrale', 'pbx',
    ]);
  }
  
  // Find matching FAQs for a user query
  public async findMatches(
    query: string,
    options?: {
      limit?: number;
      category?: string;
      useSemanticSearch?: boolean;
      includeRelated?: boolean;
    }
  ): Promise<FAQMatch[]> {
    const limit = options?.limit || 5;
    const matches: FAQMatch[] = [];
    
    // 1. Check for exact matches
    const exactMatch = this.findExactMatch(query, options?.category);
    if (exactMatch) {
      matches.push(exactMatch);
    }
    
    // 2. Fuzzy matching with Fuse.js
    if (this.fuseIndex) {
      const fuzzyMatches = this.findFuzzyMatches(query, limit, options?.category);
      matches.push(...fuzzyMatches);
    }
    
    // 3. Semantic search if enabled
    if (options?.useSemanticSearch !== false && matches.length < limit) {
      const semanticMatches = await this.findSemanticMatches(
        query,
        limit - matches.length,
        options?.category
      );
      matches.push(...semanticMatches);
    }
    
    // 4. Include related questions if requested
    if (options?.includeRelated && matches.length > 0) {
      const relatedMatches = this.findRelatedQuestions(matches[0].faq, limit);
      matches.push(...relatedMatches);
    }
    
    // Track popular questions
    this.trackQuestionPopularity(query);
    
    // Deduplicate and sort by score
    return this.deduplicateAndSort(matches).slice(0, limit);
  }
  
  // Find exact match
  private findExactMatch(query: string, category?: string): FAQMatch | null {
    const normalizedQuery = query.toLowerCase().trim();
    
    for (const faq of this.faqs) {
      if (category && faq.category !== category) continue;
      
      if (faq.question.toLowerCase().trim() === normalizedQuery) {
        return {
          faq,
          score: 1.0,
          matchType: 'exact',
          explanation: 'Exacte overeenkomst gevonden',
        };
      }
      
      // Check question variants
      for (const [key, variants] of this.questionVariants) {
        if (variants.some(v => v.toLowerCase() === normalizedQuery)) {
          if (faq.tags.includes(key)) {
            return {
              faq,
              score: 0.95,
              matchType: 'exact',
              explanation: 'Overeenkomst met bekende vraagvariant',
            };
          }
        }
      }
    }
    
    return null;
  }
  
  // Find fuzzy matches using Fuse.js
  private findFuzzyMatches(query: string, limit: number, category?: string): FAQMatch[] {
    if (!this.fuseIndex) return [];
    
    const results = this.fuseIndex.search(query);
    
    return results
      .filter(result => !category || result.item.category === category)
      .slice(0, limit)
      .map(result => ({
        faq: result.item,
        score: 1 - (result.score || 0),
        matchType: 'fuzzy' as const,
        highlightedQuestion: this.highlightMatches(result.item.question, result.matches),
        highlightedAnswer: this.highlightMatches(result.item.answer, result.matches),
        explanation: 'Overeenkomst op basis van gelijkenis',
      }));
  }
  
  // Find semantic matches using embeddings
  private async findSemanticMatches(
    query: string,
    limit: number,
    category?: string
  ): Promise<FAQMatch[]> {
    try {
      const queryEmbedding = await getEmbedding(query);
      const matches: FAQMatch[] = [];
      
      for (const faq of this.faqs) {
        if (category && faq.category !== category) continue;
        
        const faqEmbedding = await this.getFAQEmbedding(faq);
        const similarity = this.cosineSimilarity(queryEmbedding, faqEmbedding);
        
        if (similarity > AI_CONFIG.search.minScore) {
          matches.push({
            faq,
            score: similarity,
            matchType: 'semantic',
            explanation: 'Semantisch vergelijkbare vraag',
          });
        }
      }
      
      return matches
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Semantic matching error:', error);
      return [];
    }
  }
  
  // Find related questions
  private findRelatedQuestions(faq: FAQ, limit: number): FAQMatch[] {
    const related: FAQMatch[] = [];
    
    // Use explicitly defined related questions
    if (faq.relatedQuestions) {
      faq.relatedQuestions.forEach(questionId => {
        const relatedFAQ = this.faqs.find(f => f.id === questionId);
        if (relatedFAQ) {
          related.push({
            faq: relatedFAQ,
            score: 0.7,
            matchType: 'related',
            explanation: 'Gerelateerde vraag',
          });
        }
      });
    }
    
    // Find FAQs with similar tags
    const faqTags = new Set(faq.tags);
    this.faqs.forEach(otherFAQ => {
      if (otherFAQ.id !== faq.id) {
        const commonTags = otherFAQ.tags.filter(tag => faqTags.has(tag));
        if (commonTags.length > 0) {
          related.push({
            faq: otherFAQ,
            score: 0.6 + (commonTags.length * 0.1),
            matchType: 'related',
            explanation: `Gerelateerd door onderwerpen: ${commonTags.join(', ')}`,
          });
        }
      }
    });
    
    return related
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  // Get or create embedding for FAQ
  private async getFAQEmbedding(faq: FAQ): Promise<number[]> {
    const cacheKey = faq.id;
    
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey)!;
    }
    
    const text = `${faq.question} ${faq.answer}`;
    const embedding = await getEmbedding(text);
    this.embeddingCache.set(cacheKey, embedding);
    
    return embedding;
  }
  
  // Calculate cosine similarity between embeddings
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  // Highlight matched portions
  private highlightMatches(text: string, matches?: any[]): string {
    if (!matches) return text;
    
    let highlighted = text;
    matches.forEach(match => {
      if (match.value) {
        highlighted = highlighted.replace(
          new RegExp(match.value, 'gi'),
          `<mark>${match.value}</mark>`
        );
      }
    });
    
    return highlighted;
  }
  
  // Track question popularity
  private trackQuestionPopularity(query: string) {
    const normalized = query.toLowerCase().trim();
    this.commonQuestions.set(
      normalized,
      (this.commonQuestions.get(normalized) || 0) + 1
    );
  }
  
  // Deduplicate and sort matches
  private deduplicateAndSort(matches: FAQMatch[]): FAQMatch[] {
    const seen = new Set<string>();
    return matches
      .filter(match => {
        if (seen.has(match.faq.id)) return false;
        seen.add(match.faq.id);
        return true;
      })
      .sort((a, b) => b.score - a.score);
  }
  
  // Generate answer for unanswered questions
  public async generateAnswer(question: string): Promise<string> {
    try {
      // Find similar FAQs for context
      const similarFAQs = await this.findMatches(question, { limit: 3 });
      
      const context = similarFAQs
        .map(match => `Q: ${match.faq.question}\nA: ${match.faq.answer}`)
        .join('\n\n');
      
      const prompt = `Based on these similar FAQs from Workflo's knowledge base:

${context}

Please provide a helpful answer to this question: "${question}"

Keep the answer concise, professional, and relevant to Workflo's IT services.`;
      
      const answer = await getChatCompletion([
        { role: 'system', content: AI_CONFIG.chatbot.systemPrompt },
        { role: 'user', content: prompt },
      ]);
      
      return answer;
    } catch (error) {
      console.error('Error generating answer:', error);
      return 'Mijn excuses, ik kan momenteel geen antwoord genereren. Neem contact op met ons support team voor hulp.';
    }
  }
  
  // Suggest questions based on partial input
  public async suggestQuestions(partial: string, limit: number = 5): Promise<FAQSuggestion[]> {
    const suggestions: FAQSuggestion[] = [];
    const lowerPartial = partial.toLowerCase();
    
    // Suggest from existing FAQs
    this.faqs.forEach(faq => {
      if (faq.question.toLowerCase().includes(lowerPartial)) {
        suggestions.push({
          question: faq.question,
          confidence: 0.9,
          basedOn: 'bestaande FAQ',
        });
      }
    });
    
    // Suggest from common questions
    this.commonQuestions.forEach((count, question) => {
      if (question.includes(lowerPartial)) {
        suggestions.push({
          question,
          confidence: Math.min(count / 10, 0.8),
          basedOn: 'vaak gevraagd',
        });
      }
    });
    
    // Suggest from question variants
    this.questionVariants.forEach((variants, key) => {
      variants.forEach(variant => {
        if (variant.includes(lowerPartial)) {
          suggestions.push({
            question: variant,
            confidence: 0.7,
            basedOn: `gerelateerd aan ${key}`,
          });
        }
      });
    });
    
    // Deduplicate and sort
    const unique = new Map<string, FAQSuggestion>();
    suggestions.forEach(s => {
      const existing = unique.get(s.question);
      if (!existing || existing.confidence < s.confidence) {
        unique.set(s.question, s);
      }
    });
    
    return Array.from(unique.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }
  
  // Get trending/popular questions
  public getTrendingQuestions(limit: number = 5): Array<{ question: string; count: number }> {
    return Array.from(this.commonQuestions.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([question, count]) => ({ question, count }));
  }
  
  // Update FAQ metrics
  public updateFAQMetrics(faqId: string, metric: 'view' | 'helpful' | 'notHelpful') {
    const faq = this.faqs.find(f => f.id === faqId);
    if (faq) {
      switch (metric) {
        case 'view':
          faq.views = (faq.views || 0) + 1;
          break;
        case 'helpful':
          faq.helpful = (faq.helpful || 0) + 1;
          break;
        case 'notHelpful':
          faq.notHelpful = (faq.notHelpful || 0) + 1;
          break;
      }
    }
  }
  
  // Add new FAQ
  public addFAQ(faq: FAQ) {
    this.faqs.push(faq);
    this.initializeFuseIndex();
  }
  
  // Get FAQ categories
  public getCategories(): string[] {
    return [...new Set(this.faqs.map(f => f.category))];
  }
  
  // Get FAQs by category
  public getFAQsByCategory(category: string): FAQ[] {
    return this.faqs.filter(f => f.category === category);
  }
}

// Create singleton instance
let faqSystem: IntelligentFAQSystem | null = null;

export function getFAQSystem(faqs?: FAQ[]): IntelligentFAQSystem {
  if (!faqSystem) {
    faqSystem = new IntelligentFAQSystem(faqs || []);
  } else if (faqs) {
    // Update FAQs if provided
    faqs.forEach(faq => faqSystem!.addFAQ(faq));
  }
  return faqSystem;
}