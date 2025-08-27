import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'development',
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Error filtering
  beforeSend(event, hint) {
    // Don't send errors in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
      return null;
    }
    
    return event;
  },
  
  // Additional configuration
  debug: process.env.NODE_ENV === 'development',
  release: process.env.SENTRY_RELEASE,
  
  // Privacy settings
  sendDefaultPii: false,
  
  // Custom tags
  initialScope: {
    tags: {
      component: 'edge',
      project: 'workflo-new-project',
    },
  },
});