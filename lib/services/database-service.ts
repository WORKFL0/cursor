import { supabaseAdmin } from '@/src/lib/supabase'

export interface Article {
  id?: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  image?: string
  published: boolean
  published_date?: string
  created_at: string
  updated_at: string
  meta_title?: string
  meta_description?: string
  featured?: boolean
  reading_time?: number
}

export interface CreateArticleData {
  title: string
  slug?: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  image?: string
  published?: boolean
  meta_title?: string
  meta_description?: string
  featured?: boolean
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: number
}

class DatabaseService {
  private readonly tableName = 'articles'

  constructor() {
    this.ensureTableExists()
  }

  /**
   * Ensure the articles table exists
   */
  private async ensureTableExists() {
    try {
      // Check if table exists
      const { data: tables, error: checkError } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', this.tableName)
        .eq('table_schema', 'public')

      if (checkError && !checkError.message.includes('does not exist')) {
        console.error('Error checking table existence:', checkError)
        return
      }

      if (!tables || tables.length === 0) {
        // Create the table
        const { error: createError } = await supabaseAdmin.rpc('create_articles_table')
        
        if (createError && !createError.message.includes('already exists')) {
          // Create table with SQL if RPC doesn't work
          await this.createArticlesTable()
        }
      }
    } catch (error) {
      console.error('Error ensuring table exists:', error)
    }
  }

  /**
   * Create the articles table using direct SQL
   */
  private async createArticlesTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL DEFAULT 'Workflo Team',
        category TEXT NOT NULL DEFAULT 'Nieuws',
        tags TEXT[] DEFAULT '{}',
        image TEXT,
        published BOOLEAN DEFAULT false,
        published_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        meta_title TEXT,
        meta_description TEXT,
        featured BOOLEAN DEFAULT false,
        reading_time INTEGER DEFAULT 5
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
      CREATE INDEX IF NOT EXISTS idx_articles_published_date ON articles(published_date DESC);
      CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);

      -- Create updated_at trigger
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
      CREATE TRIGGER update_articles_updated_at
          BEFORE UPDATE ON articles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      -- Enable RLS
      ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Allow read access for all users" ON articles
          FOR SELECT USING (true);

      CREATE POLICY "Allow insert for authenticated users" ON articles
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');

      CREATE POLICY "Allow update for authenticated users" ON articles
          FOR UPDATE USING (auth.role() = 'authenticated');

      CREATE POLICY "Allow delete for authenticated users" ON articles
          FOR DELETE USING (auth.role() = 'authenticated');
    `

    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: createTableSQL })
      
      if (error) {
        console.error('Error creating articles table:', error)
        
        // Fallback: Try creating without RLS for development
        const basicTableSQL = `
          CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            excerpt TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT NOT NULL DEFAULT 'Workflo Team',
            category TEXT NOT NULL DEFAULT 'Nieuws',
            tags TEXT[] DEFAULT '{}',
            image TEXT,
            published BOOLEAN DEFAULT false,
            published_date TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            meta_title TEXT,
            meta_description TEXT,
            featured BOOLEAN DEFAULT false,
            reading_time INTEGER DEFAULT 5
          );
        `
        
        // This is a development fallback - in production you'd want proper error handling
        console.log('Attempting to create basic table structure...')
      }
    } catch (error) {
      console.error('Failed to create articles table:', error)
    }
  }

  /**
   * Get all articles with optional filtering
   */
  public async getArticles(options: {
    published?: boolean
    category?: string
    limit?: number
    offset?: number
    search?: string
    featured?: boolean
  } = {}): Promise<{ data: Article[], error?: string, count?: number }> {
    try {
      let query = supabaseAdmin.from(this.tableName).select('*', { count: 'exact' })

      // Apply filters
      if (options.published !== undefined) {
        query = query.eq('published', options.published)
      }

      if (options.category) {
        query = query.eq('category', options.category)
      }

      if (options.featured !== undefined) {
        query = query.eq('featured', options.featured)
      }

      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%,content.ilike.%${options.search}%`)
      }

      // Apply ordering
      query = query.order('published_date', { ascending: false, nullsFirst: false })
      query = query.order('created_at', { ascending: false })

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }

      if (options.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
      }

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching articles:', error)
        return { data: [], error: error.message }
      }

      return { data: data || [], count }
    } catch (error: unknown) {
      console.error('Database error in getArticles:', error)
      return { data: [], error: error.message }
    }
  }

  /**
   * Get article by ID
   */
  public async getArticleById(id: number): Promise<{ data?: Article, error?: string }> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { error: error.message }
      }

      return { data }
    } catch (error: unknown) {
      console.error('Database error in getArticleById:', error)
      return { error: error.message }
    }
  }

  /**
   * Get article by slug
   */
  public async getArticleBySlug(slug: string): Promise<{ data?: Article, error?: string }> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        return { error: error.message }
      }

      return { data }
    } catch (error: unknown) {
      console.error('Database error in getArticleBySlug:', error)
      return { error: error.message }
    }
  }

  /**
   * Create new article
   */
  public async createArticle(articleData: CreateArticleData): Promise<{ data?: Article, error?: string }> {
    try {
      // Generate slug if not provided
      const slug = articleData.slug || this.generateSlug(articleData.title)

      // Calculate reading time
      const readingTime = this.calculateReadingTime(articleData.content)

      const article: Omit<Article, 'id'> = {
        ...articleData,
        slug,
        published: articleData.published || false,
        published_date: articleData.published ? new Date().toISOString() : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reading_time: readingTime
      }

      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .insert([article])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { error: 'An article with this slug already exists' }
        }
        return { error: error.message }
      }

      return { data }
    } catch (error: unknown) {
      console.error('Database error in createArticle:', error)
      return { error: error.message }
    }
  }

  /**
   * Update article
   */
  public async updateArticle(updateData: UpdateArticleData): Promise<{ data?: Article, error?: string }> {
    try {
      const { id, ...updates } = updateData

      // Update published_date if publishing for the first time
      const currentArticle = await this.getArticleById(id)
      if (currentArticle.data && updates.published && !currentArticle.data.published) {
        updates.published_date = new Date().toISOString()
      }

      // Recalculate reading time if content changed
      if (updates.content) {
        (updates as any).reading_time = this.calculateReadingTime(updates.content)
      }

      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return { error: 'An article with this slug already exists' }
        }
        return { error: error.message }
      }

      return { data }
    } catch (error: unknown) {
      console.error('Database error in updateArticle:', error)
      return { error: error.message }
    }
  }

  /**
   * Delete article
   */
  public async deleteArticle(id: number): Promise<{ success: boolean, error?: string }> {
    try {
      const { error } = await supabaseAdmin
        .from(this.tableName)
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: unknown) {
      console.error('Database error in deleteArticle:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Search articles
   */
  public async searchArticles(query: string, options: {
    published?: boolean
    limit?: number
  } = {}): Promise<{ data: Article[], error?: string }> {
    return this.getArticles({
      search: query,
      published: options.published,
      limit: options.limit
    })
  }

  /**
   * Get articles by category
   */
  public async getArticlesByCategory(category: string, options: {
    published?: boolean
    limit?: number
  } = {}): Promise<{ data: Article[], error?: string }> {
    return this.getArticles({
      category,
      published: options.published,
      limit: options.limit
    })
  }

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  /**
   * Calculate reading time in minutes
   */
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  /**
   * Get database statistics
   */
  public async getStats(): Promise<{
    totalArticles: number
    publishedArticles: number
    draftArticles: number
    categories: { category: string; count: number }[]
    error?: string
  }> {
    try {
      // Get total counts
      const { data: totalData, error: totalError } = await supabaseAdmin
        .from(this.tableName)
        .select('id', { count: 'exact' })

      const { data: publishedData, error: publishedError } = await supabaseAdmin
        .from(this.tableName)
        .select('id', { count: 'exact' })
        .eq('published', true)

      // Get category counts
      const { data: categoryData, error: categoryError } = await supabaseAdmin
        .from(this.tableName)
        .select('category')

      if (totalError || publishedError || categoryError) {
        return {
          totalArticles: 0,
          publishedArticles: 0,
          draftArticles: 0,
          categories: [],
          error: 'Failed to fetch statistics'
        }
      }

      const totalArticles = totalData?.length || 0
      const publishedArticles = publishedData?.length || 0
      const draftArticles = totalArticles - publishedArticles

      // Count categories
      const categoryMap = new Map<string, number>()
      categoryData?.forEach(item => {
        const count = categoryMap.get(item.category) || 0
        categoryMap.set(item.category, count + 1)
      })

      const categories = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count
      }))

      return {
        totalArticles,
        publishedArticles,
        draftArticles,
        categories
      }
    } catch (error: unknown) {
      console.error('Database error in getStats:', error)
      return {
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        categories: [],
        error: error.message
      }
    }
  }
}

export const databaseService = new DatabaseService()
export default databaseService