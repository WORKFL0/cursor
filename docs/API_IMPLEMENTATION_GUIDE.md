# Workflo CMS API Implementation Guide

## Overview

This document describes the comprehensive backend API system implemented for Workflo B.V. The system includes advanced CMS functionality, analytics tracking, email queue management, webhook integrations, and robust authentication with rate limiting.

## Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens with role-based access control
- **File Storage**: Local filesystem (can be extended to cloud storage)
- **Documentation**: OpenAPI 3.0 specification with Swagger UI

### API Structure
```
/api/v1/
├── articles/          # Article CRUD operations
│   ├── route.ts       # List & create articles
│   └── [id]/route.ts  # Get, update, delete individual articles
├── analytics/         # Analytics tracking and reporting
│   └── route.ts       # Track events, get analytics data
├── emails/           # Email queue and template management
│   └── route.ts      # Queue emails, manage templates
├── media/            # Media/file upload management
│   └── route.ts      # Upload, list, update media files
├── webhooks/         # Webhook endpoint management
│   └── route.ts      # Manage webhooks, trigger deliveries
└── docs/             # API documentation
    └── route.ts      # OpenAPI spec & Swagger UI
```

## Database Schema

### Enhanced Schema Features
The database includes comprehensive tables for:

- **Content Management**: articles, categories, tags, cms_users
- **Analytics**: analytics_events, visitor_statistics, article_analytics
- **Email System**: email_templates, email_queue, email_delivery_logs
- **Webhooks**: webhook_endpoints, webhook_deliveries
- **Media Library**: media_library with metadata support
- **API Monitoring**: api_rate_limits, api_usage_logs
- **Enhanced Features**: article_comments, newsletter_subscribers

### Key Database Functions
```sql
-- Track article views with analytics
SELECT track_article_view(article_uuid, visitor_ip);

-- Aggregate daily statistics
SELECT aggregate_daily_statistics(target_date);
```

## API Features

### 1. Authentication & Authorization

#### Role-Based Access Control
- **Admin**: Full access to all endpoints
- **Editor**: Can manage content, view analytics
- **Viewer**: Read-only access
- **Anonymous**: Limited public access

#### Middleware Functions
```typescript
import { requireAdmin, requireEditor, allowAnonymous } from '@/lib/middleware/auth'

export const GET = requireEditor(async (req, { user }) => {
  // Handler with editor role required
})
```

#### Rate Limiting
- Configurable per endpoint
- Token bucket algorithm
- Automatic IP-based blocking
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 2. Articles API

#### Endpoints
- `GET /api/v1/articles` - List articles with pagination and filtering
- `POST /api/v1/articles` - Create new article (requires editor)
- `GET /api/v1/articles/{id}` - Get article by ID or slug
- `PUT /api/v1/articles/{id}` - Update article (requires editor)
- `DELETE /api/v1/articles/{id}` - Delete article (requires editor)

#### Features
- **Pagination**: Configurable page size (max 100)
- **Filtering**: By category, tags, published status, author, date range
- **Sorting**: Multiple fields with ascending/descending order
- **Search**: Full-text search across title, content, and excerpt
- **View Tracking**: Automatic analytics tracking for published articles
- **Slug Generation**: Automatic URL-friendly slug creation
- **Webhook Triggers**: Automatic webhook notifications on CRUD operations

#### Example Request
```bash
GET /api/v1/articles?page=1&limit=10&search=microsoft&published=true&sortBy=views_count&sortOrder=desc
```

### 3. Analytics API

#### Capabilities
- **Event Tracking**: Page views, article views, downloads, contacts, searches, clicks
- **Visitor Statistics**: Daily aggregated statistics with device/location data
- **Article Analytics**: View counts, engagement metrics per article
- **Realtime Data**: Live activity monitoring (last 15 minutes)
- **Comprehensive Reporting**: Overview, trends, and detailed analytics

#### Event Tracking
```javascript
POST /api/v1/analytics
{
  "event_name": "article_viewed",
  "event_type": "article_view",
  "page_url": "https://workflo.it/blog/sample-article",
  "properties": {
    "article_id": "uuid",
    "category": "blog"
  }
}
```

#### Analytics Types
- `overview` - Summary statistics and trends
- `visitors` - Daily visitor statistics
- `articles` - Article-specific analytics
- `events` - Raw event data
- `realtime` - Current activity

### 4. Email Queue System

#### Features
- **Template-based Emails**: Reusable templates with variable substitution
- **Direct Emails**: One-off emails without templates
- **Priority Queue**: Configurable priority levels (1-10)
- **Retry Logic**: Exponential backoff for failed deliveries
- **Delivery Tracking**: Comprehensive logging of all email events
- **Scheduled Sending**: Delay email delivery to specific times

#### Email Templates
Support for HTML and text versions with variable substitution:
```html
<h1>Welcome {{name}}!</h1>
<p>Your account {{email}} has been created.</p>
```

#### Queue Management
- Status tracking: `queued`, `sending`, `sent`, `failed`, `bounced`
- Automatic retry with exponential backoff
- Delivery logs with provider responses
- Bulk processing with configurable batch sizes

### 5. Webhook System

#### Features
- **Event Subscriptions**: Subscribe to specific events
- **Signature Verification**: HMAC-SHA256 signatures for security
- **Retry Logic**: Configurable retry attempts with backoff
- **Delivery Tracking**: Complete audit trail of all webhook deliveries
- **Timeout Handling**: Configurable timeout per endpoint
- **Custom Headers**: Additional headers for authentication

#### Supported Events
- `article.created` - New article published
- `article.updated` - Article modified
- `article.deleted` - Article removed
- `user.created` - New user account
- `user.updated` - User profile changes
- `analytics.daily` - Daily analytics summary

#### Webhook Payload Example
```json
{
  "event": "article.created",
  "timestamp": "2025-09-04T10:30:00Z",
  "data": {
    "article": {
      "id": "uuid",
      "title": "New Article",
      "slug": "new-article",
      "published": true
    }
  }
}
```

### 6. Media Management

#### File Upload Features
- **Multiple Format Support**: Images, documents, PDFs
- **Size Validation**: Configurable file size limits
- **Metadata Extraction**: Image dimensions, file properties
- **Organized Storage**: Timestamped, unique filenames
- **Access Control**: Public/private file distinction
- **Usage Tracking**: Track file usage across the system

#### Supported File Types
- Images: JPEG, PNG, GIF, WebP, SVG
- Documents: PDF, DOC, DOCX, TXT
- Configurable MIME type restrictions

## Security Features

### Authentication Security
- JWT token validation
- Role-based access control
- Secure password hashing (bcrypt)
- Session management
- API key support for external integrations

### Rate Limiting
- Per-IP rate limiting
- Configurable windows (per minute/hour/day)
- Automatic blocking of excessive requests
- Rate limit headers in responses

### Input Validation
- Request body validation
- File type and size validation
- SQL injection prevention (parameterized queries)
- XSS protection through proper output encoding

### Webhook Security
- HMAC signature verification
- Configurable secret keys
- Request timeout protection
- Retry limit enforcement

## Documentation

### OpenAPI Specification
- Complete API documentation with examples
- Interactive Swagger UI at `/api/v1/docs?format=html`
- JSON/YAML export formats available
- Request/response schemas
- Authentication examples

### Postman Collection
- Ready-to-use Postman collection with all endpoints
- Environment variables for easy testing
- Example requests with proper authentication
- Automatic variable extraction from responses

## Performance Optimizations

### Database Optimizations
- Comprehensive indexing strategy
- Efficient query patterns with proper joins
- Pagination to prevent large data transfers
- Connection pooling through Supabase

### Caching Strategy
- Rate limiting data cached in memory
- Database query optimization
- Proper use of database functions for complex operations

### API Performance
- Pagination for all list endpoints
- Filtering at database level
- Minimal data transfer with selective field queries
- Asynchronous processing for non-critical operations

## Deployment Guide

### Environment Variables Required
```env
# Database
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Authentication
JWT_SECRET="your-jwt-secret"

# Email Service (configure with your provider)
SMTP_HOST="smtp.your-provider.com"
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-password"
```

### Database Setup
1. Run the migration files in order:
   ```bash
   # Apply existing migrations first
   # Then apply the new enhanced migration
   psql -d your_database -f supabase/migrations/004_enhanced_backend_system.sql
   ```

2. Seed the database with initial data:
   ```bash
   npm run seed:database
   ```

### API Testing
1. Import the Postman collection from `docs/postman-collection.json`
2. Set up environment variables (base_url, jwt_token)
3. Test endpoints in the following order:
   - Documentation endpoints (no auth required)
   - Analytics event tracking (no auth required)
   - Articles API (mixed auth requirements)
   - Admin endpoints (authentication required)

## Monitoring and Maintenance

### API Usage Monitoring
- All API calls logged to `api_usage_logs` table
- Response time tracking
- Error rate monitoring
- User activity tracking

### Email Queue Monitoring
- Email delivery status tracking
- Failed delivery alerts
- Queue size monitoring
- Performance metrics

### Webhook Monitoring
- Delivery success rates
- Retry attempt tracking
- Endpoint health monitoring
- Failure alerting

### Analytics Data
- Daily statistics aggregation (automated)
- Real-time activity monitoring
- Article performance tracking
- User engagement metrics

## Troubleshooting

### Common Issues

#### Authentication Failures
- Verify JWT_SECRET environment variable
- Check token expiration
- Validate user role permissions

#### Rate Limiting
- Check rate limit headers in responses
- Implement exponential backoff in clients
- Configure appropriate rate limits per endpoint

#### Webhook Failures
- Verify endpoint URL accessibility
- Check HMAC signature validation
- Review timeout settings

#### Email Delivery Issues
- Check email provider configuration
- Verify SMTP credentials
- Monitor queue processing

### Debugging Tips
- Enable detailed logging for API calls
- Use the analytics endpoints to track system usage
- Monitor database performance with query analysis
- Check webhook delivery logs for integration issues

## Future Enhancements

### Planned Features
- Redis integration for improved caching
- Advanced search with Elasticsearch
- Real-time notifications via WebSockets
- Advanced analytics with custom dashboards
- Multi-tenant support for different clients
- Advanced file storage with CDN integration
- Email template builder with drag-and-drop interface

### Scalability Considerations
- Database sharding strategies
- API gateway implementation
- Background job processing with queues
- Horizontal scaling patterns
- Caching layers (Redis, CDN)
- Load balancing configurations

---

## Quick Start

1. **Setup Database**:
   ```bash
   # Apply migrations
   psql -d your_db -f supabase/migrations/004_enhanced_backend_system.sql
   
   # Seed initial data
   npm run seed:database
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **View API Documentation**:
   Visit: `http://localhost:3000/api/v1/docs?format=html`

4. **Test API with Postman**:
   Import collection from `docs/postman-collection.json`

The comprehensive backend system is now ready for production use with enterprise-grade features for content management, analytics, email automation, and webhook integrations.