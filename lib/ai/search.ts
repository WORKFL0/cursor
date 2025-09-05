import Fuse from 'fuse.js';
import { getEmbedding, pinecone, AI_CONFIG } from './config';

// Define search result types
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'service' | 'article' | 'faq' | 'page';
  url: string;
  score: number;
  highlight?: string;
}

export interface SearchableContent {
  id: string;
  title: string;
  content: string;
  type: 'service' | 'article' | 'faq' | 'page';
  url: string;
  keywords?: string[];
  metadata?: Record<string, any>;
}

// Fuzzy search configuration
const fuseOptions: any = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'content', weight: 0.3 },
    { name: 'keywords', weight: 0.3 },
  ],
  threshold: AI_CONFIG.search.fuzzyThreshold,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  shouldSort: true,
  findAllMatches: true,
  ignoreLocation: true,
};

// Smart Search Engine class
export class SmartSearchEngine {
  private fuseIndex: Fuse<SearchableContent> | null = null;
  private contentCache: Map<string, SearchableContent> = new Map();
  private embeddingCache: Map<string, number[]> = new Map();

  constructor(private content: SearchableContent[] = []) {
    this.initializeFuseIndex();
  }

  // Initialize Fuse.js index for fuzzy search
  private initializeFuseIndex() {
    if (this.content.length > 0) {
      this.fuseIndex = new Fuse(this.content, fuseOptions);
      this.content.forEach(item => {
        this.contentCache.set(item.id, item);
      });
    }
  }

  // Add content to search index
  public async addContent(content: SearchableContent | SearchableContent[]) {
    const items = Array.isArray(content) ? content : [content];
    
    for (const item of items) {
      this.contentCache.set(item.id, item);
      
      // Store in vector database if available
      if (pinecone) {
        try {
          const embedding = await this.getOrCreateEmbedding(item);
          const index = pinecone.index(AI_CONFIG.vectorDB.indexName);
          
          await index.upsert([{
            id: item.id,
            values: embedding,
            metadata: {
              title: item.title,
              type: item.type,
              url: item.url,
              content: item.content.substring(0, 1000), // Store first 1000 chars
            },
          }]);
        } catch (error) {
          console.error('Error adding to vector database:', error);
        }
      }
    }
    
    // Rebuild Fuse index
    this.content = Array.from(this.contentCache.values());
    this.initializeFuseIndex();
  }

  // Get or create embedding for content
  private async getOrCreateEmbedding(content: SearchableContent): Promise<number[]> {
    const cacheKey = content.id;
    
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey)!;
    }
    
    const text = `${content.title} ${content.content}`.substring(0, 8000);
    const embedding = await getEmbedding(text);
    this.embeddingCache.set(cacheKey, embedding);
    
    return embedding;
  }

  // Perform smart search with both fuzzy and semantic search
  public async search(query: string, options?: {
    limit?: number;
    type?: SearchableContent['type'];
    useSemanticSearch?: boolean;
  }): Promise<SearchResult[]> {
    const limit = options?.limit || 10;
    const useSemanticSearch = options?.useSemanticSearch !== false;
    
    let results: SearchResult[] = [];
    
    // Perform fuzzy search with Fuse.js
    if (this.fuseIndex) {
      const fuseResults = this.fuseIndex.search(query);
      
      results = fuseResults
        .filter(result => !options?.type || result.item.type === options.type)
        .slice(0, limit)
        .map(result => ({
          id: result.item.id,
          title: result.item.title,
          content: result.item.content,
          type: result.item.type,
          url: result.item.url,
          score: 1 - (result.score || 0),
          highlight: this.generateHighlight(result.item.content, query),
        }));
    }
    
    // Perform semantic search with vector database
    if (useSemanticSearch && pinecone) {
      try {
        const queryEmbedding = await getEmbedding(query);
        const index = pinecone.index(AI_CONFIG.vectorDB.indexName);
        
        const vectorResults = await index.query({
          vector: queryEmbedding,
          topK: limit,
          includeMetadata: true,
          filter: options?.type ? { type: { $eq: options.type } } : undefined,
        });
        
        // Merge vector search results with fuzzy search
        const semanticResults: SearchResult[] = vectorResults.matches
          .filter(match => match.score && match.score >= AI_CONFIG.search.minScore)
          .map(match => ({
            id: match.id,
            title: match.metadata?.title as string || '',
            content: match.metadata?.content as string || '',
            type: match.metadata?.type as SearchableContent['type'] || 'page',
            url: match.metadata?.url as string || '',
            score: match.score || 0,
            highlight: this.generateHighlight(match.metadata?.content as string || '', query),
          }));
        
        // Merge and deduplicate results
        results = this.mergeSearchResults(results, semanticResults);
      } catch (error) {
        console.error('Semantic search error:', error);
      }
    }
    
    // Handle typos and provide suggestions
    if (results.length === 0) {
      results = await this.handleTyposAndSuggestions(query, limit);
    }
    
    return results.slice(0, limit);
  }

  // Generate text highlight for search results
  private generateHighlight(content: string, query: string): string {
    const words = query.toLowerCase().split(' ');
    const sentences = content.split('. ');
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (words.some(word => lowerSentence.includes(word))) {
        return sentence.substring(0, 150) + '...';
      }
    }
    
    return content.substring(0, 150) + '...';
  }

  // Merge search results from different sources
  private mergeSearchResults(
    fuzzyResults: SearchResult[],
    semanticResults: SearchResult[]
  ): SearchResult[] {
    const merged = new Map<string, SearchResult>();
    
    // Add fuzzy results with boosted scores
    fuzzyResults.forEach(result => {
      merged.set(result.id, {
        ...result,
        score: result.score * 1.2, // Boost fuzzy match scores
      });
    });
    
    // Add or update with semantic results
    semanticResults.forEach(result => {
      const existing = merged.get(result.id);
      if (existing) {
        // Average the scores if result exists
        merged.set(result.id, {
          ...result,
          score: (existing.score + result.score) / 2,
        });
      } else {
        merged.set(result.id, result);
      }
    });
    
    // Sort by score
    return Array.from(merged.values()).sort((a, b) => b.score - a.score);
  }

  // Handle typos and provide suggestions
  private async handleTyposAndSuggestions(
    query: string,
    limit: number
  ): Promise<SearchResult[]> {
    // Try with common typo corrections
    const corrections = this.generateTypoCorrections(query);
    
    // Also try with normalized query (remove accents, etc.)
    const normalizedQuery = this.normalizeText(query);
    if (normalizedQuery !== query) {
      corrections.push(normalizedQuery);
    }
    
    for (const correction of corrections) {
      // Perform direct fuzzy search to avoid recursion
      if (this.fuseIndex) {
        const fuseResults = this.fuseIndex.search(correction);
        const results = fuseResults
          .slice(0, limit)
          .map(result => ({
            id: result.item.id,
            title: result.item.title,
            content: result.item.content,
            type: result.item.type,
            url: result.item.url,
            score: 1 - (result.score || 0),
            highlight: `Bedoelde je "${correction}"? ${this.generateHighlight(result.item.content, correction)}`,
          }));
        
        if (results.length > 0) {
          return results;
        }
      }
    }
    
    return [];
  }
  
  // Normalize text for better matching (remove accents, etc.)
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Generate common typo corrections (Dutch and English)
  private generateTypoCorrections(query: string): string[] {
    const corrections: string[] = [];
    
    // Common misspellings for IT terms (Dutch and English)
    const commonMisspellings: Record<string, string[]> = {
      // English terms
      'cloud': ['claud', 'cload', 'cloude'],
      'backup': ['bakup', 'backap', 'bakcup'],
      'security': ['securty', 'secruity', 'securety'],
      'microsoft': ['mircosoft', 'microsfot', 'microsft'],
      'managed': ['mangaed', 'managd', 'maneged'],
      'service': ['servise', 'servce', 'serivce'],
      'disaster': ['disater', 'disastor', 'dissaster'],
      'recovery': ['recovry', 'recuvery', 'recoveri'],
      // Dutch terms
      'diensten': ['diesnten', 'dinsten', 'dienste'],
      'beveiliging': ['beveliging', 'beveiligen', 'beveiligng'],
      'ondersteuning': ['onderstuening', 'ondersteuning', 'ondersteunig'],
      'beheer': ['beher', 'beheerd', 'behere'],
      'oplossingen': ['oplosingen', 'oplossinge', 'oplossngen'],
      'telefonie': ['telefone', 'telefoni', 'telefoonie'],
      'werkplek': ['werkplk', 'werkplekk', 'werplek'],
      'netwerk': ['netwrk', 'netwek', 'netwerken'],
    };
    
    const words = query.toLowerCase().split(' ');
    
    for (const word of words) {
      for (const [correct, misspellings] of Object.entries(commonMisspellings)) {
        if (misspellings.includes(word)) {
          corrections.push(query.replace(new RegExp(word, 'gi'), correct));
        }
      }
    }
    
    return corrections;
  }

  // Get search suggestions based on partial input
  public async getSuggestions(partial: string, limit: number = 5): Promise<string[]> {
    if (partial.length < 2) return [];
    
    const suggestions = new Set<string>();
    
    // Get suggestions from content titles
    this.content.forEach(item => {
      if (item.title.toLowerCase().includes(partial.toLowerCase())) {
        suggestions.add(item.title);
      }
    });
    
    // Get suggestions from keywords
    this.content.forEach(item => {
      if (item.keywords) {
        item.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(partial.toLowerCase())) {
            suggestions.add(keyword);
          }
        });
      }
    });
    
    return Array.from(suggestions).slice(0, limit);
  }
}

// Create singleton instance
let searchEngine: SmartSearchEngine | null = null;

export function getSearchEngine(): SmartSearchEngine {
  if (!searchEngine) {
    searchEngine = new SmartSearchEngine();
  }
  return searchEngine;
}