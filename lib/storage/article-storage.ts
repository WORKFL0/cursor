/**
 * Local storage manager for articles when Supabase is not configured
 * Provides persistent storage using localStorage
 */

export interface StoredArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags?: string[]
  published: boolean
  featured?: boolean
  image?: string
  published_at?: string
  created_at: string
  updated_at: string
}

const STORAGE_KEY = 'workflo_cms_articles'

export class ArticleStorage {
  static getArticles(): StoredArticle[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      
      const articles = JSON.parse(stored)
      // Sort by created_at descending
      return articles.sort((a: StoredArticle, b: StoredArticle) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } catch (error) {
      console.error('Error reading articles from localStorage:', error)
      return []
    }
  }
  
  static saveArticle(article: Omit<StoredArticle, 'id' | 'created_at' | 'updated_at'>): StoredArticle {
    const articles = this.getArticles()
    
    const newArticle: StoredArticle = {
      ...article,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: article.published ? new Date().toISOString() : undefined
    }
    
    articles.unshift(newArticle)
    this.saveToStorage(articles)
    
    return newArticle
  }
  
  static updateArticle(id: string, updates: Partial<StoredArticle>): StoredArticle | null {
    const articles = this.getArticles()
    const index = articles.findIndex(a => a.id === id)
    
    if (index === -1) return null
    
    const existingArticle = articles[index]
    if (!existingArticle) return null
    
    const updatedArticle = {
      ...existingArticle,
      ...updates,
      id: existingArticle.id, // Prevent ID from being changed
      created_at: existingArticle.created_at, // Preserve original created date
      updated_at: new Date().toISOString()
    }
    
    // Update published_at if publication status changes
    if (updates.published && !existingArticle.published) {
      updatedArticle.published_at = new Date().toISOString()
    } else if (updates.published === false) {
      updatedArticle.published_at = undefined
    }
    
    articles[index] = updatedArticle
    this.saveToStorage(articles)
    
    return updatedArticle
  }
  
  static deleteArticle(id: string): boolean {
    const articles = this.getArticles()
    const filteredArticles = articles.filter(a => a.id !== id)
    
    if (articles.length === filteredArticles.length) return false
    
    this.saveToStorage(filteredArticles)
    return true
  }
  
  static searchArticles(params: {
    published?: boolean
    category?: string
    featured?: boolean
    search?: string
    limit?: number
    offset?: number
  }): { articles: StoredArticle[], count: number } {
    let articles = this.getArticles()
    
    // Apply filters
    if (params.published !== undefined) {
      articles = articles.filter(a => a.published === params.published)
    }
    
    if (params.category) {
      articles = articles.filter(a => a.category === params.category)
    }
    
    if (params.featured !== undefined) {
      articles = articles.filter(a => a.featured === params.featured)
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        a.excerpt.toLowerCase().includes(searchLower) ||
        a.content.toLowerCase().includes(searchLower)
      )
    }
    
    const count = articles.length
    
    // Apply pagination
    const offset = params.offset || 0
    const limit = params.limit || 50
    articles = articles.slice(offset, offset + limit)
    
    return { articles, count }
  }
  
  private static saveToStorage(articles: StoredArticle[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    } catch (error) {
      console.error('Error saving articles to localStorage:', error)
    }
  }
  
  static clearAll(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  }
}