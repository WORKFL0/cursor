/**
 * Supabase Database Types
 *
 * Auto-generated types for Supabase database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image: string | null
          author_id: string | null
          category_id: string | null
          status: string
          published_at: string | null
          scheduled_for: string | null
          updated_at: string
          created_at: string
          meta_title: string | null
          meta_description: string | null
          canonical_url: string | null
          tags: string[]
          read_time_minutes: number | null
          view_count: number
          publish_to_linkedin: boolean
          linkedin_post_id: string | null
          linkedin_posted_at: string | null
          publish_to_email: boolean
          email_campaign_id: string | null
          email_sent_at: string | null
          last_viewed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image?: string | null
          author_id?: string | null
          category_id?: string | null
          status?: string
          published_at?: string | null
          scheduled_for?: string | null
          updated_at?: string
          created_at?: string
          meta_title?: string | null
          meta_description?: string | null
          canonical_url?: string | null
          tags?: string[]
          read_time_minutes?: number | null
          view_count?: number
          publish_to_linkedin?: boolean
          linkedin_post_id?: string | null
          linkedin_posted_at?: string | null
          publish_to_email?: boolean
          email_campaign_id?: string | null
          email_sent_at?: string | null
          last_viewed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image?: string | null
          author_id?: string | null
          category_id?: string | null
          status?: string
          published_at?: string | null
          scheduled_for?: string | null
          updated_at?: string
          created_at?: string
          meta_title?: string | null
          meta_description?: string | null
          canonical_url?: string | null
          tags?: string[]
          read_time_minutes?: number | null
          view_count?: number
          publish_to_linkedin?: boolean
          linkedin_post_id?: string | null
          linkedin_posted_at?: string | null
          publish_to_email?: boolean
          email_campaign_id?: string | null
          email_sent_at?: string | null
          last_viewed_at?: string | null
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_authors: {
        Row: {
          id: string
          email: string
          display_name: string
          bio: string | null
          avatar_url: string | null
          linkedin_url: string | null
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          display_name: string
          bio?: string | null
          avatar_url?: string | null
          linkedin_url?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          bio?: string | null
          avatar_url?: string | null
          linkedin_url?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blog_media: {
        Row: {
          id: string
          filename: string
          original_filename: string
          url: string
          storage_path: string
          type: string
          mime_type: string | null
          size_bytes: number | null
          width: number | null
          height: number | null
          alt_text: string | null
          caption: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_filename: string
          url: string
          storage_path: string
          type: string
          mime_type?: string | null
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          alt_text?: string | null
          caption?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_filename?: string
          url?: string
          storage_path?: string
          type?: string
          mime_type?: string | null
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          alt_text?: string | null
          caption?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
      blog_tags: {
        Row: {
          id: string
          name: string
          slug: string
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          usage_count?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
