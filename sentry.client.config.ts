import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Performance monitoring
  integrations: [
    // new Sentry.Replay({
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
    // new Sentry.BrowserTracing({
    //   tracingOrigins: ["localhost", /^https:\/\/.*\.vercel\.app$/],
    // }),
  ],
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out known issues
    const error = hint.originalException;
    
    // Don't send errors in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
      return null;
    }
    
    // Filter out network errors
    if (error && (error as any).message && (error as any).message.includes('NetworkError')) {
      return null;
    }
    
    // Filter out script loading errors
    if (error && (error as any).message && (error as any).message.includes('Loading chunk')) {
      return null;
    }
    
    return event;
  },
  
  // Additional configuration
  debug: process.env.NODE_ENV === 'development',
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  
  // Privacy settings
  sendDefaultPii: false,
  
  // Custom tags
  initialScope: {
    tags: {
      component: 'client',
      project: 'workflo-new-project',
    },
  },
});