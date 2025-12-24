/**
 * LinkedIn Posts API Types
 * 
 * TypeScript interfaces and types for the LinkedIn posts API endpoints
 * Used for n8n integration and internal API consumption
 */

import { LinkedInPost } from '../config/linkedin-posts'

// API Request Types
export interface LinkedInPostsQueryParams {
  /** Number of posts to return (1-100) */
  limit?: string | number
  /** Pagination offset */
  offset?: string | number
  /** Sort order: 'newest' | 'oldest' | 'engagement' */
  sort?: 'newest' | 'oldest' | 'engagement'
  /** Filter by author name */
  author?: string
  /** Filter by date range (ISO string) */
  from?: string
  to?: string
  /** Include engagement metrics */
  includeMetrics?: string | boolean
  /** Return format: 'full' | 'summary' */
  format?: 'full' | 'summary'
}

export interface CreateLinkedInPostRequest {
  author: string
  content: string
  url: string
  publishedAt?: string | Date
  likes?: number
  comments?: number
  shares?: number
}

// API Response Types
export interface LinkedInPostSummary {
  id: string
  author: string
  content: string
  url: string
  publishedAt: Date
  type: 'linkedin'
}

export interface LinkedInPostFull extends LinkedInPostSummary {
  likes?: number
  comments?: number
  shares?: number
  isExternal: boolean
  contentPreview?: string
  engagement?: {
    total: number
    likesRatio: number
    commentsRatio: number
    sharesRatio: number
  }
}

export interface LinkedInPostsApiResponse {
  success: boolean
  data: LinkedInPostSummary[] | LinkedInPostFull[]
  pagination: {
    offset: number
    limit: number
    total: number
    hasMore: boolean
  }
  meta: {
    requestId: string
    timestamp: string
    processingTime: number
    filters: {
      author?: string
      dateRange?: {
        from: string
        to: string
      }
      sort: string
    }
  }
  error?: string
}

export interface CreateLinkedInPostResponse {
  success: boolean
  data?: {
    id: string
    message: string
    post: LinkedInPostFull
  }
  error?: string
  validation?: {
    field: string
    message: string
  }[]
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

export interface RateLimitResponse {
  success: false
  error: string
  rateLimit: RateLimitInfo
}

// Validation Types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiError {
  success: false
  error: string
  code: string
  statusCode: number
  timestamp: string
  requestId: string
  validation?: ValidationError[]
}

// Utility Types
export type SortOrder = 'newest' | 'oldest' | 'engagement'
export type ResponseFormat = 'full' | 'summary'

// n8n Integration Types
export interface N8NLinkedInPostNode {
  id: string
  author: string
  content: string
  url: string
  publishedAt: string
  engagementMetrics?: {
    likes: number
    comments: number
    shares: number
    total: number
  }
  metadata: {
    source: 'workflo-api'
    version: string
    fetchedAt: string
  }
}

// Internal Service Types
export interface LinkedInPostsService {
  getPosts: (params: LinkedInPostsQueryParams) => Promise<LinkedInPostsApiResponse>
  createPost: (post: CreateLinkedInPostRequest) => Promise<CreateLinkedInPostResponse>
  validatePost: (post: CreateLinkedInPostRequest) => ValidationError[]
  calculateEngagement: (post: LinkedInPost) => number
}

// Middleware Types
export interface CorsOptions {
  origin: string[]
  methods: string[]
  allowedHeaders: string[]
  credentials: boolean
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests: boolean
  skipFailedRequests: boolean
}

// Configuration Types
export interface LinkedInApiConfig {
  version: string
  baseUrl: string
  rateLimiting: RateLimitConfig
  cors: CorsOptions
  authentication: {
    required: boolean
    methods: ('api-key' | 'bearer' | 'basic')[]
  }
  validation: {
    maxContentLength: number
    maxAuthorLength: number
    allowedDomains: string[]
  }
}