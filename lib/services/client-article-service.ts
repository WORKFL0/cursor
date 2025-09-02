/**
 * Client-side article service for localStorage operations
 * This runs in the browser and can directly access localStorage
 */

import { Article } from '@/lib/supabase/client'

const STORAGE_KEY = 'workflo_cms_articles'

export interface ClientArticle extends Omit<Article, 'id'> {
  id: string
}

export class ClientArticleService {
  static getArticles(): ClientArticle[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      
      const articles = JSON.parse(stored)
      return articles.sort((a: ClientArticle, b: ClientArticle) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      )
    } catch (error) {
      console.error('Error reading articles from localStorage:', error)
      return []
    }
  }
  
  static saveArticle(article: Omit<ClientArticle, 'id' | 'created_at' | 'updated_at'>): ClientArticle {
    const articles = this.getArticles()
    
    const newArticle: ClientArticle = {
      ...article,
      id: 'local_' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: article.published ? new Date().toISOString() : undefined
    }
    
    articles.unshift(newArticle)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    
    // Trigger storage event for other tabs/windows
    window.dispatchEvent(new Event('storage'))
    
    return newArticle
  }
  
  static updateArticle(id: string, updates: Partial<ClientArticle>): ClientArticle | null {
    const articles = this.getArticles()
    const index = articles.findIndex(a => a.id === id)
    
    if (index === -1) return null
    
    const updatedArticle = {
      ...articles[index],
      ...updates,
      id: articles[index].id,
      created_at: articles[index].created_at,
      updated_at: new Date().toISOString()
    }
    
    if (updates.published && !articles[index].published) {
      updatedArticle.published_at = new Date().toISOString()
    } else if (updates.published === false) {
      updatedArticle.published_at = undefined
    }
    
    articles[index] = updatedArticle
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'))
    
    return updatedArticle
  }
  
  static deleteArticle(id: string): boolean {
    const articles = this.getArticles()
    const filteredArticles = articles.filter(a => a.id !== id)
    
    if (articles.length === filteredArticles.length) return false
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredArticles))
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'))
    
    return true
  }
  
  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event('storage'))
  }
}