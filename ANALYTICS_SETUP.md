# Analytics & Tracking Setup Guide

## Overview

The Workflo website now has a comprehensive analytics and tracking system with GDPR compliance built-in. This guide explains how to set up and use the analytics features.

## Implemented Tracking Services

1. **Google Analytics 4** - Page views, events, conversions, and user behavior
2. **Microsoft Clarity** - Session recordings and heatmaps
3. **Hotjar** - User behavior tracking and feedback collection
4. **LinkedIn Insight Tag** - B2B marketing and conversion tracking
5. **Facebook Pixel** - Social media marketing and retargeting

## Setup Instructions

### 1. Environment Variables

Copy the analytics environment template to your `.env.local` file:

```bash
cat .env.analytics.example >> .env.local
```

Then fill in your tracking IDs:

```env
# Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-YOUR-ID-HERE
NEXT_PUBLIC_ENABLE_GA4=true

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_PROJECT_ID=your-clarity-id
NEXT_PUBLIC_ENABLE_CLARITY=true

# Hotjar
NEXT_PUBLIC_HOTJAR_SITE_ID=your-hotjar-id
NEXT_PUBLIC_ENABLE_HOTJAR=true

# LinkedIn Insight Tag
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=your-linkedin-id
NEXT_PUBLIC_ENABLE_LINKEDIN=true

# Facebook Pixel
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-facebook-id
NEXT_PUBLIC_ENABLE_FACEBOOK=true
```

### 2. Getting Your Tracking IDs

#### Google Analytics 4
1. Go to [Google Analytics](https://analytics.google.com)
2. Admin > Data Streams > Web > Your Stream
3. Copy the Measurement ID (starts with G-)

#### Microsoft Clarity
1. Go to [Microsoft Clarity](https://clarity.microsoft.com)
2. Settings > Setup > Install tracking code
3. Copy the Project ID from the script

#### Hotjar
1. Go to [Hotjar](https://insights.hotjar.com)
2. Sites & Organizations > Your Site
3. Copy the Site ID from the tracking code

#### LinkedIn Insight Tag
1. Go to [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager)
2. Account Assets > Insight Tag
3. Copy the Partner ID from the tag code

#### Facebook Pixel
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Data Sources > Your Pixel
3. Copy the Pixel ID

### 3. HubSpot Integration

For newsletter and form submissions to work with HubSpot:

```env
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your-portal-id
NEXT_PUBLIC_HUBSPOT_FORM_ID=your-form-id
HUBSPOT_API_KEY=your-api-key
```

## GDPR Compliance

### Cookie Consent Banner

The website includes a GDPR-compliant cookie consent banner that:
- Appears on first visit
- Allows granular control over cookie categories
- Stores consent for 365 days
- Blocks tracking scripts until consent is given

### Cookie Categories

1. **Necessary** - Essential for website function (always enabled)
2. **Analytics** - GA4, Clarity, Hotjar (performance tracking)
3. **Marketing** - LinkedIn, Facebook (advertising & retargeting)
4. **Preferences** - User preferences and settings

### Consent Management

Users can manage their consent through:
- Initial consent banner
- Cookie settings page at `/cookies`
- Privacy policy page at `/privacy`

## Tracked Events

### Automatic Events
- Page views
- Scroll depth (25%, 50%, 75%, 90%, 100%)
- Time on page (30s, 60s, 2min, 5min, 10min)
- JavaScript errors
- 404 errors

### Conversion Events
- Contact form submissions
- Newsletter signups
- Appointment bookings
- Quote requests
- Support tool downloads
- Service page visits

### Custom Events

Use the analytics hook in your components:

```typescript
import { useAnalytics } from '@/hooks/use-analytics'

function MyComponent() {
  const { trackEvent, trackFormSubmit } = useAnalytics()
  
  // Track custom event
  trackEvent('button_click', {
    button_name: 'cta_hero',
    page: 'home'
  })
  
  // Track form submission
  trackFormSubmit('Contact Form', 'contact')
}
```

## Testing Analytics

### 1. Enable Debug Mode

Set in `.env.local`:
```env
NEXT_PUBLIC_ANALYTICS_DEBUG=true
```

### 2. Check Browser Console

With debug mode enabled, all tracking events will be logged to the console.

### 3. Use Browser Extensions

- [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger)
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper)
- [LinkedIn Insight Tag Helper](https://chrome.google.com/webstore/detail/linkedin-insight-tag)

### 4. Verify in Analytics Dashboards

- **GA4**: Realtime > Overview
- **Clarity**: Dashboard > Sessions
- **Hotjar**: Recordings > Latest
- **LinkedIn**: Campaign Manager > Website Demographics
- **Facebook**: Events Manager > Test Events

## Privacy & Data Protection

### Data Minimization
- Only essential data is collected
- PII is hashed before sending to platforms
- IP anonymization is enabled where possible

### User Rights
- Users can opt-out via cookie banner
- Data deletion requests: info@workflo.it
- Privacy policy: `/privacy`

### Data Retention
- GA4: 14 months
- Clarity: 30 days
- Hotjar: 365 days
- LinkedIn: 90 days
- Facebook: 180 days

## Troubleshooting

### Scripts Not Loading
1. Check environment variables are set
2. Verify consent has been given
3. Check for ad blockers
4. Look for CSP violations in console

### Events Not Tracking
1. Enable debug mode
2. Check browser console for errors
3. Verify tracking IDs are correct
4. Test in incognito mode

### Consent Banner Issues
1. Clear cookies and localStorage
2. Check `workflo-cookie-consent` cookie
3. Test in different browsers

## Best Practices

1. **Don't Over-Track**: Focus on actionable metrics
2. **Test Before Deploy**: Use debug mode and test events
3. **Document Custom Events**: Keep track of what you're measuring
4. **Regular Audits**: Review tracked data monthly
5. **Privacy First**: Always respect user consent

## Support

For issues or questions:
- Technical: Create an issue in the repository
- Privacy: info@workflo.it
- Analytics setup: Contact your analytics administrator

## Additional Resources

- [GA4 Documentation](https://developers.google.com/analytics)
- [Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [Hotjar Academy](https://www.hotjar.com/academy/)
- [LinkedIn Marketing API](https://docs.microsoft.com/en-us/linkedin/)
- [Facebook Pixel Guide](https://www.facebook.com/business/help/952192354843755)