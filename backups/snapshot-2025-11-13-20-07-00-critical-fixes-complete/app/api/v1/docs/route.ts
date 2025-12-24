/**
 * OpenAPI Documentation API - v1
 * Generate and serve API documentation
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'
import { allowAnonymous } from '@/lib/middleware/auth'

// OpenAPI 3.0 specification
const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Workflo CMS API',
    description: 'Comprehensive API for Workflo Content Management System with analytics, email queue, and webhooks',
    version: '1.0.0',
    contact: {
      name: 'Workflo B.V.',
      email: 'info@workflo.it',
      url: 'https://workflo.it'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com/api/v1'
        : 'http://localhost:3000/api/v1',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
    }
  ],
  paths: {
    '/articles': {
      get: {
        summary: 'List articles',
        description: 'Get a paginated list of articles with optional filtering',
        tags: ['Articles'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number for pagination'
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10, maximum: 100 },
            description: 'Number of items per page'
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search in title, content, and excerpt'
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by category'
          },
          {
            name: 'published',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'Filter by published status'
          },
          {
            name: 'featured',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'Filter by featured status'
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', enum: ['title', 'published_at', 'created_at', 'views_count'] },
            description: 'Sort field'
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
            description: 'Sort order'
          }
        ],
        responses: {
          200: {
            description: 'List of articles retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Article' }
                        },
                        pagination: { $ref: '#/components/schemas/Pagination' }
                      }
                    },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create article',
        description: 'Create a new article (requires editor role)',
        tags: ['Articles'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                  title: { type: 'string', maxLength: 500 },
                  slug: { type: 'string', maxLength: 255 },
                  excerpt: { type: 'string' },
                  content: { type: 'string' },
                  author: { type: 'string' },
                  category: { type: 'string', default: 'Nieuws' },
                  tags: { type: 'array', items: { type: 'string' } },
                  image_url: { type: 'string', format: 'uri' },
                  published: { type: 'boolean', default: false },
                  featured: { type: 'boolean', default: false },
                  external_url: { type: 'string', format: 'uri' },
                  published_at: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Article created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Article' }
                      }
                    }
                  ]
                }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/articles/{id}': {
      get: {
        summary: 'Get article',
        description: 'Get a single article by ID or slug',
        tags: ['Articles'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Article ID (UUID) or slug'
          }
        ],
        responses: {
          200: {
            description: 'Article retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Article' }
                      }
                    }
                  ]
                }
              }
            }
          },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        summary: 'Update article',
        description: 'Update an existing article (requires editor role)',
        tags: ['Articles'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Article ID (UUID)'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', maxLength: 500 },
                  slug: { type: 'string', maxLength: 255 },
                  excerpt: { type: 'string' },
                  content: { type: 'string' },
                  author: { type: 'string' },
                  category: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  image_url: { type: 'string', format: 'uri' },
                  published: { type: 'boolean' },
                  featured: { type: 'boolean' },
                  external_url: { type: 'string', format: 'uri' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Article updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Article' }
                      }
                    }
                  ]
                }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        summary: 'Delete article',
        description: 'Delete an article (requires editor role)',
        tags: ['Articles'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Article ID (UUID)'
          }
        ],
        responses: {
          200: {
            description: 'Article deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/analytics': {
      get: {
        summary: 'Get analytics data',
        description: 'Retrieve analytics data (requires editor role)',
        tags: ['Analytics'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'type',
            in: 'query',
            required: true,
            schema: { type: 'string', enum: ['overview', 'visitors', 'articles', 'events', 'realtime'] },
            description: 'Type of analytics data to retrieve'
          },
          {
            name: 'dateFrom',
            in: 'query',
            schema: { type: 'string', format: 'date' },
            description: 'Start date for analytics data'
          },
          {
            name: 'dateTo',
            in: 'query',
            schema: { type: 'string', format: 'date' },
            description: 'End date for analytics data'
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', maximum: 1000 },
            description: 'Limit for events and articles analytics'
          }
        ],
        responses: {
          200: {
            description: 'Analytics data retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      },
      post: {
        summary: 'Track analytics event',
        description: 'Track a new analytics event (rate limited)',
        tags: ['Analytics'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['event_name'],
                properties: {
                  event_name: { type: 'string' },
                  event_type: { 
                    type: 'string', 
                    enum: ['page_view', 'article_view', 'download', 'contact', 'search', 'click'],
                    default: 'page_view'
                  },
                  page_url: { type: 'string', format: 'uri' },
                  referrer: { type: 'string', format: 'uri' },
                  properties: { type: 'object' },
                  value: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Event tracked successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/AnalyticsEvent' }
                      }
                    }
                  ]
                }
              }
            }
          },
          429: { $ref: '#/components/responses/RateLimit' }
        }
      }
    },
    '/emails': {
      get: {
        summary: 'Get email data',
        description: 'Get email queue, templates, or logs (requires editor role)',
        tags: ['Email'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string', enum: ['queue', 'templates', 'logs'], default: 'queue' },
            description: 'Type of email data to retrieve'
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['queued', 'sending', 'sent', 'failed', 'bounced'] },
            description: 'Filter by email status (for queue type)'
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', maximum: 200, default: 50 },
            description: 'Number of items per page'
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number for pagination'
          }
        ],
        responses: {
          200: {
            description: 'Email data retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      },
      post: {
        summary: 'Queue email',
        description: 'Queue a new email for sending',
        tags: ['Email'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              oneOf: [
                {
                  title: 'Template-based email',
                  type: 'object',
                  required: ['template_name', 'to_email'],
                  properties: {
                    template_name: { type: 'string', description: 'Name of the email template' },
                    to_email: { type: 'string', format: 'email' },
                    to_name: { type: 'string' },
                    variables: { type: 'object', description: 'Template variables' },
                    priority: { type: 'integer', minimum: 1, maximum: 10, default: 5 },
                    scheduled_for: { type: 'string', format: 'date-time' },
                    send_immediately: { type: 'boolean', default: false }
                  }
                },
                {
                  title: 'Direct email',
                  type: 'object',
                  required: ['to_email', 'subject'],
                  properties: {
                    to_email: { type: 'string', format: 'email' },
                    to_name: { type: 'string' },
                    subject: { type: 'string' },
                    body_html: { type: 'string' },
                    body_text: { type: 'string' },
                    from_email: { type: 'string', format: 'email', default: 'noreply@workflo.it' },
                    from_name: { type: 'string', default: 'Workflo' },
                    priority: { type: 'integer', minimum: 1, maximum: 10, default: 5 },
                    scheduled_for: { type: 'string', format: 'date-time' },
                    send_immediately: { type: 'boolean', default: false }
                  }
                }
              ]
            }
          }
        },
        responses: {
          200: {
            description: 'Email queued successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/EmailQueue' }
                      }
                    }
                  ]
                }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' }
        }
      }
    },
    '/webhooks': {
      get: {
        summary: 'Get webhooks data',
        description: 'Get webhook endpoints, deliveries, or stats (requires admin role)',
        tags: ['Webhooks'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string', enum: ['endpoints', 'deliveries', 'stats'], default: 'endpoints' },
            description: 'Type of webhook data to retrieve'
          }
        ],
        responses: {
          200: {
            description: 'Webhook data retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      },
      post: {
        summary: 'Create webhook or trigger delivery',
        description: 'Create webhook endpoint or trigger delivery (requires admin role)',
        tags: ['Webhooks'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              oneOf: [
                {
                  title: 'Create webhook endpoint',
                  type: 'object',
                  required: ['name', 'url', 'events'],
                  properties: {
                    name: { type: 'string' },
                    url: { type: 'string', format: 'uri' },
                    events: { 
                      type: 'array', 
                      items: { 
                        type: 'string', 
                        enum: ['article.created', 'article.updated', 'article.deleted', 'user.created', 'user.updated', 'analytics.daily'] 
                      }
                    },
                    secret_key: { type: 'string', description: 'Auto-generated if not provided' },
                    is_active: { type: 'boolean', default: true },
                    timeout_seconds: { type: 'integer', default: 30 },
                    headers: { type: 'object', description: 'Additional headers to send' }
                  }
                },
                {
                  title: 'Trigger webhook delivery',
                  type: 'object',
                  required: ['action', 'delivery_id'],
                  properties: {
                    action: { type: 'string', enum: ['trigger'] },
                    delivery_id: { type: 'string', format: 'uuid' }
                  }
                }
              ]
            }
          }
        },
        responses: {
          200: {
            description: 'Webhook operation completed successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token for authentication. Include "Bearer " prefix.'
      }
    },
    schemas: {
      Article: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          slug: { type: 'string' },
          excerpt: { type: 'string', nullable: true },
          content: { type: 'string', nullable: true },
          author: { type: 'string' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          image_url: { type: 'string', format: 'uri', nullable: true },
          published: { type: 'boolean' },
          featured: { type: 'boolean' },
          source: { type: 'string', enum: ['cms', 'rss', 'linkedin', 'external'] },
          external_url: { type: 'string', format: 'uri', nullable: true },
          views_count: { type: 'integer' },
          published_at: { type: 'string', format: 'date-time', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      AnalyticsEvent: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          session_id: { type: 'string', nullable: true },
          user_id: { type: 'string', format: 'uuid', nullable: true },
          event_type: { type: 'string', enum: ['page_view', 'article_view', 'download', 'contact', 'search', 'click'] },
          event_name: { type: 'string' },
          page_url: { type: 'string', nullable: true },
          properties: { type: 'object' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      EmailQueue: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          template_id: { type: 'string', format: 'uuid', nullable: true },
          to_email: { type: 'string', format: 'email' },
          to_name: { type: 'string', nullable: true },
          subject: { type: 'string' },
          status: { type: 'string', enum: ['queued', 'sending', 'sent', 'failed', 'bounced'] },
          priority: { type: 'integer' },
          scheduled_for: { type: 'string', format: 'date-time' },
          sent_at: { type: 'string', format: 'date-time', nullable: true },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string', nullable: true },
          timestamp: { type: 'string', format: 'date-time' }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' },
          message: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      Forbidden: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      NotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      RateLimit: {
        description: 'Rate Limit Exceeded',
        headers: {
          'X-RateLimit-Limit': {
            schema: { type: 'integer' },
            description: 'The number of allowed requests in the current period'
          },
          'X-RateLimit-Remaining': {
            schema: { type: 'integer' },
            description: 'The number of remaining requests in the current period'
          },
          'X-RateLimit-Reset': {
            schema: { type: 'string', format: 'date-time' },
            description: 'The time when the rate limit will reset'
          }
        },
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Articles',
      description: 'Article management operations'
    },
    {
      name: 'Analytics',
      description: 'Analytics and tracking operations'
    },
    {
      name: 'Email',
      description: 'Email queue and template management'
    },
    {
      name: 'Webhooks',
      description: 'Webhook endpoint and delivery management'
    }
  ]
}

// ================================================================
// GET /api/v1/docs - Get OpenAPI specification
// ================================================================

export const GET = allowAnonymous(async (req: NextRequest) => {
  const url = new URL(req.url)
  const format = url.searchParams.get('format') || 'json'

  switch (format) {
    case 'json':
      return NextResponse.json(openApiSpec)
    
    case 'yaml':
      // Convert to YAML (simple implementation)
      const yaml = JSON.stringify(openApiSpec, null, 2)
        .replace(/"/g, '')
        .replace(/,$/gm, '')
        .replace(/\{/g, '')
        .replace(/\}/g, '')
        .replace(/\[/g, '- ')
        .replace(/\]/g, '')
      
      return new NextResponse(yaml, {
        headers: {
          'Content-Type': 'application/x-yaml',
          'Content-Disposition': 'attachment; filename="workflo-api.yaml"'
        }
      })
    
    case 'html':
      // Return Swagger UI HTML
      const swaggerHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Workflo API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/v1/docs?format=json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`

      return new NextResponse(swaggerHtml, {
        headers: { 'Content-Type': 'text/html' }
      })
    
    default:
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid format',
          message: 'Supported formats: json, yaml, html'
        },
        { status: 400 }
      )
  }
})