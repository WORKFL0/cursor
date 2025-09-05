#!/bin/bash
# Environment Configuration Management Script
set -euo pipefail

ENVIRONMENT="${1:-development}"
log() { echo -e "\033[0;34m[ENV-SETUP]\033[0m $1"; }
error() { echo -e "\033[0;31m[ERROR]\033[0m $1"; exit 1; }

log "Setting up environment: $ENVIRONMENT"

# Create environment-specific .env files
case $ENVIRONMENT in
    "development")
        cat > .env.local << 'ENVEOF'
# Development Environment Configuration
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Database (Development)
DATABASE_URL=postgresql://localhost:5432/workflo_dev
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_dev_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_dev_service_role_key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production

# Monitoring (Development)
SENTRY_DSN=
PROMETHEUS_GATEWAY=http://localhost:9091

# Analytics (Disabled in dev)
GOOGLE_ANALYTICS_ID=
CLARITY_PROJECT_ID=
HOTJAR_ID=
ENVEOF
        log "✅ Development environment configured"
        ;;
    "staging")
        cat > .env.staging << 'ENVEOF'
# Staging Environment Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
VERCEL_ENV=preview

# Database (Staging)
DATABASE_URL=$DATABASE_URL_STAGING
SUPABASE_URL=$SUPABASE_URL_STAGING
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY_STAGING
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY_STAGING

# Authentication
NEXTAUTH_URL=https://staging-workflo.vercel.app
NEXTAUTH_SECRET=$NEXTAUTH_SECRET_STAGING

# Monitoring (Staging)
SENTRY_DSN=$SENTRY_DSN_STAGING
PROMETHEUS_GATEWAY=$PROMETHEUS_GATEWAY_STAGING

# Analytics (Limited in staging)
GOOGLE_ANALYTICS_ID=$GA_ID_STAGING
CLARITY_PROJECT_ID=$CLARITY_ID_STAGING
HOTJAR_ID=$HOTJAR_ID_STAGING
ENVEOF
        log "✅ Staging environment configured"
        ;;
    "production")
        cat > .env.production << 'ENVEOF'
# Production Environment Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
VERCEL_ENV=production

# Database (Production)
DATABASE_URL=$DATABASE_URL_PRODUCTION
SUPABASE_URL=$SUPABASE_URL_PRODUCTION
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY_PRODUCTION
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY_PRODUCTION

# Authentication
NEXTAUTH_URL=https://workflo.it
NEXTAUTH_SECRET=$NEXTAUTH_SECRET_PRODUCTION

# Monitoring (Production)
SENTRY_DSN=$SENTRY_DSN_PRODUCTION
PROMETHEUS_GATEWAY=$PROMETHEUS_GATEWAY_PRODUCTION

# Analytics (Full tracking)
GOOGLE_ANALYTICS_ID=$GA_ID_PRODUCTION
CLARITY_PROJECT_ID=$CLARITY_ID_PRODUCTION
HOTJAR_ID=$HOTJAR_ID_PRODUCTION
FACEBOOK_PIXEL_ID=$FB_PIXEL_ID_PRODUCTION
LINKEDIN_PARTNER_ID=$LINKEDIN_PARTNER_ID_PRODUCTION
ENVEOF
        log "✅ Production environment configured"
        ;;
    *)
        error "Invalid environment. Use: development, staging, or production"
        ;;
esac

log "Environment configuration complete!"
log "Don't forget to update the actual secret values!"
