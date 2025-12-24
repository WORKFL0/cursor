/**
 * Blog CMS Types
 *
 * TypeScript types for the blog content management system
 */

export type BlogPostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export type MediaType = 'image' | 'video' | 'document'

export type AuthorRole = 'author' | 'editor' | 'admin'

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string | null
  created_at: string
  updated_at: string
}

export interface BlogAuthor {
  id: string
  email: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  linkedin_url: string | null
  role: AuthorRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string

  // Content
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null

  // Relations
  author_id: string | null
  author?: BlogAuthor
  category_id: string | null
  category?: BlogCategory

  // Status
  status: BlogPostStatus
  published_at: string | null
  scheduled_for: string | null

  // SEO
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null

  // Organization
  tags: string[]
  read_time_minutes: number | null
  view_count: number

  // Multi-channel publishing
  publish_to_linkedin: boolean
  linkedin_post_id: string | null
  linkedin_posted_at: string | null

  publish_to_email: boolean
  email_campaign_id: string | null
  email_sent_at: string | null

  // Timestamps
  created_at: string
  updated_at: string
  last_viewed_at: string | null
}

export interface BlogMedia {
  id: string
  filename: string
  original_filename: string
  url: string
  storage_path: string
  type: MediaType
  mime_type: string | null
  size_bytes: number | null
  width: number | null
  height: number | null
  alt_text: string | null
  caption: string | null
  uploaded_by: string | null
  created_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  usage_count: number
  created_at: string
}

// Form types for creating/updating
export interface CreateBlogPostInput {
  title: string
  slug?: string
  excerpt?: string
  content: string
  featured_image?: string
  author_id?: string
  category_id?: string
  status?: BlogPostStatus
  published_at?: string
  scheduled_for?: string
  meta_title?: string
  meta_description?: string
  canonical_url?: string
  tags?: string[]
  publish_to_linkedin?: boolean
  publish_to_email?: boolean
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string
}

export interface BlogPostFilters {
  status?: BlogPostStatus
  category_id?: string
  author_id?: string
  tags?: string[]
  search?: string
  limit?: number
  offset?: number
}

// API Response types
export interface BlogPostsResponse {
  posts: BlogPost[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface BlogPostWithRelations extends BlogPost {
  author: BlogAuthor
  category: BlogCategory
}
