# 🚀 Production Deployment Checklist

Use this checklist to ensure all monitoring and security features are properly configured before deploying to production.

## Pre-Deployment Verification

Run the automated verification script:
```bash
npm run verify:monitoring
```

This script will check all monitoring and security configurations and provide a detailed report.

## Manual Verification Steps

### 1. Environment Variables Configuration

**Required for Production:**
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - Sentry client-side DSN
- [ ] `SENTRY_DSN` - Sentry server-side DSN  
- [ ] `SENTRY_ORG` - Sentry organization name
- [ ] `SENTRY_PROJECT` - Sentry project name
- [ ] `SENTRY_AUTH_TOKEN` - For source maps upload

**Optional but Recommended:**
- [ ] `NEXT_PUBLIC_GA_ID` - Google Analytics measurement ID
- [ ] `NEXT_PUBLIC_CLARITY_ID` - Microsoft Clarity project ID
- [ ] `UPTIME_ROBOT_API_KEY` - For automated uptime monitoring
- [ ] `HEALTHCHECKS_IO_PING_URL` - For cron job monitoring

### 2. Security Configuration

- [ ] CSP headers configured in `next.config.ts`
- [ ] HSTS header enabled
- [ ] X-Frame-Options set to DENY
- [ ] X-Content-Type-Options set to nosniff
- [ ] Permissions Policy configured

### 3. Error Monitoring (Sentry)

- [ ] Sentry project created at [sentry.io](https://sentry.io)
- [ ] DSN configured in environment variables
- [ ] Source maps upload configured
- [ ] Error filtering rules configured
- [ ] Alert rules set up for critical errors

### 4. Analytics Setup

**Google Analytics 4:**
- [ ] GA4 property created
- [ ] Measurement ID configured
- [ ] Enhanced measurement enabled
- [ ] Custom events configured

**Microsoft Clarity:**
- [ ] Clarity project created
- [ ] Project ID configured
- [ ] Privacy settings configured
- [ ] Recording settings optimized

### 5. Health Monitoring

- [ ] `/api/health` endpoint accessible
- [ ] Health checks include database connectivity
- [ ] Memory usage monitoring enabled
- [ ] Response time tracking active

### 6. Uptime Monitoring

**Choose one or more services:**

**UptimeRobot (Recommended):**
- [ ] Account created at [uptimerobot.com](https://uptimerobot.com)
- [ ] Monitors configured for key endpoints
- [ ] Alert contacts configured
- [ ] API key added to environment variables

**Pingdom:**
- [ ] Account configured
- [ ] Check setup for homepage and API
- [ ] Integration with alerting systems

**Healthchecks.io:**
- [ ] Ping URLs configured for cron jobs
- [ ] Grace periods set appropriately

### 7. Vercel Configuration

**Environment Variables:**
```bash
# Add to Vercel dashboard or via CLI
vercel env add NEXT_PUBLIC_SENTRY_DSN production
vercel env add SENTRY_DSN production
vercel env add SENTRY_ORG production
vercel env add SENTRY_PROJECT production
vercel env add SENTRY_AUTH_TOKEN production
vercel env add NEXT_PUBLIC_GA_ID production
vercel env add NEXT_PUBLIC_CLARITY_ID production
# Add others as needed
```

**Build Settings:**
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Node.js version: 18.x or higher

## Testing Before Deployment

### 1. Local Testing
```bash
# Run all quality checks
npm run deploy:check

# This will run:
# - npm run verify:monitoring
# - npm run type-check  
# - npm run lint
# - npm run build
```

### 2. Health Check Test
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Should return JSON with status: "healthy"
```

### 3. Error Tracking Test
```bash
# Trigger a test error (in development)
# Visit: http://localhost:3000/api/test-error
# Check Sentry dashboard for the error
```

## Post-Deployment Verification

### 1. Production Health Check
```bash
curl https://your-domain.com/api/health
```

### 2. Monitoring Dashboards

**Sentry:**
- [ ] Visit Sentry dashboard
- [ ] Verify no critical errors
- [ ] Check performance metrics

**Google Analytics:**
- [ ] Real-time report showing traffic
- [ ] Events being tracked correctly

**Microsoft Clarity:**
- [ ] Session recordings active
- [ ] Heatmaps generating data

**Uptime Monitoring:**
- [ ] All monitors showing "up" status
- [ ] Alert notifications working

### 3. Security Headers Check

Use online tools to verify security headers:
- [ ] [Security Headers](https://securityheaders.com)
- [ ] [Mozilla Observatory](https://observatory.mozilla.org)

Expected grades: A+ or A

## Troubleshooting

### Common Issues

**CSP Violations:**
- Check browser console for blocked resources
- Update CSP to allow necessary domains
- Test in incognito mode

**Sentry Not Receiving Errors:**
- Verify DSN is correct
- Check network connectivity
- Ensure source maps are uploaded

**Analytics Not Working:**
- Verify measurement IDs
- Check for ad blockers
- Confirm consent management

**Health Check Failing:**
- Check database connectivity
- Verify API route exists
- Check server logs

### Getting Help

1. Check logs in Vercel dashboard
2. Review Sentry error reports  
3. Test health endpoints
4. Contact DevOps team

## Production Rollback Plan

If issues are discovered after deployment:

1. **Immediate Rollback:**
   ```bash
   # Via Vercel CLI
   vercel rollback
   ```

2. **Via Vercel Dashboard:**
   - Go to deployments
   - Select previous working deployment  
   - Click "Promote to Production"

3. **Monitor After Rollback:**
   - Check health endpoints
   - Verify error rates normalized
   - Confirm uptime monitors green

## Security Incident Response

If security issues are detected:

1. **Immediate Actions:**
   - Check Sentry for error patterns
   - Review access logs
   - Check uptime monitor alerts

2. **Investigation:**
   - Analyze error patterns in Sentry
   - Check security headers implementation
   - Review recent code changes

3. **Communication:**
   - Alert team via configured channels
   - Update status page if needed
   - Document incident for review

## Maintenance Schedule

**Daily:**
- [ ] Check Sentry dashboard for new errors
- [ ] Review uptime monitor status
- [ ] Monitor performance metrics

**Weekly:**
- [ ] Review analytics data
- [ ] Check security header compliance
- [ ] Update dependencies if needed

**Monthly:**
- [ ] Review monitoring configuration
- [ ] Update alert thresholds if needed  
- [ ] Conduct security review

---

**Last Updated:** 2024-01-01  
**Version:** 1.0.0

> 💡 **Tip:** Bookmark this checklist and use it for every production deployment to ensure consistent monitoring and security standards.