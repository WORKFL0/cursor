# HubSpot Forms Integration - Implementation Guide

## Overview

This implementation provides a comprehensive form system that integrates with HubSpot CRM while offering graceful degradation when HubSpot is unavailable. The system includes three main forms: Contact, Newsletter, and Quote Request forms.

## Key Features

### ✅ **Enhanced HubSpot Integration**
- **Retry Logic**: Automatic retry with exponential backoff for failed requests
- **Rate Limit Handling**: Intelligent rate limiting with proper cooldown periods
- **Error Classification**: Distinguishes between temporary and permanent errors
- **Fallback Support**: Gracefully degrades to email-only mode when HubSpot fails

### ✅ **Comprehensive Form Validation**
- **Real-time Validation**: Validates fields as users type
- **Custom Validation Rules**: Extensible validation system with custom rules
- **Multi-language Support**: Dutch and English validation messages
- **Security Features**: Honeypot fields, input sanitization, and CSRF protection

### ✅ **Analytics & Tracking**
- **Google Analytics 4**: Tracks form submissions, errors, and conversions
- **Microsoft Clarity**: Session recordings and heatmap integration
- **Hotjar**: User behavior tracking
- **LinkedIn & Facebook**: Conversion pixel tracking
- **Form Abandonment**: Tracks where users drop off in forms

### ✅ **User Experience**
- **Progress Indicators**: Visual progress bars for multi-step forms
- **Real-time Feedback**: Instant validation feedback and error messages
- **Loading States**: Proper loading indicators and disabled states
- **Success Animations**: Engaging success confirmations
- **Accessibility**: Full ARIA support and keyboard navigation

## Architecture

```
┌─────────────────────────────────────┐
│           Form Components            │
├─────────────────────────────────────┤
│  ├── WorkfloForm (Base Component)   │
│  ├── ContactForm                    │
│  ├── NewsletterForm                 │
│  └── QuoteForm                      │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│         API Routes                  │
├─────────────────────────────────────┤
│  ├── /api/contact                   │
│  ├── /api/newsletter                │
│  └── /api/quote                     │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│          Services                   │
├─────────────────────────────────────┤
│  ├── HubSpot Service               │
│  ├── Email Service (Resend)        │
│  └── Analytics Service             │
└─────────────────────────────────────┘
```

## Installation & Setup

### 1. Environment Variables

Add these variables to your `.env.local`:

```bash
# HubSpot Integration (Optional - forms work without this)
HUBSPOT_ACCESS_TOKEN=pat-na1-your-token-here
HUBSPOT_PORTAL_ID=your-portal-id
HUBSPOT_NEWSLETTER_LIST_ID=your-list-id

# Email Service (Resend)
RESEND_API_KEY=re_your-resend-key-here

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=your-clarity-id
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=your-linkedin-id
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-facebook-id
```

### 2. Dependencies

The system uses these existing dependencies:
- `@hubspot/api-client` - HubSpot API integration
- `resend` - Email service
- `framer-motion` - Animations
- `lucide-react` - Icons
- `zod` (optional) - Additional validation

### 3. Component Usage

#### Basic Contact Form
```tsx
import { ContactForm } from '@/components/forms/ContactForm'

export default function ContactPage() {
  return (
    <ContactForm
      onSuccess={(data) => console.log('Contact form submitted:', data)}
      onError={(error) => console.error('Contact form error:', error)}
    />
  )
}
```

#### Newsletter Signup (Multiple Variants)
```tsx
import { NewsletterForm } from '@/components/forms/NewsletterForm'

// Full newsletter form with benefits
<NewsletterForm variant="default" showBenefits={true} />

// Compact version for sidebars
<NewsletterForm variant="compact" showBenefits={false} />

// Inline for headers/footers
<NewsletterForm variant="inline" />
```

#### Quote Request Form
```tsx
import { QuoteForm } from '@/components/forms/QuoteForm'

<QuoteForm
  preselectedServices={['IT Beheer & Support', 'Cybersecurity']}
  onSuccess={(data) => {
    // Handle successful quote submission
    router.push('/thank-you')
  }}
/>
```

## API Endpoints

### POST /api/contact
Handles contact form submissions with parallel processing:
- HubSpot contact creation/update
- Email notification to team
- Confirmation email to user
- Analytics tracking

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "06-12345678",
  "company": "Example Corp",
  "subject": "it-support",
  "message": "Need help with IT infrastructure",
  "honeypot": ""
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bericht succesvol verzonden...",
  "details": {
    "emailSent": true,
    "confirmationSent": true,
    "hubspotUpdated": true,
    "tracked": true
  }
}
```

### POST /api/newsletter
Handles newsletter subscriptions with fallback:
- Always returns success to avoid blocking users
- Logs failed subscriptions for manual processing
- Supports GDPR compliance features

### POST /api/quote
Handles quote requests with service validation:
- Validates service selections
- Processes budget and timeline preferences
- Creates marketing qualified leads in HubSpot
- Sends detailed quote request emails

## Error Handling & Fallback System

### HubSpot Unavailable Scenario
1. **Detection**: Service checks for API token and connectivity
2. **Fallback Mode**: Switches to email-only notifications
3. **Logging**: Records all submissions for manual processing
4. **User Experience**: Users see success messages regardless
5. **Recovery**: Automatically resumes when HubSpot is available

### Email Service Failure
- Contact forms require email delivery for critical notifications
- Newsletter forms gracefully degrade and log subscriptions
- Quote requests attempt both HubSpot and email, requiring at least one success

### Analytics Failure
- All analytics tracking is optional and non-blocking
- Gracefully handles missing analytics services
- Provides status information for debugging

## Form Validation System

### Built-in Rules
```typescript
// Email validation with domain checking
email: {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  custom: (value: string) => {
    // Custom validation logic
    if (isDisposableEmail(value)) {
      return 'Tijdelijke e-mailadressen worden afgeraden'
    }
    return null
  }
}
```

### Custom Validation
```typescript
import { FormValidator } from '@/lib/utils/form-validation'

const customValidator = new FormValidator({
  specialField: {
    required: true,
    custom: (value: string) => {
      // Your custom validation
      return value.includes('special') ? null : 'Must contain "special"'
    }
  }
})
```

## Analytics Implementation

### Tracking Events
The system automatically tracks:
- Form submissions (success/failure)
- Validation errors
- Form abandonment
- Field interactions
- Conversion events

### Custom Event Tracking
```typescript
import { analyticsService } from '@/lib/services/analytics-service'

// Track custom events
analyticsService.trackCustomEvent('custom_form_interaction', {
  form_type: 'custom',
  interaction_type: 'special_button_click',
  value: 1
})
```

## Testing

### Running Tests
```bash
# Run all form tests
npm run test tests/forms/

# Run specific test
npm run test tests/forms/hubspot-forms.test.ts
```

### Test Coverage
- ✅ HubSpot integration with and without credentials
- ✅ Email service fallback scenarios
- ✅ Form validation edge cases
- ✅ Rate limiting functionality
- ✅ Analytics tracking
- ✅ Error handling and retry logic

### Manual Testing
Visit `/forms-example` to test all form variants interactively.

## Security Features

### Spam Protection
- **Honeypot Fields**: Hidden fields that trap bots
- **Rate Limiting**: Prevents form submission flooding
- **Input Sanitization**: Cleans all user inputs
- **CSRF Protection**: Built into Next.js API routes

### Data Protection
- **GDPR Compliance**: Privacy notices and consent handling
- **Data Minimization**: Only collects necessary information
- **Secure Transmission**: HTTPS-only form submissions
- **Error Logging**: Sanitized error logs without sensitive data

## Performance Optimization

### Client-Side
- **Lazy Loading**: Forms load only when needed
- **Debounced Validation**: Reduces validation calls
- **Optimistic Updates**: Immediate UI feedback
- **Progressive Enhancement**: Works without JavaScript

### Server-Side
- **Parallel Processing**: Simultaneous HubSpot and email operations
- **Connection Pooling**: Efficient API connections
- **Rate Limiting**: Protects against abuse
- **Caching**: Validation rules and configurations cached

## Monitoring & Debugging

### Health Checks
```bash
# Check service status
curl /api/contact      # Returns service health
curl /api/newsletter   # Returns HubSpot/email status
curl /api/quote        # Returns available options
```

### Logs to Monitor
```bash
# HubSpot integration issues
tail -f logs/hubspot.log

# Email delivery issues  
tail -f logs/email.log

# Form validation errors
tail -f logs/validation.log
```

### Common Issues & Solutions

#### "HubSpot service not available"
- Check `HUBSPOT_ACCESS_TOKEN` in environment
- Verify token permissions in HubSpot
- Check API rate limits

#### "Email delivery failed"
- Verify `RESEND_API_KEY` configuration
- Check Resend dashboard for delivery status
- Ensure sender domain is verified

#### Forms not submitting
- Check browser console for JavaScript errors
- Verify CSRF tokens are working
- Check rate limiting isn't blocking requests

## Migration Guide

### From Legacy HubSpot Forms

1. **Replace Components**:
   ```tsx
   // Old
   <HubSpotContactForm />
   
   // New
   <ContactForm />
   ```

2. **Update Styling**:
   - New forms use Tailwind CSS classes
   - Remove old HubSpot form styling
   - Customize with standard CSS/Tailwind

3. **Configure Environment**:
   - Add email service credentials
   - Configure analytics tracking
   - Set up fallback handling

4. **Test Thoroughly**:
   - Test with and without HubSpot
   - Verify email notifications work
   - Check analytics tracking

## Contributing

### Adding New Form Fields
1. Define field in form configuration
2. Add validation rules
3. Update TypeScript interfaces
4. Add tests for new functionality

### Custom Form Types
1. Extend `FormConfig` interface
2. Create new API route
3. Add validation rules
4. Implement analytics tracking

## Support

For issues or questions:
1. Check the test files for examples
2. Review logs for error details
3. Test individual services in isolation
4. Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Compatibility**: Next.js 15, React 18, TypeScript 5