# HubSpot Newsletter Form Setup Guide

## Overview

This guide will help you set up HubSpot newsletter form integration with proper DOM error handling for Next.js 15. The implementation includes error boundaries, cleanup mechanisms, and fallback forms.

## Prerequisites

1. HubSpot account with Forms access
2. HubSpot Private App with necessary scopes
3. Newsletter form created in HubSpot

## Configuration Steps

### 1. HubSpot Account Setup

#### Create Private App
1. Go to HubSpot Settings → Integrations → Private Apps
2. Create new private app: "Workflo Website Integration"
3. Enable scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.lists.read`
   - `crm.lists.write`
4. Copy the access token

#### Create Newsletter Form
1. Go to Marketing → Lead Capture → Forms
2. Create new form: "Website Newsletter Signup"
3. Add fields:
   - Email (required)
   - Language preference (optional)
4. Configure form settings:
   - Set thank you message
   - Enable GDPR compliance
5. Note the Form ID from the embed code

#### Create Newsletter List
1. Go to Contacts → Lists
2. Create new active list: "Website Newsletter Subscribers"
3. Note the List ID from the URL

### 2. Environment Variables

Add to your `.env.local` file:

```bash
# HubSpot Configuration
HUBSPOT_ACCESS_TOKEN=your-hubspot-private-app-token-here
HUBSPOT_NEWSLETTER_LIST_ID=your-list-id-here

# Portal and Form IDs (already configured in component)
# Portal ID: 26510736 (EU1 region)
# Form ID: e92de02c-71b0-4a68-aedd-3b6acb0f5f67
```

### 3. Component Usage

The `HubSpotNewsletterSignup` component supports two variants:

#### Compact Variant (for footers/sidebars)
```tsx
<HubSpotNewsletterSignup variant="compact" />
```

#### Full Variant (for dedicated sections)
```tsx
<HubSpotNewsletterSignup variant="full" />
```

## Features Implemented

### DOM Error Handling
- **Error Boundary**: Catches and recovers from DOM manipulation errors
- **Auto Recovery**: Automatically retries after 100ms delay
- **Fallback Forms**: Custom form when HubSpot fails to load
- **Graceful Degradation**: Maintains functionality even with errors

### Cleanup & Lifecycle
- **Proper Unmounting**: Safely destroys HubSpot form instances
- **Portal Isolation**: Uses React Portal for DOM isolation
- **Memory Management**: Prevents memory leaks with proper cleanup
- **Script Loading**: Handles HubSpot script loading/unloading

### User Experience
- **Loading States**: Shows loading indicators during form initialization
- **Error Messages**: User-friendly error messages
- **Success Animations**: Celebrates successful subscriptions
- **Responsive Design**: Works on all device sizes

### Styling & Animation
- **Framer Motion**: Smooth animations and transitions
- **Workflo Branding**: Yellow theme with proper brand colors
- **Hover Effects**: Interactive elements with feedback
- **Modern Design**: Professional appearance

## API Endpoints

### Newsletter Subscription
- **Endpoint**: `POST /api/newsletter`
- **Payload**:
  ```json
  {
    "email": "user@example.com",
    "language": "nl",
    "source": "Website Newsletter"
  }
  ```
- **Features**: Rate limiting, email validation, disposable email detection

### Newsletter Unsubscription
- **Endpoint**: `DELETE /api/newsletter?email=user@example.com`
- **Response**: Confirmation message

### Health Check
- **Endpoint**: `GET /api/newsletter`
- **Response**: Service status and availability

## Troubleshooting

### Common Issues

#### 1. DOM removeChild Errors
**Problem**: "Failed to execute 'removeChild' on 'Node'" errors in console
**Solution**: The DOM error boundary automatically handles these. No action needed.

#### 2. Form Not Loading
**Problem**: HubSpot form doesn't appear
**Solutions**:
- Check environment variables are set correctly
- Verify HubSpot access token has correct scopes
- Ensure form ID and portal ID are correct
- Check network connectivity to HubSpot

#### 3. Submissions Not Working
**Problem**: Form submits but doesn't add to HubSpot
**Solutions**:
- Verify list ID is correct
- Check API token permissions
- Review HubSpot logs in the private app settings

#### 4. Styling Issues
**Problem**: Form doesn't match site design
**Solutions**:
- Custom styling is applied automatically
- Check Tailwind CSS classes are loading
- Verify CSS custom properties for Workflo yellow

### Error Monitoring

The component includes comprehensive error logging:
- DOM errors are caught and logged with context
- HubSpot API errors are captured and reported
- Network issues are handled gracefully
- User actions are tracked for debugging

### Performance Considerations

- Script loading is optimized and cached
- Forms are lazy-loaded when visible
- Error boundaries prevent cascading failures
- Memory usage is minimized with proper cleanup

## Testing

### Manual Testing
1. Visit `/newsletter-demo` to test both variants
2. Try subscribing with valid email
3. Test with invalid email addresses
4. Check mobile responsiveness
5. Verify error handling with network disabled

### Browser Console
- No JavaScript errors should appear
- DOM manipulation warnings are handled
- Successful submissions logged

### HubSpot Dashboard
- New contacts should appear in contact list
- Newsletter list should show new subscribers
- Form analytics should track submissions

## Security Features

- **Rate Limiting**: 3 submissions per minute per IP
- **Email Validation**: Server-side validation
- **Disposable Email Detection**: Blocks temporary email services
- **GDPR Compliance**: Privacy-focused implementation
- **XSS Protection**: Sanitized inputs and outputs

## Browser Compatibility

- **Modern Browsers**: Full functionality
- **Older Browsers**: Graceful degradation
- **Mobile Safari**: Tested and optimized
- **Chrome/Firefox/Edge**: Full support

## Support

For issues or questions:
1. Check this guide first
2. Review browser console for errors
3. Check HubSpot dashboard for API issues
4. Test with `/newsletter-demo` page
5. Contact development team with specific error messages

## Future Enhancements

Planned improvements:
- A/B testing for form variations
- Analytics integration
- Advanced segmentation
- Multi-language form support
- Enhanced accessibility features