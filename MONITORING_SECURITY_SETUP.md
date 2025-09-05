# Monitoring & Security Setup Guide

This document outlines the comprehensive monitoring and security infrastructure implemented for the Workflo IT Services Next.js project.

## 🔒 Security Headers

### Implemented Security Headers

The application includes production-ready security headers configured in `next.config.ts`:

- **X-Frame-Options**: `DENY` - Prevents clickjacking attacks
- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-XSS-Protection**: `1; mode=block` - Enables XSS filtering
- **Strict-Transport-Security**: HSTS with 1-year max-age and preload
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information
- **Permissions-Policy**: Restricts access to sensitive browser APIs
- **Content-Security-Policy**: Comprehensive CSP with separate dev/prod configurations

### Content Security Policy (CSP)

**Production CSP includes allowlisted domains for:**
- Analytics: Google Analytics, Microsoft Clarity, LinkedIn, Facebook
- Error Monitoring: Sentry
- Fonts: Google Fonts
- Media: YouTube, Vimeo
- Strict object restrictions and frame ancestors policy

## 📊 Monitoring Stack

### 1. Error Monitoring - Sentry

**Configuration Files:**
- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking
- `next.config.ts` - Webpack plugin configuration

**Features Enabled:**
- Session Replay (1% production, 10% development)
- Performance monitoring with 10% trace sampling
- Error filtering for network and chunk loading errors
- Source maps upload for debugging
- Custom tags and context

**Environment Variables Required:**
```env
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=workflo
SENTRY_PROJECT=new-project
SENTRY_AUTH_TOKEN=your-auth-token
NEXT_PUBLIC_SENTRY_DSN=your-public-dsn
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

### 2. Analytics - Google Analytics 4

**Component:** `components/analytics/google-analytics.tsx`

**Advanced Features:**
- Enhanced measurement (scrolls, outbound clicks, downloads)
- Custom event tracking (form submissions, time on page)
- Privacy-compliant configuration
- Automatic error tracking
- Scroll depth measurement
- E-commerce tracking ready

**Environment Variables:**
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
ENABLE_ANALYTICS=true
```

### 3. User Behavior Analytics - Microsoft Clarity

**Component:** `components/analytics/microsoft-clarity.tsx`

**Advanced Features:**
- Custom event tracking (form interactions, button clicks)
- Rage click detection
- Scroll milestone tracking
- GDPR-compliant data masking
- Custom tags for segmentation
- Performance debugging integration

**Environment Variables:**
```env
NEXT_PUBLIC_CLARITY_ID=your-clarity-id
```

### 4. Health Monitoring

**Endpoint:** `/api/health`

**Health Check Features:**
- Database connectivity testing
- Memory usage monitoring
- Response time tracking
- External services verification
- Environment variables validation
- Comprehensive status reporting

**Response Format:**
```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "checks": {
    "database": {"status": "pass", "message": "..."},
    "memory": {"status": "pass", "data": {...}},
    "environment": {"status": "pass"},
    "external_services": {"status": "pass"}
  },
  "meta": {
    "version": "1.0.0",
    "environment": "production",
    "uptime": 3600
  }
}
```

## 🚀 Uptime Monitoring

### Supported Monitoring Services

**1. UptimeRobot**
```env
UPTIME_ROBOT_API_KEY=ur-api-key-here
UPTIME_ROBOT_ALERT_CONTACTS=contact-id-1,contact-id-2
```

**2. Pingdom**
```env
PINGDOM_API_KEY=your-api-key
PINGDOM_USERNAME=your-username
PINGDOM_PASSWORD=your-password
```

**3. Healthchecks.io**
```env
HEALTHCHECKS_IO_PING_URL=https://hc-ping.com/uuid
```

**4. Uptime Kuma (Self-hosted)**
```env
UPTIME_KUMA_WEBHOOK_URL=https://your-instance.com/api/push/id
```

### Monitored Endpoints

1. **Homepage** (`/`) - 5-minute intervals
2. **API Health** (`/api/health`) - 1-minute intervals  
3. **Database Health** (`/api/health/database`) - 5-minute intervals
4. **Authentication Service** (`/api/auth/status`) - 5-minute intervals

### Performance Thresholds

```typescript
responseTime: {
  warning: 2000ms,  // 2 seconds
  critical: 5000ms  // 5 seconds
}
availability: {
  warning: 99.5%,
  critical: 99.0%
}
errorRate: {
  warning: 1.0%,
  critical: 5.0%
}
```

## 🔔 Alerting Configuration

### Alert Channels

**Email Alerts:**
```env
ENABLE_EMAIL_ALERTS=true
ALERT_EMAIL_RECIPIENTS=admin@workflo.it,ops@workflo.it
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-smtp-password
```

**Slack Integration:**
```env
ENABLE_SLACK_ALERTS=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
SLACK_ALERT_CHANNEL=#alerts
```

**Webhook Notifications:**
```env
ENABLE_WEBHOOK_ALERTS=true
WEBHOOK_ALERT_URL=https://your-webhook-endpoint.com
WEBHOOK_AUTH_TOKEN=your-auth-token
```

## 📈 Status Page Integration

**Statuspage.io Configuration:**
```env
STATUSPAGE_API_KEY=your-api-key
STATUSPAGE_PAGE_ID=your-page-id
```

**Monitored Components:**
- Website (Main Workflo site)
- API (Backend services)
- Database (Data persistence)

## 🛠 Implementation Steps

### 1. Environment Setup

1. Copy `.env.example` to `.env.local`
2. Configure required environment variables
3. Test configurations with `npm run dev`

### 2. Sentry Setup

1. Create Sentry project at [sentry.io](https://sentry.io)
2. Copy DSN and configure environment variables
3. Generate auth token for source maps
4. Deploy and verify error tracking

### 3. Analytics Setup

1. **Google Analytics:**
   - Create GA4 property
   - Copy measurement ID
   - Configure enhanced e-commerce if needed

2. **Microsoft Clarity:**
   - Create project at [clarity.microsoft.com](https://clarity.microsoft.com)
   - Copy project ID
   - Configure privacy settings

### 4. Monitoring Setup

Choose one or more monitoring services:

**UptimeRobot (Recommended for simplicity):**
1. Create account at [uptimerobot.com](https://uptimerobot.com)
2. Add monitors for key endpoints
3. Configure alert contacts
4. Set up status page

**Pingdom (Professional monitoring):**
1. Create account at [pingdom.com](https://pingdom.com)
2. Add uptime checks
3. Configure integrations (email, Slack, PagerDuty)
4. Set up performance monitoring

**Self-hosted Uptime Kuma:**
1. Deploy Uptime Kuma instance
2. Configure monitors through web interface
3. Set up notifications
4. Configure status page

### 5. Vercel Deployment Configuration

Add environment variables to Vercel:

```bash
# Using Vercel CLI
vercel env add SENTRY_DSN
vercel env add NEXT_PUBLIC_SENTRY_DSN
vercel env add NEXT_PUBLIC_GA_ID
vercel env add NEXT_PUBLIC_CLARITY_ID
# ... add all monitoring variables
```

### 6. Verification

1. **Health Check:** Visit `/api/health` and verify response
2. **Error Tracking:** Trigger test error and check Sentry
3. **Analytics:** Verify events in GA4 and Clarity dashboards  
4. **Monitoring:** Confirm uptime checks are working
5. **Alerts:** Test notification channels

## 🔧 Troubleshooting

### Common Issues

**CSP Violations:**
- Check browser console for CSP errors
- Add necessary domains to CSP allowlist
- Test in incognito mode

**Monitoring Alerts:**
- Verify webhook URLs are accessible
- Check API key validity
- Confirm environment variables in production

**Analytics Not Working:**
- Verify measurement IDs are correct
- Check ad blockers aren't interfering
- Confirm consent management if implemented

### Debug Mode

Enable debug logging:
```env
NEXT_PUBLIC_ANALYTICS_DEBUG=true
SENTRY_ENABLE_DEV=true
```

## 📚 Best Practices

### Security
- Regularly review and update CSP policies
- Monitor Sentry for new error patterns
- Keep security headers updated with latest standards
- Implement proper input validation and sanitization

### Performance
- Monitor Core Web Vitals in GA4
- Set up Sentry performance monitoring
- Use health checks for proactive monitoring
- Implement proper caching strategies

### Privacy
- Respect user privacy choices
- Implement GDPR-compliant analytics
- Use data masking for sensitive information
- Provide clear privacy policies

### Monitoring
- Set meaningful alert thresholds
- Avoid alert fatigue with proper filtering
- Monitor business metrics alongside technical metrics
- Regularly review and update monitoring setup

## 🚀 Production Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Sentry project created and DSN configured
- [ ] Google Analytics property set up
- [ ] Microsoft Clarity project configured
- [ ] Uptime monitoring service configured
- [ ] Alert channels tested and working
- [ ] Health check endpoint responding correctly
- [ ] CSP headers not blocking required resources
- [ ] SSL/TLS certificate properly configured
- [ ] Status page updated with new services

## 📞 Support

For issues with this monitoring setup:

1. Check logs in Vercel dashboard
2. Review Sentry error reports
3. Verify environment variable configuration
4. Test health check endpoints
5. Contact DevOps team if issues persist

---

**Last Updated:** 2024-01-01
**Maintainer:** Workflo DevOps Team
**Version:** 1.0.0