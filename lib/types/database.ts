// Generated Supabase Database Types
// This file contains TypeScript definitions for the database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'editor' | 'viewer'
export type ArticleSource = 'cms' | 'rss' | 'linkedin' | 'external'

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          title_nl: string | null
          slug: string
          excerpt: string | null
          excerpt_nl: string | null
          content: string | null
          content_nl: string | null
          author: string
          category: string
          tags: string[]
          image_url: string | null
          featured_image_alt: string | null
          published: boolean
          featured: boolean
          source: ArticleSource
          external_url: string | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          views_count: number
          likes_count: number
          shares_count: number
          published_at: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          title_nl?: string | null
          slug: string
          excerpt?: string | null
          excerpt_nl?: string | null
          content?: string | null
          content_nl?: string | null
          author?: string
          category?: string
          tags?: string[]
          image_url?: string | null
          featured_image_alt?: string | null
          published?: boolean
          featured?: boolean
          source?: ArticleSource
          external_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          views_count?: number
          likes_count?: number
          shares_count?: number
          published_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_nl?: string | null
          slug?: string
          excerpt?: string | null
          excerpt_nl?: string | null
          content?: string | null
          content_nl?: string | null
          author?: string
          category?: string
          tags?: string[]
          image_url?: string | null
          featured_image_alt?: string | null
          published?: boolean
          featured?: boolean
          source?: ArticleSource
          external_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          views_count?: number
          likes_count?: number
          shares_count?: number
          published_at?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cms_users: {
        Row: {
          id: string
          email: string
          username: string
          password_hash: string
          role: UserRole
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          is_active: boolean
          last_login_at: string | null
          password_changed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          password_hash: string
          role?: UserRole
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login_at?: string | null
          password_changed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          password_hash?: string
          role?: UserRole
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login_at?: string | null
          password_changed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      article_categories: {
        Row: {
          id: string
          name: string
          name_nl: string | null
          description: string | null
          color: string
          icon: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_nl?: string | null
          description?: string | null
          color?: string
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_nl?: string | null
          description?: string | null
          color?: string
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      article_tags: {
        Row: {
          id: string
          name: string
          name_nl: string | null
          description: string | null
          color: string
          usage_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_nl?: string | null
          description?: string | null
          color?: string
          usage_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_nl?: string | null
          description?: string | null
          color?: string
          usage_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      media_files: {
        Row: {
          id: string
          filename: string
          original_name: string
          file_path: string
          file_url: string
          file_type: string
          file_size: number
          mime_type: string
          alt_text: string | null
          caption: string | null
          width: number | null
          height: number | null
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_name: string
          file_path: string
          file_url: string
          file_type: string
          file_size: number
          mime_type: string
          alt_text?: string | null
          caption?: string | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_name?: string
          file_path?: string
          file_url?: string
          file_type?: string
          file_size?: number
          mime_type?: string
          alt_text?: string | null
          caption?: string | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rss_feeds: {
        Row: {
          id: string
          name: string
          feed_url: string
          description: string | null
          website_url: string | null
          is_active: boolean
          last_fetched_at: string | null
          fetch_frequency_hours: number
          auto_import: boolean
          category_mapping: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          feed_url: string
          description?: string | null
          website_url?: string | null
          is_active?: boolean
          last_fetched_at?: string | null
          fetch_frequency_hours?: number
          auto_import?: boolean
          category_mapping?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          feed_url?: string
          description?: string | null
          website_url?: string | null
          is_active?: boolean
          last_fetched_at?: string | null
          fetch_frequency_hours?: number
          auto_import?: boolean
          category_mapping?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rss_items: {
        Row: {
          id: string
          feed_id: string
          guid: string
          title: string
          description: string | null
          content: string | null
          link: string | null
          author: string | null
          pub_date: string | null
          imported_at: string
          synced_to_articles: boolean
          article_id: string | null
        }
        Insert: {
          id?: string
          feed_id: string
          guid: string
          title: string
          description?: string | null
          content?: string | null
          link?: string | null
          author?: string | null
          pub_date?: string | null
          imported_at?: string
          synced_to_articles?: boolean
          article_id?: string | null
        }
        Update: {
          id?: string
          feed_id?: string
          guid?: string
          title?: string
          description?: string | null
          content?: string | null
          link?: string | null
          author?: string | null
          pub_date?: string | null
          imported_at?: string
          synced_to_articles?: boolean
          article_id?: string | null
        }
      }
      linkedin_posts: {
        Row: {
          id: string
          post_id: string
          author: string
          content: string
          url: string
          likes: number
          comments: number
          shares: number
          published_at: string | null
          imported_at: string
          synced_to_articles: boolean
          article_id: string | null
        }
        Insert: {
          id?: string
          post_id: string
          author: string
          content: string
          url: string
          likes?: number
          comments?: number
          shares?: number
          published_at?: string | null
          imported_at?: string
          synced_to_articles?: boolean
          article_id?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          author?: string
          content?: string
          url?: string
          likes?: number
          comments?: number
          shares?: number
          published_at?: string | null
          imported_at?: string
          synced_to_articles?: boolean
          article_id?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          expires_at: string
          ip_address: string | null
          user_agent: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          expires_at: string
          ip_address?: string | null
          user_agent?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          expires_at?: string
          ip_address?: string | null
          user_agent?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_articles: {
        Args: {
          search_query: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          excerpt: string
          slug: string
          category: string
          author: string
          published_at: string | null
          rank: number
        }[]
      }
      get_article_analytics: {
        Args: {
          article_uuid: string
        }
        Returns: Json
      }
      increment_tag_usage: {
        Args: {
          tag_name: string
        }
        Returns: void
      }
      decrement_tag_usage: {
        Args: {
          tag_name: string
        }
        Returns: void
      }
    }
    Enums: {
      article_source: ArticleSource
      user_role: UserRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Article = Database['public']['Tables']['articles']['Row']
export type ArticleInsert = Database['public']['Tables']['articles']['Insert']
export type ArticleUpdate = Database['public']['Tables']['articles']['Update']

export type CMSUser = Database['public']['Tables']['cms_users']['Row']
export type CMSUserInsert = Database['public']['Tables']['cms_users']['Insert']
export type CMSUserUpdate = Database['public']['Tables']['cms_users']['Update']

export type ArticleCategory = Database['public']['Tables']['article_categories']['Row']
export type ArticleTag = Database['public']['Tables']['article_tags']['Row']
export type MediaFile = Database['public']['Tables']['media_files']['Row']
export type RSSFeed = Database['public']['Tables']['rss_feeds']['Row']
export type RSSItem = Database['public']['Tables']['rss_items']['Row']
export type LinkedInPost = Database['public']['Tables']['linkedin_posts']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type UserSession = Database['public']['Tables']['user_sessions']['Row']

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data?: T[]
  error?: string
  message?: string
  count?: number
  limit?: number
  offset?: number
  totalPages?: number
  currentPage?: number
}

// CMS specific types
export interface CMSSession {
  user: CMSUser
  session: UserSession
  expires: string
}

export interface ArticleFilters {
  published?: boolean
  featured?: boolean
  category?: string
  tags?: string[]
  author?: string
  search?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface ArticleStats {
  total: number
  published: number
  drafts: number
  featured: number
  byCategory: Record<string, number>
  byAuthor: Record<string, number>
  recentActivity: {
    date: string
    created: number
    published: number
  }[]
}

export interface MediaUploadOptions {
  folder?: string
  maxSize?: number
  allowedTypes?: string[]
  quality?: number
  resize?: {
    width: number
    height: number
    mode?: 'contain' | 'cover' | 'fill'
  }
}

export interface SearchResult {
  articles: Article[]
  count: number
  query: string
  suggestions?: string[]
  facets?: {
    categories: Record<string, number>
    authors: Record<string, number>
    tags: Record<string, number>
  }
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface ResetPasswordData {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Validation schemas
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface FormValidation {
  isValid: boolean
  errors: ValidationError[]
}

// Webhook types for external integrations
export interface WebhookPayload {
  event: string
  data: any
  timestamp: string
  source: string
  signature?: string
}

// RSS and External content types
export interface ExternalArticleSource {
  title: string
  url: string
  description?: string
  lastFetched?: string
  status: 'active' | 'inactive' | 'error'
  errorMessage?: string
}

// Export default database type
export default Database