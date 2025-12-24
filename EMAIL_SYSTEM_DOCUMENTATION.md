# Complete Email System Documentation

## Overview

Production-ready email system using Resend API with comprehensive validation, retry logic, rate limiting, and spam protection.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser/App)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes Layer                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ /api/       │  │ /api/        │  │ /api/        │       │
│  │ contact-v2  │  │ quote-v2     │  │ newsletter-v2│       │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                │                  │                │
│         ▼                ▼                  ▼                │
│  ┌──────────────────────────────────────────────────┐       │
│  │          Zod Validation Layer                    │       │
│  │  - Schema validation                             │       │
│  │  - Type safety                                   │       │
│  │  - Disposable email blocking                     │       │
│  └──────────────────┬───────────────────────────────┘       │
└────────────────────┬┴───────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────────┐    ┌───────────────────┐
│  Email Service    │    │  HubSpot Service  │
│  - Resend API     │    │  - CRM            │
│  - Retry logic    │    │  - Contact mgmt   │
│  - Templates      │    │  - Analytics      │
└─────────┬─────────┘    └─────────┬─────────┘
          │                        │
          ▼                        ▼
┌───────────────────┐    ┌───────────────────┐
│   Resend API      │    │   HubSpot API     │
└───────────────────┘    └───────────────────┘
```

## Components

### 1. Validation Layer (`/lib/validations/forms.ts`)

**Purpose**: Type-safe validation using Zod schemas

**Features**:
- Email validation with disposable domain blocking
- Phone number validation (8-15 digits)
- Name validation (requires first + last name)
- Service/budget/timeline enum validation
- Honeypot field detection
- Custom error messages in Dutch

**Example Usage**:
```typescript
import { contactFormSchema, validateSchema } from '@/lib/validations/forms'

const result = validateSchema(contactFormSchema, data)
if (!result.success) {
  return NextResponse.json(validationError(result.errors), { status: 400 })
}
```

### 2. Email Service (`/lib/services/email-service.ts`)

**Purpose**: Unified email sending with Resend API

**Features**:
- ✅ Retry logic with exponential backoff (3 retries, 1s → 2s → 4s)
- ✅ Email validation before sending
- ✅ HTML + plain text templates
- ✅ Tag-based categorization
- ✅ Environment-based configuration
- ✅ Detailed error logging

**Configuration**:
```env
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@workflo.nl
RESEND_TO_EMAIL=info@workflo.nl
```

**Email Types**:
1. **Contact Form**
   - Notification to team
   - Confirmation to user

2. **Quote Request**
   - Notification to team (with urgency indicator)
   - Confirmation to user

3. **Newsletter**
   - Welcome email to subscriber

4. **Referral**
   - Notification to team
   - Thank you to referrer
   - Introduction to referred company

**Retry Logic**:
```typescript
// Exponential backoff: 1s → 2s → 4s (max 10s)
private async retryWithBackoff<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T>
```

### 3. API Routes

#### `/app/api/contact-v2/route.ts`

**POST**: Submit contact form
```typescript
{
  name: string,           // Required, min 2 chars
  email: string,          // Required, valid email
  phone?: string,         // Optional, 8-15 digits
  company?: string,       // Optional
  subject: string,        // Required, 5-100 chars
  message: string,        // Required, 10-2000 chars
  services?: string[],    // Optional
  honeypot?: string       // Must be empty
}
```

**Features**:
- CSRF protection
- Rate limiting (5 req/min per IP)
- Zod validation
- Parallel email + HubSpot submission
- Honeypot spam detection

**Response**:
```typescript
{
  success: true,
  message: string,
  details: {
    emailSent: boolean,
    confirmationSent: boolean,
    hubspotUpdated: boolean,
    tracked: boolean
  }
}
```

#### `/app/api/quote-v2/route.ts`

**POST**: Submit quote request
```typescript
{
  name: string,
  email: string,
  phone?: string,
  company?: string,
  services: string[],      // 1-5 services from VALID_SERVICES
  budget?: string,         // From VALID_BUDGETS
  timeline?: string,       // From VALID_TIMELINES
  description: string,     // 20-1500 chars
  urgency?: 'low'|'medium'|'high',  // Default: 'medium'
  honeypot?: string
}
```

**Features**:
- Stricter rate limiting (2 req/min)
- Urgency-based email subjects
- Service validation against whitelist
- Budget/timeline enum validation

#### `/app/api/newsletter-v2/route.ts`

**POST**: Subscribe to newsletter
```typescript
{
  email: string,
  language?: 'nl'|'en',    // Default: 'nl'
  source?: string          // Default: 'Website Newsletter'
}
```

**Features**:
- Disposable email blocking
- Duplicate subscription handling
- Welcome email on successful subscription
- Graceful fallback if HubSpot unavailable

**DELETE**: Unsubscribe from newsletter
```
DELETE /api/newsletter-v2?email=user@example.com
```

### 4. Security Features

#### Rate Limiting
```typescript
// In-memory store (use Redis in production)
const rateLimits = {
  contact: { windowMs: 60000, max: 5 },      // 5 per minute
  quote: { windowMs: 60000, max: 2 },        // 2 per minute
  newsletter: { windowMs: 60000, max: 3 }    // 3 per minute
}
```

#### CSRF Protection
- Origin validation
- Referer checking
- Configurable allowed origins

#### Spam Protection
1. **Honeypot fields** - Hidden fields that bots fill out
2. **Disposable email blocking** - Blocks temp email services
3. **Rate limiting** - Prevents brute force attempts
4. **Email validation** - Regex + format checking
5. **Input sanitization** - Removes HTML/JS from inputs

#### Input Sanitization
```typescript
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .replace(/[<>]/g, '')            // Remove HTML tags
    .replace(/javascript:/gi, '')    // Remove JS protocol
    .replace(/on\w+=/gi, '')         // Remove event handlers
}
```

## Email Templates

### Professional Styling
- Workflo brand colors (yellow #f2f400)
- Responsive design
- Both HTML and plain text versions
- Consistent footer with contact info

### Template Structure
```html
<!DOCTYPE html>
<html lang="nl">
<head>
    <!-- Styles -->
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Logo & title -->
        </div>
        <div class="content">
            <!-- Main content -->
        </div>
        <div class="footer">
            <!-- Contact info & unsubscribe -->
        </div>
    </div>
</body>
</html>
```

## Error Handling

### Email Service Errors
```typescript
interface EmailSendResult {
  success: boolean
  messageId?: string  // Resend message ID
  error?: string      // Error message
}
```

### API Error Responses
```typescript
{
  success: false,
  error: string,              // User-friendly message
  code: string,               // Error code (e.g., 'VALIDATION_ERROR')
  details?: Record<string, any>,  // Additional context
  retryAfter?: number         // For rate limiting
}
```

### Error Codes
- `VALIDATION_ERROR` - Invalid input data
- `CSRF_ERROR` - CSRF validation failed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `EMAIL_SEND_FAILED` - Email delivery failed
- `SERVICE_UNAVAILABLE` - External service down
- `INTERNAL_ERROR` - Unexpected server error

## Testing

### Manual Testing

**Contact Form**:
```bash
curl -X POST http://localhost:3000/api/contact-v2 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "name": "Jan de Vries",
    "email": "jan@example.com",
    "phone": "+31612345678",
    "company": "Test B.V.",
    "subject": "Test contactformulier",
    "message": "Dit is een test bericht met meer dan 10 karakters.",
    "services": ["IT Beheer & Support"]
  }'
```

**Quote Request**:
```bash
curl -X POST http://localhost:3000/api/quote-v2 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "name": "Jan de Vries",
    "email": "jan@example.com",
    "phone": "+31612345678",
    "company": "Test B.V.",
    "services": ["IT Beheer & Support", "Cybersecurity"],
    "budget": "€5.000 - €15.000",
    "timeline": "1-3 maanden",
    "description": "We zoeken een IT-partner voor proactief IT-beheer en cybersecurity ondersteuning.",
    "urgency": "high"
  }'
```

**Newsletter**:
```bash
curl -X POST http://localhost:3000/api/newsletter-v2 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "email": "jan@example.com",
    "language": "nl"
  }'
```

### Validation Testing

**Test invalid email**:
```bash
# Should return VALIDATION_ERROR
curl -X POST http://localhost:3000/api/contact-v2 \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}'
```

**Test disposable email**:
```bash
# Should return error about disposable email
curl -X POST http://localhost:3000/api/newsletter-v2 \
  -H "Content-Type: application/json" \
  -d '{"email": "test@10minutemail.com"}'
```

**Test honeypot**:
```bash
# Should return success but not send email
curl -X POST http://localhost:3000/api/contact-v2 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Test message",
    "honeypot": "bot-filled-this"
  }'
```

**Test rate limiting**:
```bash
# Send 6 requests rapidly (should get rate limited on 6th)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact-v2 \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
  echo "\nRequest $i"
done
```

## Monitoring & Logging

### Console Logs
```typescript
// Success logs
console.log('Contact form email sent successfully:', messageId)
console.log('Newsletter subscription successful via HubSpot:', { email, contactId })

// Warning logs
console.warn('Rate limit exceeded for contact form')
console.warn('Honeypot triggered, potential spam:', { email, name })

// Error logs
console.error('Critical: Contact form notification failed', error)
console.error('Failed to send email after retries:', error)
```

### Metrics to Monitor
1. **Email delivery rate** - Success/failure ratio
2. **API response times** - P50, P95, P99
3. **Rate limit hits** - Frequency of rate limiting
4. **Validation failures** - Common validation errors
5. **Retry attempts** - How often retries are needed
6. **Honeypot triggers** - Spam attempt frequency

## Production Deployment

### Environment Variables
```env
# Required
RESEND_API_KEY=re_xxx

# Optional (with defaults)
RESEND_FROM_EMAIL=noreply@workflo.nl
RESEND_TO_EMAIL=info@workflo.nl

# HubSpot (optional)
HUBSPOT_API_KEY=xxx
```

### Checklist
- [ ] Set RESEND_API_KEY in production environment
- [ ] Verify domain in Resend dashboard
- [ ] Configure SPF/DKIM for workflo.nl domain
- [ ] Test all API endpoints in production
- [ ] Set up monitoring/alerting
- [ ] Configure Redis for rate limiting (optional but recommended)
- [ ] Review and adjust rate limits for production traffic
- [ ] Test email deliverability to major providers (Gmail, Outlook, etc.)

### Performance Considerations

**Current Implementation** (in-memory):
- Rate limiting: In-memory Map
- ✅ Good for: Low-medium traffic
- ❌ Issue: Resets on server restart
- ❌ Issue: Doesn't work across multiple instances

**Production Recommendation**:
- Use Redis for rate limiting
- Use message queue for email sending (optional)
- Implement proper database for fallback storage

## Troubleshooting

### Common Issues

**Emails not sending**:
1. Check RESEND_API_KEY is set
2. Verify domain is configured in Resend
3. Check email service logs for errors
4. Verify SPF/DKIM records

**Validation failures**:
1. Check Zod schema matches frontend
2. Verify error messages are displayed
3. Test with various inputs

**Rate limiting too strict**:
1. Adjust limits in rate-limiter config
2. Consider user-based instead of IP-based limiting
3. Whitelist trusted IPs if needed

**HubSpot integration failing**:
1. Check HubSpot API key
2. Verify HubSpot service availability
3. Review HubSpot error logs
4. Note: System gracefully degrades if HubSpot unavailable

## Future Enhancements

1. **Email Queue System**
   - Background job processing
   - Retry failed emails
   - Better scalability

2. **Advanced Analytics**
   - Email open/click tracking
   - Conversion tracking
   - A/B testing for templates

3. **Template Engine**
   - Dynamic template loading
   - Multi-language support
   - Personalization variables

4. **Enhanced Security**
   - reCAPTCHA integration
   - Advanced bot detection
   - IP reputation checking

5. **Database Persistence**
   - Store all submissions in database
   - Audit trail for compliance
   - Better fallback handling

6. **Multi-channel Notifications**
   - Slack notifications for urgent quotes
   - SMS for critical messages
   - Webhook integrations

## API Reference

### GET Endpoints

All v2 API routes support GET requests for health checks:

```bash
# Contact API health
GET /api/contact-v2
Response: {
  message: string,
  timestamp: string,
  services: { email: boolean, hubspot: boolean },
  validation: { schema: string, features: string[] }
}

# Quote API health + form options
GET /api/quote-v2
Response: {
  ...health info,
  formOptions: {
    validServices: string[],
    validBudgets: string[],
    validTimelines: string[],
    urgencyLevels: string[]
  }
}

# Newsletter API health
GET /api/newsletter-v2
Response: {
  ...health info
}
```

## Support

For issues or questions:
- Email: info@workflo.nl
- Phone: 020-30 80 465
- GitHub: Create an issue in the repository

## License

Proprietary - Workflo B.V. © 2025
