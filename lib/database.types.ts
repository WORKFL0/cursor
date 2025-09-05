/**
 * Database Type Definitions for Workflo CMS
 * Re-export from types/database.ts for consistency
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 */

// Re-export all types from the main database types file
export * from './types/database'
export type { Database as default } from './types/database'

// Create a custom Database type that includes the analytics tables we need
export interface Database {
  public: {
    Tables: {
      // Re-export main tables from types/database.ts
      articles: import('./types/database').Database['public']['Tables']['articles']
      cms_users: import('./types/database').Database['public']['Tables']['cms_users']
      media_files: import('./types/database').Database['public']['Tables']['media_files']
      
      // Add analytics tables that are missing from main schema
      analytics_events: {
        Row: AnalyticsEvent
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'>
        Update: Partial<Omit<AnalyticsEvent, 'id' | 'created_at'>>
      }
      visitor_statistics: {
        Row: VisitorStatistics
        Insert: Omit<VisitorStatistics, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<VisitorStatistics, 'id' | 'created_at' | 'updated_at'>>
      }
      webhook_endpoints: {
        Row: WebhookEndpoint
        Insert: Omit<WebhookEndpoint, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WebhookEndpoint, 'id' | 'created_at' | 'updated_at'>>
      }
      webhook_deliveries: {
        Row: WebhookDelivery
        Insert: Omit<WebhookDelivery, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WebhookDelivery, 'id' | 'created_at' | 'updated_at'>>
      }
      email_templates: {
        Row: EmailTemplate
        Insert: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>>
      }
      email_queue: {
        Row: EmailQueue
        Insert: Omit<EmailQueue, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<EmailQueue, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      track_article_view: {
        Args: {
          article_uuid: string
          visitor_ip?: string
        }
        Returns: void
      }
    }
    Enums: {
      article_source: import('./types/database').Database['public']['Enums']['article_source']
      user_role: import('./types/database').Database['public']['Enums']['user_role']
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Legacy type aliases for backward compatibility
export type AnalyticsEventType = 'page_view' | 'article_view' | 'download' | 'contact' | 'search' | 'click'
export type WebhookStatus = 'pending' | 'processing' | 'success' | 'failed' | 'retry'
export type WebhookEvent = 'article.created' | 'article.updated' | 'article.deleted' | 'user.created' | 'user.updated' | 'analytics.daily'
export type EmailStatus = 'queued' | 'sending' | 'sent' | 'failed' | 'bounced'
export type EmailType = 'welcome' | 'newsletter' | 'notification' | 'alert' | 'marketing'


// Additional types needed for analytics that may not be in the main database types
export interface AnalyticsEvent {
  id: string
  session_id?: string
  user_id?: string
  event_type: AnalyticsEventType
  event_name: string
  page_url?: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  country?: string
  region?: string
  city?: string
  device_type?: string
  browser?: string
  os?: string
  properties: any
  value?: number
  created_at: string
}

export interface VisitorStatistics {
  id: string
  date: string
  unique_visitors: number
  total_page_views: number
  total_sessions: number
  bounce_rate?: number
  avg_session_duration?: number
  top_pages: any
  top_referrers: any
  device_breakdown: any
  country_breakdown: any
  created_at: string
  updated_at: string
}

export interface WebhookEndpoint {
  id: string
  name: string
  url: string
  secret_key: string
  events: WebhookEvent[]
  is_active: boolean
  retry_config: any
  headers: any
  timeout_seconds: number
  created_at: string
  updated_at: string
}

export interface WebhookDelivery {
  id: string
  endpoint_id: string
  event_type: WebhookEvent
  payload: any
  status: WebhookStatus
  http_status_code?: number
  response_body?: string
  error_message?: string
  retry_count: number
  next_retry_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
}

export interface EmailTemplate {
  id: string
  name: string
  type: EmailType
  subject: string
  body_text?: string
  body_html?: string
  variables: any
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EmailQueue {
  id: string
  template_id?: string
  to_email: string
  to_name?: string
  from_email: string
  from_name: string
  subject: string
  body_text?: string
  body_html?: string
  variables: any
  status: EmailStatus
  priority: number
  scheduled_for: string
  sent_at?: string
  error_message?: string
  retry_count: number
  max_retries: number
  created_at: string
  updated_at: string
}