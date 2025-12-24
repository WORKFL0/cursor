/**
 * Comprehensive Error Handler
 * 
 * Centralized error handling utilities for the LinkedIn posts API
 * Provides standardized error responses, logging, and monitoring integration
 */

import { NextResponse } from 'next/server'
import { ApiError, ValidationError } from '../types/linkedin-api'

export enum ErrorCodes {
  // General errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_JSON = 'INVALID_JSON',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_API_KEY = 'INVALID_API_KEY',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Rate limiting errors
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FIELD_FORMAT = 'INVALID_FIELD_FORMAT',
  FIELD_TOO_LONG = 'FIELD_TOO_LONG',
  INVALID_URL = 'INVALID_URL',
  INVALID_DATE = 'INVALID_DATE',
  FUTURE_DATE = 'FUTURE_DATE',
  INVALID_DOMAIN = 'INVALID_DOMAIN',
  
  // LinkedIn posts specific errors
  GET_POSTS_ERROR = 'GET_POSTS_ERROR',
  CREATE_POST_ERROR = 'CREATE_POST_ERROR',
  POST_NOT_FOUND = 'POST_NOT_FOUND',
  DUPLICATE_POST = 'DUPLICATE_POST',
  
  // N8N integration errors
  N8N_FORMAT_ERROR = 'N8N_FORMAT_ERROR',
  INTEGRATION_ERROR = 'INTEGRATION_ERROR'
}

export interface ErrorDetails {
  code: ErrorCodes
  message: string
  statusCode: number
  shouldLog: boolean
  userMessage?: string
}

export class ApiErrorHandler {
  private static instance: ApiErrorHandler
  
  // Error definitions with appropriate status codes and logging flags
  private readonly errorDefinitions: Record<ErrorCodes, Omit<ErrorDetails, 'code'>> = {
    [ErrorCodes.INTERNAL_ERROR]: {
      message: 'An internal server error occurred',
      statusCode: 500,
      shouldLog: true,
      userMessage: 'Something went wrong. Please try again later.'
    },
    [ErrorCodes.INVALID_REQUEST]: {
      message: 'Invalid request format or parameters',
      statusCode: 400,
      shouldLog: false,
      userMessage: 'Please check your request format and try again.'
    },
    [ErrorCodes.INVALID_JSON]: {
      message: 'Invalid JSON in request body',
      statusCode: 400,
      shouldLog: false,
      userMessage: 'Please provide valid JSON in the request body.'
    },
    [ErrorCodes.UNAUTHORIZED]: {
      message: 'Authentication required or invalid',
      statusCode: 401,
      shouldLog: true,
      userMessage: 'Please provide valid authentication credentials.'
    },
    [ErrorCodes.INVALID_API_KEY]: {
      message: 'Invalid API key provided',
      statusCode: 401,
      shouldLog: true,
      userMessage: 'The provided API key is invalid.'
    },
    [ErrorCodes.INVALID_TOKEN]: {
      message: 'Invalid bearer token provided',
      statusCode: 401,
      shouldLog: true,
      userMessage: 'The provided authentication token is invalid.'
    },
    [ErrorCodes.RATE_LIMIT_EXCEEDED]: {
      message: 'Rate limit exceeded',
      statusCode: 429,
      shouldLog: true,
      userMessage: 'Too many requests. Please wait before trying again.'
    },
    [ErrorCodes.VALIDATION_ERROR]: {
      message: 'Request validation failed',
      statusCode: 400,
      shouldLog: false,
      userMessage: 'Please correct the validation errors and try again.'
    },
    [ErrorCodes.MISSING_REQUIRED_FIELD]: {
      message: 'Required field is missing',
      statusCode: 400,
      shouldLog: false
    },
    [ErrorCodes.INVALID_FIELD_FORMAT]: {
      message: 'Field format is invalid',
      statusCode: 400,
      shouldLog: false
    },
    [ErrorCodes.FIELD_TOO_LONG]: {
      message: 'Field exceeds maximum length',
      statusCode: 400,
      shouldLog: false
    },
    [ErrorCodes.INVALID_URL]: {
      message: 'Invalid URL format',
      statusCode: 400,
      shouldLog: false,
      userMessage: 'Please provide a valid URL.'
    },
    [ErrorCodes.INVALID_DATE]: {
      message: 'Invalid date format',
      statusCode: 400,
      shouldLog: false,
      userMessage: 'Please provide a valid date in ISO format.'
    },
    [ErrorCodes.FUTURE_DATE]: {
      message: 'Date cannot be in the future',
      statusCode: 400,
      shouldLog: false,
      userMessage: 'Published date cannot be in the future.'
    },
    [ErrorCodes.INVALID_DOMAIN]: {
      message: 'URL domain is not allowed',
      statusCode: 400,
      shouldLog: false,
      userMessage: 'URL must be from an allowed domain (linkedin.com).'
    },
    [ErrorCodes.GET_POSTS_ERROR]: {
      message: 'Failed to retrieve LinkedIn posts',
      statusCode: 500,
      shouldLog: true,
      userMessage: 'Unable to retrieve posts. Please try again later.'
    },
    [ErrorCodes.CREATE_POST_ERROR]: {
      message: 'Failed to create LinkedIn post',
      statusCode: 500,
      shouldLog: true,
      userMessage: 'Unable to create post. Please try again later.'
    },
    [ErrorCodes.POST_NOT_FOUND]: {
      message: 'LinkedIn post not found',
      statusCode: 404,
      shouldLog: false,
      userMessage: 'The requested post could not be found.'
    },
    [ErrorCodes.DUPLICATE_POST]: {
      message: 'Post with this URL already exists',
      statusCode: 409,
      shouldLog: false,
      userMessage: 'A post with this URL already exists.'
    },
    [ErrorCodes.N8N_FORMAT_ERROR]: {
      message: 'Failed to format data for n8n integration',
      statusCode: 500,
      shouldLog: true,
      userMessage: 'Error processing data for workflow integration.'
    },
    [ErrorCodes.INTEGRATION_ERROR]: {
      message: 'Integration service error',
      statusCode: 500,
      shouldLog: true,
      userMessage: 'External integration error. Please try again later.'
    }
  }

  private constructor() {}

  public static getInstance(): ApiErrorHandler {
    if (!ApiErrorHandler.instance) {
      ApiErrorHandler.instance = new ApiErrorHandler()
    }
    return ApiErrorHandler.instance
  }

  /**
   * Create standardized error response
   */
  public createErrorResponse(
    code: ErrorCodes,
    customMessage?: string,
    validation?: ValidationError[],
    additionalData?: Record<string, any>
  ): NextResponse {
    const errorDef = this.errorDefinitions[code]
    const requestId = this.generateRequestId()
    
    const errorResponse: ApiError = {
      success: false,
      error: customMessage || errorDef.userMessage || errorDef.message,
      code,
      statusCode: errorDef.statusCode,
      timestamp: new Date().toISOString(),
      requestId,
      ...(validation && { validation }),
      ...(additionalData && additionalData)
    }

    // Log error if needed
    if (errorDef.shouldLog) {
      this.logError(code, errorResponse, additionalData)
    }

    return NextResponse.json(errorResponse, { status: errorDef.statusCode })
  }

  /**
   * Handle validation errors
   */
  public createValidationErrorResponse(
    validationErrors: ValidationError[]
  ): NextResponse {
    return this.createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      `Validation failed for ${validationErrors.length} field(s)`,
      validationErrors
    )
  }

  /**
   * Handle unexpected errors with logging
   */
  public handleUnexpectedError(
    error: Error,
    context?: Record<string, any>
  ): NextResponse {
    const requestId = this.generateRequestId()
    
    // Log full error details
    console.error(`[${requestId}] Unexpected error:`, {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      timestamp: new Date().toISOString()
    })

    return this.createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'An unexpected error occurred',
      undefined,
      { requestId }
    )
  }

  /**
   * Validate common request parameters
   */
  public validateQueryParams(params: Record<string, any>): ValidationError[] {
    const errors: ValidationError[] = []

    // Validate limit parameter
    if (params.limit !== undefined) {
      const limit = parseInt(String(params.limit))
      if (isNaN(limit) || limit < 1 || limit > 100) {
        errors.push({
          field: 'limit',
          message: 'Limit must be a number between 1 and 100',
          code: 'INVALID_RANGE'
        })
      }
    }

    // Validate offset parameter
    if (params.offset !== undefined) {
      const offset = parseInt(String(params.offset))
      if (isNaN(offset) || offset < 0) {
        errors.push({
          field: 'offset',
          message: 'Offset must be a non-negative number',
          code: 'INVALID_NUMBER'
        })
      }
    }

    // Validate sort parameter
    if (params.sort !== undefined) {
      const validSorts = ['newest', 'oldest', 'engagement']
      if (!validSorts.includes(params.sort)) {
        errors.push({
          field: 'sort',
          message: `Sort must be one of: ${validSorts.join(', ')}`,
          code: 'INVALID_ENUM'
        })
      }
    }

    // Validate format parameter
    if (params.format !== undefined) {
      const validFormats = ['summary', 'full']
      if (!validFormats.includes(params.format)) {
        errors.push({
          field: 'format',
          message: `Format must be one of: ${validFormats.join(', ')}`,
          code: 'INVALID_ENUM'
        })
      }
    }

    // Validate date parameters
    if (params.from !== undefined) {
      const fromDate = new Date(params.from)
      if (isNaN(fromDate.getTime())) {
        errors.push({
          field: 'from',
          message: 'From date must be a valid ISO date string',
          code: 'INVALID_DATE'
        })
      }
    }

    if (params.to !== undefined) {
      const toDate = new Date(params.to)
      if (isNaN(toDate.getTime())) {
        errors.push({
          field: 'to',
          message: 'To date must be a valid ISO date string',
          code: 'INVALID_DATE'
        })
      }
    }

    // Validate date range
    if (params.from && params.to) {
      const fromDate = new Date(params.from)
      const toDate = new Date(params.to)
      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime()) && fromDate > toDate) {
        errors.push({
          field: 'dateRange',
          message: 'From date must be before to date',
          code: 'INVALID_RANGE'
        })
      }
    }

    return errors
  }

  /**
   * Create success response with consistent format
   */
  public createSuccessResponse(
    data: any,
    statusCode: number = 200,
    additionalMeta?: Record<string, any>
  ): NextResponse {
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      ...additionalMeta
    }, { status: statusCode })
  }

  // Private helper methods

  private logError(
    code: ErrorCodes,
    errorResponse: ApiError,
    additionalData?: Record<string, any>
  ): void {
    const logEntry = {
      level: 'error',
      code,
      message: errorResponse.error,
      statusCode: errorResponse.statusCode,
      requestId: errorResponse.requestId,
      timestamp: errorResponse.timestamp,
      ...(additionalData && { additionalData })
    }

    console.error('[API Error]', logEntry)

    // In production, send to monitoring service (e.g., Sentry, DataDog)
    // this.sendToMonitoring(logEntry)
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  // Future: Add monitoring integration
  // private async sendToMonitoring(logEntry: any): Promise<void> {
  //   // Send to external monitoring service
  // }
}

// Export singleton instance
export const errorHandler = ApiErrorHandler.getInstance()

// Export commonly used error creation functions
export const createError = (code: ErrorCodes, message?: string, validation?: ValidationError[]) =>
  errorHandler.createErrorResponse(code, message, validation)

export const createValidationError = (errors: ValidationError[]) =>
  errorHandler.createValidationErrorResponse(errors)

export const handleError = (error: Error, context?: Record<string, any>) =>
  errorHandler.handleUnexpectedError(error, context)

export const createSuccess = (data: any, statusCode?: number, meta?: Record<string, any>) =>
  errorHandler.createSuccessResponse(data, statusCode, meta)