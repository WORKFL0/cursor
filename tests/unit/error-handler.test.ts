/**
 * Comprehensive Unit Tests for Error Handler
 * Tests error response generation, validation, and logging functionality
 */

import { NextResponse } from 'next/server'
import {
  ApiErrorHandler,
  ErrorCodes,
  errorHandler,
  createError,
  createValidationError,
  handleError,
  createSuccess
} from '@/lib/utils/error-handler'

// Mock NextResponse for testing
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      data,
      status: init?.status || 200,
      headers: init?.headers || {}
    }))
  }
}))

// Mock console.error to test logging
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('ApiErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConsoleError.mockClear()
  })

  describe('Singleton Pattern', () => {
    test('should return the same instance', () => {
      const instance1 = ApiErrorHandler.getInstance()
      const instance2 = ApiErrorHandler.getInstance()
      
      expect(instance1).toBe(instance2)
      expect(instance1).toBe(errorHandler)
    })
  })

  describe('Error Response Creation', () => {
    test('should create standardized error responses', () => {
      const response = errorHandler.createErrorResponse(ErrorCodes.INVALID_REQUEST)
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
          code: ErrorCodes.INVALID_REQUEST,
          statusCode: 400,
          timestamp: expect.any(String),
          requestId: expect.any(String)
        }),
        { status: 400 }
      )
    })

    test('should use custom error messages when provided', () => {
      const customMessage = 'Custom error message'
      const response = errorHandler.createErrorResponse(
        ErrorCodes.INVALID_REQUEST,
        customMessage
      )
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: customMessage
        }),
        expect.any(Object)
      )
    })

    test('should include validation errors when provided', () => {
      const validationErrors = [
        {
          field: 'email',
          message: 'Invalid email format',
          code: 'INVALID_FORMAT'
        }
      ]
      
      const response = errorHandler.createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        undefined,
        validationErrors
      )
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: validationErrors
        }),
        expect.any(Object)
      )
    })

    test('should include additional data when provided', () => {
      const additionalData = {
        userId: '123',
        attemptCount: 3
      }
      
      const response = errorHandler.createErrorResponse(
        ErrorCodes.RATE_LIMIT_EXCEEDED,
        undefined,
        undefined,
        additionalData
      )
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(additionalData),
        expect.any(Object)
      )
    })
  })

  describe('Error Logging', () => {
    test('should log errors when shouldLog is true', () => {
      errorHandler.createErrorResponse(ErrorCodes.INTERNAL_ERROR)
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[API Error]',
        expect.objectContaining({
          level: 'error',
          code: ErrorCodes.INTERNAL_ERROR,
          message: expect.any(String),
          statusCode: 500,
          requestId: expect.any(String),
          timestamp: expect.any(String)
        })
      )
    })

    test('should not log errors when shouldLog is false', () => {
      errorHandler.createErrorResponse(ErrorCodes.INVALID_REQUEST)
      
      expect(mockConsoleError).not.toHaveBeenCalled()
    })

    test('should log additional data when provided', () => {
      const additionalData = { userId: '123', action: 'login' }
      
      errorHandler.createErrorResponse(
        ErrorCodes.UNAUTHORIZED,
        undefined,
        undefined,
        additionalData
      )
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        '[API Error]',
        expect.objectContaining({
          additionalData
        })
      )
    })
  })

  describe('Validation Error Responses', () => {
    test('should create validation error responses', () => {
      const validationErrors = [
        {
          field: 'name',
          message: 'Name is required',
          code: 'REQUIRED'
        },
        {
          field: 'email',
          message: 'Invalid email',
          code: 'INVALID_FORMAT'
        }
      ]
      
      const response = errorHandler.createValidationErrorResponse(validationErrors)
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Validation failed for 2 field(s)',
          code: ErrorCodes.VALIDATION_ERROR,
          validation: validationErrors
        }),
        { status: 400 }
      )
    })
  })

  describe('Unexpected Error Handling', () => {
    test('should handle unexpected errors with logging', () => {
      const error = new Error('Something went wrong')
      error.stack = 'Error stack trace'
      
      const context = { userId: '123', action: 'test' }
      
      const response = errorHandler.handleUnexpectedError(error, context)
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Unexpected error:'),
        expect.objectContaining({
          message: 'Something went wrong',
          stack: 'Error stack trace',
          name: 'Error',
          context,
          timestamp: expect.any(String)
        })
      )
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'An unexpected error occurred',
          code: ErrorCodes.INTERNAL_ERROR,
          statusCode: 500
        }),
        { status: 500 }
      )
    })
  })

  describe('Query Parameter Validation', () => {
    test('should validate limit parameter', () => {
      const errors = errorHandler.validateQueryParams({ limit: 'invalid' })
      
      expect(errors).toContainEqual({
        field: 'limit',
        message: 'Limit must be a number between 1 and 100',
        code: 'INVALID_RANGE'
      })
    })

    test('should validate limit range', () => {
      const errorsLow = errorHandler.validateQueryParams({ limit: 0 })
      const errorsHigh = errorHandler.validateQueryParams({ limit: 101 })
      
      expect(errorsLow).toHaveLength(1)
      expect(errorsHigh).toHaveLength(1)
      
      const validLimit = errorHandler.validateQueryParams({ limit: 50 })
      expect(validLimit).toHaveLength(0)
    })

    test('should validate offset parameter', () => {
      const errors = errorHandler.validateQueryParams({ offset: -1 })
      
      expect(errors).toContainEqual({
        field: 'offset',
        message: 'Offset must be a non-negative number',
        code: 'INVALID_NUMBER'
      })
    })

    test('should validate sort parameter', () => {
      const errors = errorHandler.validateQueryParams({ sort: 'invalid' })
      
      expect(errors).toContainEqual({
        field: 'sort',
        message: 'Sort must be one of: newest, oldest, engagement',
        code: 'INVALID_ENUM'
      })
    })

    test('should validate format parameter', () => {
      const errors = errorHandler.validateQueryParams({ format: 'invalid' })
      
      expect(errors).toContainEqual({
        field: 'format',
        message: 'Format must be one of: summary, full',
        code: 'INVALID_ENUM'
      })
    })

    test('should validate date parameters', () => {
      const errors = errorHandler.validateQueryParams({
        from: 'invalid-date',
        to: 'also-invalid'
      })
      
      expect(errors).toHaveLength(2)
      expect(errors).toContainEqual({
        field: 'from',
        message: 'From date must be a valid ISO date string',
        code: 'INVALID_DATE'
      })
      expect(errors).toContainEqual({
        field: 'to',
        message: 'To date must be a valid ISO date string',
        code: 'INVALID_DATE'
      })
    })

    test('should validate date range', () => {
      const errors = errorHandler.validateQueryParams({
        from: '2024-01-02',
        to: '2024-01-01'
      })
      
      expect(errors).toContainEqual({
        field: 'dateRange',
        message: 'From date must be before to date',
        code: 'INVALID_RANGE'
      })
    })

    test('should pass valid query parameters', () => {
      const validParams = {
        limit: 25,
        offset: 10,
        sort: 'newest',
        format: 'summary',
        from: '2024-01-01',
        to: '2024-01-31'
      }
      
      const errors = errorHandler.validateQueryParams(validParams)
      expect(errors).toHaveLength(0)
    })
  })

  describe('Success Response Creation', () => {
    test('should create standardized success responses', () => {
      const data = { posts: [], total: 0 }
      const response = errorHandler.createSuccessResponse(data)
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data,
          timestamp: expect.any(String),
          requestId: expect.any(String)
        }),
        { status: 200 }
      )
    })

    test('should use custom status codes', () => {
      const data = { created: true }
      const response = errorHandler.createSuccessResponse(data, 201)
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.any(Object),
        { status: 201 }
      )
    })

    test('should include additional meta data', () => {
      const data = { items: [] }
      const meta = { pagination: { page: 1, total: 100 } }
      
      const response = errorHandler.createSuccessResponse(data, 200, meta)
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining(meta),
        expect.any(Object)
      )
    })
  })
})

describe('Exported Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createError', () => {
    test('should create error responses', () => {
      createError(ErrorCodes.INVALID_REQUEST, 'Custom message')
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Custom message',
          code: ErrorCodes.INVALID_REQUEST
        }),
        expect.any(Object)
      )
    })
  })

  describe('createValidationError', () => {
    test('should create validation error responses', () => {
      const errors = [
        {
          field: 'email',
          message: 'Invalid email',
          code: 'INVALID_FORMAT'
        }
      ]
      
      createValidationError(errors)
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: errors,
          code: ErrorCodes.VALIDATION_ERROR
        }),
        expect.any(Object)
      )
    })
  })

  describe('handleError', () => {
    test('should handle unexpected errors', () => {
      const error = new Error('Test error')
      const context = { test: true }
      
      handleError(error, context)
      
      expect(mockConsoleError).toHaveBeenCalled()
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: ErrorCodes.INTERNAL_ERROR
        }),
        expect.any(Object)
      )
    })
  })

  describe('createSuccess', () => {
    test('should create success responses', () => {
      const data = { success: true }
      
      createSuccess(data, 201, { meta: 'data' })
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data,
          meta: 'data'
        }),
        { status: 201 }
      )
    })
  })
})

describe('Error Code Coverage', () => {
  test('should have appropriate status codes for all error types', () => {
    const errorCodes = Object.values(ErrorCodes)
    
    errorCodes.forEach(code => {
      const response = errorHandler.createErrorResponse(code)
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code,
          statusCode: expect.any(Number)
        }),
        expect.objectContaining({
          status: expect.any(Number)
        })
      )
    })
  })

  test('should have user-friendly messages for client-facing errors', () => {
    const clientErrors = [
      ErrorCodes.INVALID_REQUEST,
      ErrorCodes.UNAUTHORIZED,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      ErrorCodes.VALIDATION_ERROR,
      ErrorCodes.INVALID_URL,
      ErrorCodes.INVALID_DATE
    ]
    
    clientErrors.forEach(code => {
      const response = errorHandler.createErrorResponse(code)
      
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringMatching(/^[A-Z]/) // Should start with capital letter
        }),
        expect.any(Object)
      )
    })
  })
})

describe('Request ID Generation', () => {
  test('should generate unique request IDs', () => {
    const response1 = errorHandler.createErrorResponse(ErrorCodes.INTERNAL_ERROR)
    const response2 = errorHandler.createErrorResponse(ErrorCodes.INTERNAL_ERROR)
    
    const calls = (NextResponse.json as jest.Mock).mock.calls
    const requestId1 = calls[calls.length - 2][0].requestId
    const requestId2 = calls[calls.length - 1][0].requestId
    
    expect(requestId1).not.toBe(requestId2)
    expect(requestId1).toMatch(/^req_\d+_[a-z0-9]+$/)
    expect(requestId2).toMatch(/^req_\d+_[a-z0-9]+$/)
  })
})

describe('Edge Cases and Error Conditions', () => {
  test('should handle missing error definitions gracefully', () => {
    // This tests internal resilience - shouldn't happen in practice
    const invalidCode = 'NONEXISTENT_ERROR' as ErrorCodes
    
    expect(() => {
      errorHandler.createErrorResponse(invalidCode)
    }).not.toThrow()
  })

  test('should handle null and undefined parameters', () => {
    expect(() => {
      errorHandler.validateQueryParams({})
    }).not.toThrow()
    
    expect(() => {
      errorHandler.createSuccessResponse(null)
    }).not.toThrow()
    
    expect(() => {
      errorHandler.createValidationErrorResponse([])
    }).not.toThrow()
  })

  test('should handle empty validation errors array', () => {
    const response = errorHandler.createValidationErrorResponse([])
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed for 0 field(s)',
        validation: []
      }),
      expect.any(Object)
    )
  })
})

describe('Performance and Memory', () => {
  test('should handle large error messages efficiently', () => {
    const largeMessage = 'Error message '.repeat(1000)
    const start = Date.now()
    
    errorHandler.createErrorResponse(ErrorCodes.INTERNAL_ERROR, largeMessage)
    
    const duration = Date.now() - start
    expect(duration).toBeLessThan(100) // Should complete in less than 100ms
  })

  test('should handle many validation errors efficiently', () => {
    const manyErrors = Array.from({ length: 100 }, (_, i) => ({
      field: `field${i}`,
      message: `Error message ${i}`,
      code: 'VALIDATION_ERROR'
    }))
    
    const start = Date.now()
    errorHandler.createValidationErrorResponse(manyErrors)
    const duration = Date.now() - start
    
    expect(duration).toBeLessThan(100)
  })
})