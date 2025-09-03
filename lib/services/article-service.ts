/**
 * Article Service - Handles CRUD operations for articles
 * Provides database integration with fallback to localStorage
 */

import { supabase, isSupabaseConfigured, Article } from '@/lib/supabase/client'
import { ArticleStorage, StoredArticle } from '@/lib/storage/article-storage'

export interface ArticleFilters {
  published?: boolean
  category?: string
  featured?: boolean
  search?: string
  limit?: number
  offset?: number
}

export interface ArticleResponse {
  articles: Article[]
  count: number
  success: boolean
  useClientStorage?: boolean
  warning?: string
}

export class ArticleService {
  /**
   * Fetch articles with optional filters
   */
  static async getArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
    const { published, category, featured, search, limit = 50, offset = 0 } = filters

    // Try Supabase first
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('articles')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })

        // Apply filters
        if (published !== undefined) {
          query = query.eq('published', published)
        }
        if (category) {
          query = query.eq('category', category)
        }
        if (featured !== undefined) {
          query = query.eq('featured', featured)
        }
        if (search) {
          query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
        }

        // Apply pagination
        query = query.range(offset, offset + limit - 1)

        const { data, error, count } = await query

        if (error) {
          console.error('Supabase error in getArticles:', error)
          throw error
        }

        return {
          articles: data || [],
          count: count || 0,
          success: true
        }
      } catch (error) {
        console.error('Error fetching from Supabase, falling back to localStorage:', error)
        return this.getArticlesFromStorage(filters)
      }
    }

    // Fall back to localStorage
    return this.getArticlesFromStorage(filters)
  }

  /**
   * Create a new article
   */
  static async createArticle(articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<ArticleResponse> {
    // Generate slug if not provided
    if (!articleData.slug && articleData.title) {
      articleData.slug = this.generateSlug(articleData.title)
    }

    // Try Supabase first
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase
          .from('articles') as any)
          .insert([{
            ...articleData,
            published_at: articleData.published ? new Date().toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (error) {
          console.error('Supabase error in createArticle:', error)
          throw error
        }

        return {
          articles: [data],
          count: 1,
          success: true
        }
      } catch (error) {
        console.error('Error creating in Supabase, falling back to localStorage:', error)
        return this.createArticleInStorage(articleData)
      }
    }

    // Fall back to localStorage
    return this.createArticleInStorage(articleData)
  }

  /**
   * Update an existing article
   */
  static async updateArticle(id: string, updates: Partial<Article>): Promise<ArticleResponse> {
    if (!id) {
      return {
        articles: [],
        count: 0,
        success: false,
        warning: 'Article ID is required'
      }
    }

    // Try Supabase first
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData = {
          ...updates,
          updated_at: new Date().toISOString()
        }

        // Update published_at if publication status changes
        if (updates.published !== undefined) {
          updateData.published_at = updates.published ? new Date().toISOString() : null
        }

        const { data, error } = await (supabase
          .from('articles') as any)
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Supabase error in updateArticle:', error)
          throw error
        }

        return {
          articles: [data],
          count: 1,
          success: true
        }
      } catch (error) {
        console.error('Error updating in Supabase, falling back to localStorage:', error)
        return this.updateArticleInStorage(id, updates)
      }
    }

    // Fall back to localStorage
    return this.updateArticleInStorage(id, updates)
  }

  /**
   * Delete an article
   */
  static async deleteArticle(id: string): Promise<{ success: boolean; useClientStorage?: boolean; warning?: string }> {
    if (!id) {
      return {
        success: false,
        warning: 'Article ID is required'
      }
    }

    // Try Supabase first
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await (supabase
          .from('articles') as any)
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Supabase error in deleteArticle:', error)
          throw error
        }

        return { success: true }
      } catch (error) {
        console.error('Error deleting from Supabase, falling back to localStorage:', error)
        return this.deleteArticleFromStorage(id)
      }
    }

    // Fall back to localStorage
    return this.deleteArticleFromStorage(id)
  }

  // Private helper methods for localStorage fallback

  private static getArticlesFromStorage(filters: ArticleFilters): ArticleResponse {
    try {
      const result = ArticleStorage.searchArticles(filters)
      return {
        articles: result.articles as any[], // Type conversion needed
        count: result.count,
        success: true,
        useClientStorage: true,
        warning: 'Using browser localStorage - articles will not persist between devices'
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return {
        articles: [],
        count: 0,
        success: false,
        warning: 'Failed to load articles from storage'
      }
    }
  }

  private static createArticleInStorage(articleData: Omit<Article, 'id' | 'created_at' | 'updated_at'>): ArticleResponse {
    try {
      const storedArticle = ArticleStorage.saveArticle({
        title: articleData.title || '',
        slug: articleData.slug || this.generateSlug(articleData.title || ''),
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        author: articleData.author || 'Workflo Team',
        category: articleData.category || 'Nieuws',
        tags: articleData.tags || [],
        published: articleData.published || false,
        featured: articleData.featured || false,
        image: (articleData as any).image
      })

      return {
        articles: [storedArticle as any], // Type conversion needed
        count: 1,
        success: true,
        useClientStorage: true,
        warning: 'Article saved in browser localStorage - will not persist between devices'
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return {
        articles: [],
        count: 0,
        success: false,
        warning: 'Failed to save article to storage'
      }
    }
  }

  private static updateArticleInStorage(id: string, updates: Partial<Article>): ArticleResponse {
    try {
      const updatedArticle = ArticleStorage.updateArticle(id, updates as any)

      if (!updatedArticle) {
        return {
          articles: [],
          count: 0,
          success: false,
          warning: 'Article not found in storage'
        }
      }

      return {
        articles: [updatedArticle as any], // Type conversion needed
        count: 1,
        success: true,
        useClientStorage: true,
        warning: 'Article updated in browser localStorage - changes will not persist between devices'
      }
    } catch (error) {
      console.error('Error updating localStorage:', error)
      return {
        articles: [],
        count: 0,
        success: false,
        warning: 'Failed to update article in storage'
      }
    }
  }

  private static deleteArticleFromStorage(id: string): { success: boolean; useClientStorage?: boolean; warning?: string } {
    try {
      const success = ArticleStorage.deleteArticle(id)

      return {
        success,
        useClientStorage: true,
        warning: success 
          ? 'Article deleted from browser localStorage'
          : 'Article not found in storage'
      }
    } catch (error) {
      console.error('Error deleting from localStorage:', error)
      return {
        success: false,
        warning: 'Failed to delete article from storage'
      }
    }
  }

  /**
   * Generate a URL-friendly slug from a title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: 'Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
      }
    }

    try {
      const { data, error } = await (supabase
        .from('articles') as any)
        .select('count', { count: 'exact', head: true })
        .limit(1)

      if (error) {
        throw error
      }

      return {
        success: true,
        message: 'Database connection successful',
        details: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
          tableExists: true,
          recordCount: data?.length || 0
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Database connection failed: ${error.message}`,
        details: {
          error: error.message,
          code: error.code,
          hint: error.hint
        }
      }
    }
  }
}