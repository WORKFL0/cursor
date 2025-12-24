/**
 * LinkedIn Posts Service
 * 
 * Comprehensive service for managing LinkedIn posts data
 * Handles filtering, pagination, validation, and data processing
 * Optimized for n8n integration and API consumption
 */

import { LinkedInPost, workfloLinkedInPosts } from '../config/linkedin-posts'
import {
  LinkedInPostsQueryParams,
  CreateLinkedInPostRequest,
  LinkedInPostSummary,
  LinkedInPostFull,
  LinkedInPostsApiResponse,
  CreateLinkedInPostResponse,
  ValidationError,
  SortOrder,
  N8NLinkedInPostNode
} from '../types/linkedin-api'

export class LinkedInPostsService {
  private static instance: LinkedInPostsService
  private posts: LinkedInPost[] = [...workfloLinkedInPosts]

  // Configuration
  private readonly config = {
    maxLimit: 100,
    defaultLimit: 10,
    maxOffset: 1000,
    maxContentLength: 3000,
    maxAuthorLength: 100,
    allowedDomains: [
      'linkedin.com',
      'www.linkedin.com'
    ]
  }

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): LinkedInPostsService {
    if (!LinkedInPostsService.instance) {
      LinkedInPostsService.instance = new LinkedInPostsService()
    }
    return LinkedInPostsService.instance
  }

  /**
   * Get LinkedIn posts with filtering, pagination, and sorting
   */
  public async getPosts(params: LinkedInPostsQueryParams): Promise<LinkedInPostsApiResponse> {
    const startTime = Date.now()
    const requestId = this.generateRequestId()

    try {
      // Parse and validate parameters
      const {
        limit,
        offset,
        sort,
        author,
        from,
        to,
        includeMetrics,
        format
      } = this.parseQueryParams(params)

      // Filter posts
      let filteredPosts = this.filterPosts({
        author,
        from,
        to
      })

      // Sort posts
      filteredPosts = this.sortPosts(filteredPosts, sort)

      // Calculate pagination
      const total = filteredPosts.length
      const hasMore = offset + limit < total

      // Apply pagination
      const paginatedPosts = filteredPosts.slice(offset, offset + limit)

      // Format posts based on request
      const formattedPosts = format === 'full' && includeMetrics
        ? this.formatFullPosts(paginatedPosts)
        : this.formatSummaryPosts(paginatedPosts)

      const processingTime = Date.now() - startTime

      return {
        success: true,
        data: formattedPosts,
        pagination: {
          offset,
          limit,
          total,
          hasMore
        },
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime,
          filters: {
            ...(author && { author }),
            ...(from || to) && {
              dateRange: {
                from: from ? from.toISOString() : '',
                to: to ? to.toISOString() : ''
              }
            },
            sort
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: {
          offset: 0,
          limit: 0,
          total: 0,
          hasMore: false
        },
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime,
          filters: { sort: 'newest' }
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Create a new LinkedIn post
   */
  public async createPost(postData: CreateLinkedInPostRequest): Promise<CreateLinkedInPostResponse> {
    try {
      // Validate the post data
      const validationErrors = this.validatePost(postData)
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: 'Validation failed',
          validation: validationErrors
        }
      }

      // Create the new post
      const newPost: LinkedInPost = {
        id: this.generatePostId(),
        author: postData.author,
        content: postData.content,
        url: postData.url,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : new Date(),
        likes: postData.likes || 0,
        comments: postData.comments || 0,
        shares: postData.shares || 0,
        type: 'linkedin',
        isExternal: true
      }

      // Add to posts array (in a real app, this would save to database)
      this.posts.unshift(newPost)

      // Format response
      const formattedPost = this.formatFullPost(newPost)

      return {
        success: true,
        data: {
          id: newPost.id,
          message: 'LinkedIn post created successfully',
          post: formattedPost
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create post'
      }
    }
  }

  /**
   * Validate LinkedIn post data
   */
  public validatePost(post: CreateLinkedInPostRequest): ValidationError[] {
    const errors: ValidationError[] = []

    // Author validation
    if (!post.author || post.author.trim().length === 0) {
      errors.push({
        field: 'author',
        message: 'Author is required',
        code: 'REQUIRED'
      })
    } else if (post.author.length > this.config.maxAuthorLength) {
      errors.push({
        field: 'author',
        message: `Author must be less than ${this.config.maxAuthorLength} characters`,
        code: 'MAX_LENGTH'
      })
    }

    // Content validation
    if (!post.content || post.content.trim().length === 0) {
      errors.push({
        field: 'content',
        message: 'Content is required',
        code: 'REQUIRED'
      })
    } else if (post.content.length > this.config.maxContentLength) {
      errors.push({
        field: 'content',
        message: `Content must be less than ${this.config.maxContentLength} characters`,
        code: 'MAX_LENGTH'
      })
    }

    // URL validation
    if (!post.url || post.url.trim().length === 0) {
      errors.push({
        field: 'url',
        message: 'URL is required',
        code: 'REQUIRED'
      })
    } else {
      try {
        const url = new URL(post.url)
        if (!this.config.allowedDomains.some(domain => url.hostname.includes(domain))) {
          errors.push({
            field: 'url',
            message: 'URL must be from an allowed domain (linkedin.com)',
            code: 'INVALID_DOMAIN'
          })
        }
      } catch {
        errors.push({
          field: 'url',
          message: 'URL must be a valid URL',
          code: 'INVALID_URL'
        })
      }
    }

    // Date validation
    if (post.publishedAt) {
      const date = new Date(post.publishedAt)
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'publishedAt',
          message: 'Published date must be a valid date',
          code: 'INVALID_DATE'
        })
      } else if (date > new Date()) {
        errors.push({
          field: 'publishedAt',
          message: 'Published date cannot be in the future',
          code: 'FUTURE_DATE'
        })
      }
    }

    // Engagement metrics validation
    if (post.likes !== undefined && (post.likes < 0 || !Number.isInteger(post.likes))) {
      errors.push({
        field: 'likes',
        message: 'Likes must be a non-negative integer',
        code: 'INVALID_NUMBER'
      })
    }

    if (post.comments !== undefined && (post.comments < 0 || !Number.isInteger(post.comments))) {
      errors.push({
        field: 'comments',
        message: 'Comments must be a non-negative integer',
        code: 'INVALID_NUMBER'
      })
    }

    if (post.shares !== undefined && (post.shares < 0 || !Number.isInteger(post.shares))) {
      errors.push({
        field: 'shares',
        message: 'Shares must be a non-negative integer',
        code: 'INVALID_NUMBER'
      })
    }

    return errors
  }

  /**
   * Calculate engagement score for a post
   */
  public calculateEngagement(post: LinkedInPost): number {
    const likes = post.likes || 0
    const comments = post.comments || 0
    const shares = post.shares || 0

    // Weighted engagement score
    return (likes * 1) + (comments * 3) + (shares * 5)
  }

  /**
   * Format posts for n8n integration
   */
  public formatForN8N(posts: LinkedInPost[]): N8NLinkedInPostNode[] {
    return posts.map(post => ({
      id: post.id,
      author: post.author,
      content: post.content,
      url: post.url,
      publishedAt: post.publishedAt.toISOString(),
      ...(post.likes !== undefined && {
        engagementMetrics: {
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          total: this.calculateEngagement(post)
        }
      }),
      metadata: {
        source: 'workflo-api',
        version: '1.0.0',
        fetchedAt: new Date().toISOString()
      }
    }))
  }

  // Private helper methods

  private parseQueryParams(params: LinkedInPostsQueryParams) {
    const limit = Math.min(
      Math.max(parseInt(String(params.limit || this.config.defaultLimit)), 1),
      this.config.maxLimit
    )

    const offset = Math.min(
      Math.max(parseInt(String(params.offset || 0)), 0),
      this.config.maxOffset
    )

    const sort: SortOrder = ['newest', 'oldest', 'engagement'].includes(params.sort as string)
      ? (params.sort as SortOrder)
      : 'newest'

    const author = params.author?.trim() || undefined
    const from = params.from ? new Date(params.from) : undefined
    const to = params.to ? new Date(params.to) : undefined
    
    const includeMetrics = params.includeMetrics === 'true' || params.includeMetrics === true
    const format = params.format === 'full' ? 'full' : 'summary'

    return {
      limit,
      offset,
      sort,
      author,
      from: from && !isNaN(from.getTime()) ? from : undefined,
      to: to && !isNaN(to.getTime()) ? to : undefined,
      includeMetrics,
      format
    }
  }

  private filterPosts(filters: {
    author?: string
    from?: Date
    to?: Date
  }): LinkedInPost[] {
    let filtered = [...this.posts]

    if (filters.author) {
      filtered = filtered.filter(post => 
        post.author.toLowerCase().includes(filters.author!.toLowerCase())
      )
    }

    if (filters.from) {
      filtered = filtered.filter(post => post.publishedAt >= filters.from!)
    }

    if (filters.to) {
      filtered = filtered.filter(post => post.publishedAt <= filters.to!)
    }

    return filtered
  }

  private sortPosts(posts: LinkedInPost[], sort: SortOrder): LinkedInPost[] {
    const sorted = [...posts]

    switch (sort) {
      case 'newest':
        return sorted.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      
      case 'oldest':
        return sorted.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime())
      
      case 'engagement':
        return sorted.sort((a, b) => this.calculateEngagement(b) - this.calculateEngagement(a))
      
      default:
        return sorted
    }
  }

  private formatSummaryPosts(posts: LinkedInPost[]): LinkedInPostSummary[] {
    return posts.map(post => ({
      id: post.id,
      author: post.author,
      content: post.content,
      url: post.url,
      publishedAt: post.publishedAt,
      type: 'linkedin' as const
    }))
  }

  private formatFullPosts(posts: LinkedInPost[]): LinkedInPostFull[] {
    return posts.map(post => this.formatFullPost(post))
  }

  private formatFullPost(post: LinkedInPost): LinkedInPostFull {
    const engagement = this.calculateEngagement(post)
    const totalEngagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0)

    return {
      id: post.id,
      author: post.author,
      content: post.content,
      url: post.url,
      publishedAt: post.publishedAt,
      type: 'linkedin',
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      isExternal: post.isExternal,
      contentPreview: post.content.slice(0, 150) + (post.content.length > 150 ? '...' : ''),
      engagement: {
        total: engagement,
        likesRatio: totalEngagement > 0 ? (post.likes || 0) / totalEngagement : 0,
        commentsRatio: totalEngagement > 0 ? (post.comments || 0) / totalEngagement : 0,
        sharesRatio: totalEngagement > 0 ? (post.shares || 0) / totalEngagement : 0
      }
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private generatePostId(): string {
    return `li-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }
}

// Export singleton instance
export const linkedInPostsService = LinkedInPostsService.getInstance()