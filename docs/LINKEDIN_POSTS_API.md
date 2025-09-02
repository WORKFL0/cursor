# LinkedIn Posts API Documentation

## Overview

The LinkedIn Posts API provides comprehensive access to Workflo's LinkedIn posts data, specifically designed for n8n workflow integration and external consumption. The API supports filtering, pagination, sorting, and includes robust error handling with CORS support.

## Base URL

```
https://your-domain.com/api/linkedin-posts
```

## Authentication

### GET Requests
No authentication required for reading posts.

### POST Requests
Authentication is required for creating posts. Use one of the following methods:

#### API Key (Recommended for n8n)
```
X-API-Key: your-api-key-here
```

#### Bearer Token
```
Authorization: Bearer your-token-here
```

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per client
- **Headers**: Rate limit information is included in response headers
- **Status Code**: 429 when limit exceeded

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693225200
Retry-After: 60 (only when limit exceeded)
```

## Endpoints

### GET /api/linkedin-posts

Retrieve LinkedIn posts with filtering, pagination, and sorting capabilities.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of posts to return (1-100) |
| `offset` | number | 0 | Pagination offset |
| `sort` | string | newest | Sort order: `newest`, `oldest`, `engagement` |
| `author` | string | - | Filter by author name (partial match, case-insensitive) |
| `from` | string | - | Filter posts from this date (ISO string) |
| `to` | string | - | Filter posts until this date (ISO string) |
| `includeMetrics` | boolean | false | Include engagement metrics (likes, comments, shares) |
| `format` | string | summary | Response format: `summary` or `full` |

#### Example Requests

```bash
# Basic request
GET /api/linkedin-posts

# With pagination and sorting
GET /api/linkedin-posts?limit=20&offset=0&sort=newest

# With filtering
GET /api/linkedin-posts?author=Workflo&from=2025-08-01&to=2025-08-31

# Full format with metrics
GET /api/linkedin-posts?format=full&includeMetrics=true

# n8n optimized request
GET /api/linkedin-posts?limit=50&sort=engagement&format=full&includeMetrics=true
```

#### Response Format

##### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "li-real-1",
      "author": "Workflo B.V.",
      "content": "🎯 Just completed another successful Microsoft 365 migration...",
      "url": "https://www.linkedin.com/company/workflo/",
      "publishedAt": "2025-08-26T00:00:00.000Z",
      "type": "linkedin"
    }
  ],
  "pagination": {
    "offset": 0,
    "limit": 10,
    "total": 3,
    "hasMore": false
  },
  "meta": {
    "requestId": "req_1693225200_abc123",
    "timestamp": "2025-08-28T10:00:00.000Z",
    "processingTime": 15,
    "filters": {
      "sort": "newest"
    }
  }
}
```

##### Full Format Response
When `format=full` and `includeMetrics=true`:

```json
{
  "success": true,
  "data": [
    {
      "id": "li-real-1",
      "author": "Workflo B.V.",
      "content": "🎯 Just completed another successful Microsoft 365 migration...",
      "url": "https://www.linkedin.com/company/workflo/",
      "publishedAt": "2025-08-26T00:00:00.000Z",
      "type": "linkedin",
      "likes": 67,
      "comments": 18,
      "shares": 12,
      "isExternal": true,
      "contentPreview": "🎯 Just completed another successful Microsoft 365 migration for an Amsterdam creative agency! 📈 The results: 50% faster file sharing...",
      "engagement": {
        "total": 217,
        "likesRatio": 0.69,
        "commentsRatio": 0.19,
        "sharesRatio": 0.12
      }
    }
  ],
  // ... pagination and meta
}
```

##### n8n Optimized Response
When User-Agent contains 'n8n':

```json
{
  "success": true,
  "data": [
    {
      "id": "li-real-1",
      "author": "Workflo B.V.",
      "content": "🎯 Just completed another successful Microsoft 365 migration...",
      "url": "https://www.linkedin.com/company/workflo/",
      "publishedAt": "2025-08-26T00:00:00.000Z",
      "engagementMetrics": {
        "likes": 67,
        "comments": 18,
        "shares": 12,
        "total": 217
      },
      "metadata": {
        "source": "workflo-api",
        "version": "1.0.0",
        "fetchedAt": "2025-08-28T10:00:00.000Z"
      }
    }
  ],
  // ... pagination and meta
  "meta": {
    // ... standard meta
    "n8nFormatted": true,
    "integrationType": "n8n"
  }
}
```

### POST /api/linkedin-posts

Create a new LinkedIn post. Requires authentication.

#### Request Body

```json
{
  "author": "Workflo B.V.",
  "content": "Your LinkedIn post content here...",
  "url": "https://www.linkedin.com/posts/workflo-it_...",
  "publishedAt": "2025-08-28T10:00:00.000Z", // optional
  "likes": 10, // optional
  "comments": 2, // optional
  "shares": 1 // optional
}
```

#### Validation Rules

- **author**: Required, max 100 characters
- **content**: Required, max 3000 characters
- **url**: Required, must be valid LinkedIn URL
- **publishedAt**: Optional, must be valid ISO date, cannot be in future
- **likes**, **comments**, **shares**: Optional, must be non-negative integers

#### Example Request

```bash
curl -X POST /api/linkedin-posts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "author": "Workflo B.V.",
    "content": "🚀 Exciting news! We just launched our new cybersecurity service...",
    "url": "https://www.linkedin.com/posts/workflo-it_cybersecurity-launch-activity-1234567890",
    "likes": 5,
    "comments": 2,
    "shares": 1
  }'
```

#### Response Format

##### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "li-1693225200-abc123",
    "message": "LinkedIn post created successfully",
    "post": {
      "id": "li-1693225200-abc123",
      "author": "Workflo B.V.",
      "content": "🚀 Exciting news! We just launched our new cybersecurity service...",
      "url": "https://www.linkedin.com/posts/workflo-it_cybersecurity-launch-activity-1234567890",
      "publishedAt": "2025-08-28T10:00:00.000Z",
      "type": "linkedin",
      "likes": 5,
      "comments": 2,
      "shares": 1,
      "isExternal": true,
      "contentPreview": "🚀 Exciting news! We just launched our new cybersecurity service...",
      "engagement": {
        "total": 21,
        "likesRatio": 0.625,
        "commentsRatio": 0.25,
        "sharesRatio": 0.125
      }
    }
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "timestamp": "2025-08-28T10:00:00.000Z",
  "requestId": "req_1693225200_abc123",
  "validation": [ // Only for validation errors
    {
      "field": "content",
      "message": "Content is required",
      "code": "REQUIRED"
    }
  ]
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required or invalid |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `GET_POSTS_ERROR` | 500 | Failed to retrieve posts |
| `CREATE_POST_ERROR` | 500 | Failed to create post |
| `INVALID_JSON` | 400 | Malformed JSON in request body |

### Validation Error Codes

| Code | Description |
|------|-------------|
| `REQUIRED` | Field is required |
| `MAX_LENGTH` | Field exceeds maximum length |
| `INVALID_URL` | Invalid URL format |
| `INVALID_DATE` | Invalid date format |
| `FUTURE_DATE` | Date cannot be in future |
| `INVALID_DOMAIN` | URL domain not allowed |
| `INVALID_NUMBER` | Invalid number format |

## n8n Integration Guide

### Setting up HTTP Request Node

1. **URL**: `https://your-domain.com/api/linkedin-posts`
2. **Method**: `GET` (for retrieving posts) or `POST` (for creating posts)
3. **Headers**:
   ```json
   {
     "Content-Type": "application/json",
     "User-Agent": "n8n-workflow",
     "X-API-Key": "your-api-key" // For POST requests only
   }
   ```

### Recommended Parameters for n8n

```
?limit=50&sort=newest&format=full&includeMetrics=true
```

This provides comprehensive data suitable for workflow processing.

### Example n8n Workflow

```json
{
  "nodes": [
    {
      "parameters": {
        "url": "https://your-domain.com/api/linkedin-posts",
        "options": {
          "queryParameters": {
            "limit": 20,
            "sort": "engagement",
            "format": "full",
            "includeMetrics": "true"
          },
          "headers": {
            "User-Agent": "n8n-workflow"
          }
        }
      },
      "name": "Get LinkedIn Posts",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}
```

### Error Handling in n8n

Use the "Continue on Fail" option and check the response status:

```javascript
// In a Function node
if ($json.success === false) {
  if ($json.code === 'RATE_LIMIT_EXCEEDED') {
    // Wait and retry
    return { 
      retry: true, 
      delay: $json.rateLimit.retryAfter * 1000 
    };
  }
  throw new Error($json.error);
}
return $json.data;
```

## CORS Configuration

The API supports cross-origin requests from:
- `localhost:3000` (development)
- `workflo.it` and subdomains
- `*.n8n.cloud` and `*.n8n.io` domains

Additional domains can be added to the configuration.

## Security Considerations

1. **API Keys**: Store securely, rotate regularly
2. **Rate Limiting**: Implement exponential backoff in clients
3. **HTTPS**: Always use HTTPS in production
4. **Input Validation**: All inputs are validated and sanitized
5. **CORS**: Configured for specific domains only

## Monitoring and Logging

The API includes comprehensive logging for:
- All requests and responses
- Authentication failures
- Rate limit violations
- Errors and exceptions
- Performance metrics

Logs include request IDs for correlation and debugging.

## Examples

### Fetch Latest Posts for Dashboard
```bash
curl "https://your-domain.com/api/linkedin-posts?limit=5&sort=newest&format=full&includeMetrics=true"
```

### Fetch Posts by Author
```bash
curl "https://your-domain.com/api/linkedin-posts?author=Workflo&format=summary"
```

### Fetch Posts by Date Range
```bash
curl "https://your-domain.com/api/linkedin-posts?from=2025-08-01&to=2025-08-31&sort=engagement"
```

### Create New Post
```bash
curl -X POST "https://your-domain.com/api/linkedin-posts" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "author": "Workflo B.V.",
    "content": "New post content...",
    "url": "https://www.linkedin.com/posts/workflo-it_..."
  }'
```

## Support

For technical support or questions about the API:
- Check the error messages and codes
- Review this documentation
- Contact the development team with request IDs for debugging

## Changelog

### v1.0.0
- Initial release
- GET endpoint with filtering, pagination, sorting
- POST endpoint with authentication
- n8n optimized responses
- Comprehensive error handling
- Rate limiting and CORS support