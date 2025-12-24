/**
 * Blog API Functions
 *
 * Server-side functions for blog CRUD operations
 */

import { supabase, getServerSupabaseClient } from '@/lib/supabase'
import type {
  BlogPost,
  BlogCategory,
  BlogAuthor,
  BlogMedia,
  BlogTag,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  BlogPostFilters,
  BlogPostsResponse,
  BlogPostWithRelations,
} from '@/types/blog'

// ============================================================================
// ERROR HANDLING
// ============================================================================

function isSupabaseSchemaError(error: any): boolean {
  return error?.code === 'PGRST205' || error?.message?.includes('schema cache')
}

function logBlogAPIError(context: string, error: any) {
  if (isSupabaseSchemaError(error)) {
    console.warn(`[Blog API] Schema cache error in ${context}. Tables may not be loaded yet.`)
    console.warn('Run this SQL in Supabase: NOTIFY pgrst, \'reload schema\';')
  } else {
    console.error(`[Blog API] Error in ${context}:`, error)
  }
}

// ============================================================================
// BLOG POSTS
// ============================================================================

/**
 * Get all published blog posts (public)
 */
export async function getPublishedPosts(filters: BlogPostFilters = {}): Promise<BlogPostsResponse> {
  const {
    category_id,
    tags,
    search,
    limit = 10,
    offset = 0,
  } = filters

  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `, { count: 'exact' })
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })

    if (category_id) {
      query = query.eq('category_id', category_id)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      logBlogAPIError('getPublishedPosts', error)
      return {
        posts: [],
        total: 0,
        page: 1,
        limit,
        hasMore: false,
      }
    }

    return {
      posts: (data as unknown as BlogPostWithRelations[]) || [],
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: (count || 0) > offset + limit,
    }
  } catch (err) {
    logBlogAPIError('getPublishedPosts (catch)', err)
    return {
      posts: [],
      total: 0,
      page: 1,
      limit,
      hasMore: false,
    }
  }
}

/**
 * Get single published post by slug (public)
 */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      logBlogAPIError(`getPublishedPostBySlug("${slug}")`, error)
      return null
    }

    // Increment view count
    await incrementViewCount(data.id)

    return data as unknown as BlogPostWithRelations
  } catch (err) {
    logBlogAPIError(`getPublishedPostBySlug("${slug}") (catch)`, err)
    return null
  }
}

/**
 * Get all posts (admin - includes drafts)
 */
export async function getAllPosts(filters: BlogPostFilters = {}): Promise<BlogPostsResponse> {
  const serverClient = getServerSupabaseClient()
  const {
    status,
    category_id,
    author_id,
    tags,
    search,
    limit = 10,
    offset = 0,
  } = filters

  let query = serverClient
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (category_id) {
    query = query.eq('category_id', category_id)
  }

  if (author_id) {
    query = query.eq('author_id', author_id)
  }

  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  return {
    posts: (data as unknown as BlogPostWithRelations[]) || [],
    total: count || 0,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: (count || 0) > offset + limit,
  }
}

/**
 * Get post by ID (admin)
 */
export async function getPostById(id: string): Promise<BlogPostWithRelations | null> {
  const serverClient = getServerSupabaseClient()

  const { data, error } = await serverClient
    .from('blog_posts')
    .select(`
      *,
      author:blog_authors(*),
      category:blog_categories(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as unknown as BlogPostWithRelations
}

/**
 * Create new blog post
 */
export async function createPost(input: CreateBlogPostInput): Promise<BlogPost> {
  const serverClient = getServerSupabaseClient()

  // Generate slug if not provided
  const slug = input.slug || generateSlug(input.title)

  const { data, error } = await serverClient
    .from('blog_posts')
    .insert([{ ...input, slug }])
    .select()
    .single()

  if (error) throw error

  return data as BlogPost
}

/**
 * Update blog post
 */
export async function updatePost(input: UpdateBlogPostInput): Promise<BlogPost> {
  const serverClient = getServerSupabaseClient()
  const { id, ...updateData } = input

  const { data, error } = await serverClient
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data as BlogPost
}

/**
 * Delete blog post
 */
export async function deletePost(id: string): Promise<void> {
  const serverClient = getServerSupabaseClient()

  const { error } = await serverClient
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Publish post (change status to published)
 */
export async function publishPost(id: string): Promise<BlogPost> {
  return updatePost({
    id,
    status: 'published',
    published_at: new Date().toISOString(),
  })
}

/**
 * Increment view count
 */
async function incrementViewCount(id: string): Promise<void> {
  const serverClient = getServerSupabaseClient()

  try {
    // First, get the current view count
    const { data: post } = await serverClient
      .from('blog_posts')
      .select('view_count')
      .eq('id', id)
      .single()

    if (!post) return

    // Then increment it
    await serverClient
      .from('blog_posts')
      .update({
        view_count: (post.view_count || 0) + 1,
        last_viewed_at: new Date().toISOString(),
      })
      .eq('id', id)
  } catch (err) {
    // Silently fail - view count is not critical
    console.error('[Blog API] Failed to increment view count:', err)
  }
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Get all categories
 */
export async function getCategories(): Promise<BlogCategory[]> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) {
      logBlogAPIError('getCategories', error)
      return []
    }

    return data as BlogCategory[]
  } catch (err) {
    logBlogAPIError('getCategories (catch)', err)
    return []
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data as BlogCategory
}

// ============================================================================
// AUTHORS
// ============================================================================

/**
 * Get all authors
 */
export async function getAuthors(): Promise<BlogAuthor[]> {
  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .eq('is_active', true)
    .order('display_name')

  if (error) throw error

  return data as BlogAuthor[]
}

// ============================================================================
// TAGS
// ============================================================================

/**
 * Get all tags
 */
export async function getTags(): Promise<BlogTag[]> {
  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('usage_count', { ascending: false })

  if (error) throw error

  return data as BlogTag[]
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Calculate estimated read time
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}
