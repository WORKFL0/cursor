/**
 * Supabase Article Service
 * Handles all article CRUD operations with Supabase database
 */

import { createAdminClient } from '@/lib/supabase/client'
import { 
  Article, 
  ArticleInsert, 
  ArticleUpdate, 
  ArticleFilters, 
  ArticleStats,
  PaginatedResponse,
  ApiResponse 
} from '@/lib/types/database'

export class SupabaseArticleService {
  private static supabase = createAdminClient()

  /**
   * Get articles with advanced filtering and pagination
   */
  static async getArticles(filters: ArticleFilters = {}): Promise<PaginatedResponse<Article>> {
    try {
      const {
        published,
        featured,
        category,
        tags = [],
        author,
        search,
        dateFrom,
        dateTo,
        limit = 50,
        offset = 0,
        orderBy = 'created_at',
        orderDirection = 'desc'
      } = filters

      let query = this.supabase
        .from('articles')
        .select(`
          *,
          cms_users!articles_created_by_fkey (
            username,
            first_name,
            last_name
          )
        `, { count: 'exact' })

      // Apply filters
      if (published !== undefined) {
        query = query.eq('published', published)
      }

      if (featured !== undefined) {
        query = query.eq('featured', featured)
      }

      if (category) {
        query = query.eq('category', category)
      }

      if (tags.length > 0) {
        query = query.overlaps('tags', tags)
      }

      if (author) {
        query = query.eq('author', author)
      }

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,` +
          `excerpt.ilike.%${search}%,` +
          `content.ilike.%${search}%,` +
          `author.ilike.%${search}%`
        )
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom)
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo)
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })

      // Apply pagination
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) {
        console.error('Get articles error:', error)
        return {
          success: false,
          data: [],
          count: 0,
          limit,
          offset,
          error: 'Failed to fetch articles'
        }
      }

      return {
        success: true,
        data: data || [],
        count: count || 0,
        limit,
        offset,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: Math.floor(offset / limit) + 1
      }
    } catch (error) {
      console.error('Article service error:', error)
      return {
        success: false,
        data: [],
        count: 0,
        limit,
        offset,
        error: 'Article service error'
      }
    }
  }

  /**
   * Get single article by ID or slug
   */
  static async getArticle(identifier: string, bySlug = false): Promise<ApiResponse<Article>> {
    try {
      let query = this.supabase
        .from('articles')
        .select(`
          *,
          cms_users!articles_created_by_fkey (
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)

      if (bySlug) {
        query = query.eq('slug', identifier)
      } else {
        query = query.eq('id', identifier)
      }

      const { data, error } = await query.single()

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Article not found' }
        }
        console.error('Get article error:', error)
        return { success: false, error: 'Failed to fetch article' }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Get article service error:', error)
      return { success: false, error: 'Article service error' }
    }
  }

  /**
   * Create new article
   */
  static async createArticle(articleData: ArticleInsert, userId?: string): Promise<ApiResponse<Article>> {
    try {
      // Generate slug if not provided
      if (!articleData.slug) {
        articleData.slug = this.generateSlug(articleData.title)
      }

      // Ensure slug is unique
      articleData.slug = await this.ensureUniqueSlug(articleData.slug)

      // Set created_by if user provided
      if (userId) {
        articleData.created_by = userId
        articleData.updated_by = userId
      }

      // Set published_at if publishing
      if (articleData.published && !articleData.published_at) {
        articleData.published_at = new Date().toISOString()
      }

      const { data, error } = await this.supabase
        .from('articles')
        .insert(articleData)
        .select(`
          *,
          cms_users!articles_created_by_fkey (
            username,
            first_name,
            last_name
          )
        `)
        .single()

      if (error) {
        console.error('Create article error:', error)
        if (error.code === '23505') {
          return { success: false, error: 'Article with this slug already exists' }
        }
        return { success: false, error: 'Failed to create article' }
      }

      // Update tag usage counts
      if (articleData.tags && articleData.tags.length > 0) {
        await this.updateTagUsageCounts([], articleData.tags)
      }

      return { success: true, data }
    } catch (error) {
      console.error('Create article service error:', error)
      return { success: false, error: 'Article service error' }
    }
  }

  /**
   * Update existing article
   */
  static async updateArticle(
    articleId: string, 
    updateData: ArticleUpdate, 
    userId?: string
  ): Promise<ApiResponse<Article>> {
    try {
      // Get current article for comparison
      const currentArticle = await this.getArticle(articleId)
      if (!currentArticle.success || !currentArticle.data) {
        return { success: false, error: 'Article not found' }
      }

      const oldTags = currentArticle.data.tags || []

      // Update modified fields
      if (userId) {
        updateData.updated_by = userId
      }

      // Handle publishing
      if (updateData.published && !currentArticle.data.published) {
        updateData.published_at = new Date().toISOString()
      } else if (updateData.published === false) {
        updateData.published_at = null
      }

      // Generate new slug if title changed
      if (updateData.title && updateData.title !== currentArticle.data.title) {
        if (!updateData.slug) {
          updateData.slug = this.generateSlug(updateData.title)
        }
        updateData.slug = await this.ensureUniqueSlug(updateData.slug, articleId)
      }

      const { data, error } = await this.supabase
        .from('articles')
        .update(updateData)
        .eq('id', articleId)
        .select(`
          *,
          cms_users!articles_created_by_fkey (
            username,
            first_name,
            last_name
          )
        `)
        .single()

      if (error) {
        console.error('Update article error:', error)
        if (error.code === '23505') {
          return { success: false, error: 'Article with this slug already exists' }
        }
        return { success: false, error: 'Failed to update article' }
      }

      // Update tag usage counts if tags changed
      const newTags = updateData.tags || oldTags
      if (JSON.stringify(oldTags.sort()) !== JSON.stringify(newTags.sort())) {
        await this.updateTagUsageCounts(oldTags, newTags)
      }

      return { success: true, data }
    } catch (error) {
      console.error('Update article service error:', error)
      return { success: false, error: 'Article service error' }
    }
  }

  /**
   * Delete article
   */
  static async deleteArticle(articleId: string): Promise<ApiResponse<null>> {
    try {
      // Get article for tag cleanup
      const articleResult = await this.getArticle(articleId)
      const tags = articleResult.data?.tags || []

      const { error } = await this.supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

      if (error) {
        console.error('Delete article error:', error)
        return { success: false, error: 'Failed to delete article' }
      }

      // Update tag usage counts
      if (tags.length > 0) {
        await this.updateTagUsageCounts(tags, [])
      }

      return { success: true, data: null, message: 'Article deleted successfully' }
    } catch (error) {
      console.error('Delete article service error:', error)
      return { success: false, error: 'Article service error' }
    }
  }

  /**
   * Get article statistics
   */
  static async getArticleStats(): Promise<ApiResponse<ArticleStats>> {
    try {
      // Get total counts
      const [totalResult, publishedResult, draftsResult, featuredResult] = await Promise.all([
        this.supabase.from('articles').select('id', { count: 'exact', head: true }),
        this.supabase.from('articles').select('id', { count: 'exact', head: true }).eq('published', true),
        this.supabase.from('articles').select('id', { count: 'exact', head: true }).eq('published', false),
        this.supabase.from('articles').select('id', { count: 'exact', head: true }).eq('featured', true)
      ])

      // Get category breakdown
      const { data: categoryData } = await this.supabase
        .from('articles')
        .select('category')
        
      const byCategory: Record<string, number> = {}
      categoryData?.forEach(article => {
        const category = article.category || 'Uncategorized'
        byCategory[category] = (byCategory[category] || 0) + 1
      })

      // Get author breakdown
      const { data: authorData } = await this.supabase
        .from('articles')
        .select('author')
        
      const byAuthor: Record<string, number> = {}
      authorData?.forEach(article => {
        const author = article.author || 'Unknown'
        byAuthor[author] = (byAuthor[author] || 0) + 1
      })

      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data: recentData } = await this.supabase
        .from('articles')
        .select('created_at, published_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        
      const recentActivity: { date: string; created: number; published: number }[] = []
      const activityMap: Record<string, { created: number; published: number }> = {}
      
      recentData?.forEach(article => {
        const createdDate = new Date(article.created_at).toDateString()
        if (!activityMap[createdDate]) {
          activityMap[createdDate] = { created: 0, published: 0 }
        }
        activityMap[createdDate].created++
        
        if (article.published_at) {
          const publishedDate = new Date(article.published_at).toDateString()
          if (!activityMap[publishedDate]) {
            activityMap[publishedDate] = { created: 0, published: 0 }
          }
          activityMap[publishedDate].published++
        }
      })

      Object.entries(activityMap).forEach(([date, counts]) => {
        recentActivity.push({ date, ...counts })
      })

      const stats: ArticleStats = {
        total: totalResult.count || 0,
        published: publishedResult.count || 0,
        drafts: draftsResult.count || 0,
        featured: featuredResult.count || 0,
        byCategory,
        byAuthor,
        recentActivity: recentActivity.slice(0, 30)
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Get article stats error:', error)
      return { success: false, error: 'Failed to get article statistics' }
    }
  }

  /**
   * Search articles using full-text search
   */
  static async searchArticles(
    query: string,
    limit = 10,
    offset = 0,
    publishedOnly = true
  ): Promise<PaginatedResponse<Article>> {
    try {
      let dbQuery = this.supabase.rpc('search_articles', {
        search_query: query,
        limit_count: limit,
        offset_count: offset
      })

      const { data, error } = await dbQuery

      if (error) {
        console.error('Search articles error:', error)
        return {
          success: false,
          data: [],
          count: 0,
          limit,
          offset,
          error: 'Search failed'
        }
      }

      return {
        success: true,
        data: data || [],
        count: data?.length || 0,
        limit,
        offset
      }
    } catch (error) {
      console.error('Search service error:', error)
      return {
        success: false,
        data: [],
        count: 0,
        limit,
        offset,
        error: 'Search service error'
      }
    }
  }

  /**
   * Increment article view count
   */
  static async incrementViews(articleId: string): Promise<void> {
    try {
      await this.supabase
        .from('articles')
        .update({ views_count: this.supabase.sql`views_count + 1` })
        .eq('id', articleId)
    } catch (error) {
      console.error('Increment views error:', error)
      // Don't throw - view tracking shouldn't break the main flow
    }
  }

  /**
   * Get categories with article counts
   */
  static async getCategories(): Promise<ApiResponse<Array<{ name: string; count: number }>>> {
    try {
      const { data, error } = await this.supabase
        .from('article_categories')
        .select(`
          name,
          name_nl,
          description,
          color,
          sort_order
        `)
        .eq('is_active', true)
        .order('sort_order')

      if (error) {
        console.error('Get categories error:', error)
        return { success: false, error: 'Failed to fetch categories' }
      }

      // Get article counts for each category
      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await this.supabase
            .from('articles')
            .select('id', { count: 'exact', head: true })
            .eq('category', category.name)
            .eq('published', true)

          return {
            ...category,
            count: count || 0
          }
        })
      )

      return { success: true, data: categoriesWithCounts }
    } catch (error) {
      console.error('Get categories service error:', error)
      return { success: false, error: 'Categories service error' }
    }
  }

  /**
   * Generate URL-friendly slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50)
  }

  /**
   * Ensure slug is unique by appending number if needed
   */
  private static async ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
    try {
      let uniqueSlug = slug
      let counter = 1

      while (true) {
        let query = this.supabase
          .from('articles')
          .select('id')
          .eq('slug', uniqueSlug)

        if (excludeId) {
          query = query.neq('id', excludeId)
        }

        const { data, error } = await query.limit(1)

        if (error) {
          console.error('Check slug uniqueness error:', error)
          return uniqueSlug // Return as-is on error
        }

        if (!data || data.length === 0) {
          return uniqueSlug // Slug is unique
        }

        // Slug exists, try with counter
        uniqueSlug = `${slug}-${counter}`
        counter++

        // Prevent infinite loop
        if (counter > 100) {
          uniqueSlug = `${slug}-${Date.now()}`
          break
        }
      }

      return uniqueSlug
    } catch (error) {
      console.error('Ensure unique slug error:', error)
      return `${slug}-${Date.now()}` // Fallback
    }
  }

  /**
   * Update tag usage counts
   */
  private static async updateTagUsageCounts(oldTags: string[], newTags: string[]): Promise<void> {
    try {
      // Tags to decrement
      const tagsToDecrement = oldTags.filter(tag => !newTags.includes(tag))
      
      // Tags to increment
      const tagsToIncrement = newTags.filter(tag => !oldTags.includes(tag))

      // Process decrements
      for (const tag of tagsToDecrement) {
        await this.supabase.rpc('decrement_tag_usage', { tag_name: tag })
      }

      // Process increments
      for (const tag of tagsToIncrement) {
        // Create tag if it doesn't exist
        await this.supabase
          .from('article_tags')
          .upsert(
            { name: tag, usage_count: 0 },
            { onConflict: 'name', ignoreDuplicates: true }
          )

        await this.supabase.rpc('increment_tag_usage', { tag_name: tag })
      }
    } catch (error) {
      console.error('Update tag usage counts error:', error)
      // Don't throw - tag counting shouldn't break the main flow
    }
  }
}

export default SupabaseArticleService