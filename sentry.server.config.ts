import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'development',
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Performance monitoring
  integrations: [
    // new Sentry.Integrations.Prisma(),
    // new Sentry.Integrations.Http({ tracing: true }),
  ],
  
  // Error filtering
  beforeSend(event, hint) {
    // Don't send errors in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
      return null;
    }
    
    // Filter out known issues
    const error = hint.originalException;
    
    // Filter out database connection errors in development
    if (process.env.NODE_ENV === 'development' && 
        error && (error as any).message && (error as any).message.includes('ECONNREFUSED')) {
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
      component: 'server',
      project: 'workflo-new-project',
    },
  },
  
  // Error handling
  onFatalError: (error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  },
});