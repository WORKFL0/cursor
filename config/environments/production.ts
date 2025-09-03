/**
 * Production environment configuration
 */
export const productionConfig = {
  // Application
  app: {
    name: 'Workflo New Project',
    version: process.env.npm_package_version || '1.0.0',
    environment: 'production' as const,
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://workflo-new-project.vercel.app',
    port: 3000,
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: 50,
    ssl: true,
    logging: false,
    poolTimeout: 30000,
    queryTimeout: 20000,
  },

  // Cache
  cache: {
    url: process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL,
    ttl: 1800, // 30 minutes
    maxMemory: '512mb',
    keyPrefix: 'workflo:prod:',
  },

  // Monitoring
  monitoring: {
    enabled: true,
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: 'production',
      sampleRate: 0.1,
      debug: false,
      release: process.env.SENTRY_RELEASE,
    },
    metrics: {
      enabled: true,
      interval: 60000, // 1 minute
    },
    logging: {
      level: 'error',
      console: false,
      file: true,
      structured: true,
    },
    alerts: {
      enabled: true,
      email: 'alerts@workflo.it',
      slack: process.env.SLACK_WEBHOOK_URL,
    },
  },

  // Security
  security: {
    cors: {
      origin: [
        'https://workflo-new-project.vercel.app',
        'https://workflo.it',
        'https://admin.workflo.it',
      ],
      credentials: true,
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // requests per window
      skipSuccessfulRequests: true,
    },
    encryption: {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
    },
    headers: {
      hsts: true,
      csp: true,
      xssProtection: true,
      noSniff: true,
      referrerPolicy: 'origin-when-cross-origin',
    },
    secrets: {
      rotate: true,
      rotationPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days
    },
  },

  // Features
  features: {
    analytics: true,
    debugging: false,
    hotReload: false,
    devTools: false,
    errorOverlay: false,
    maintenance: false,
  },

  // APIs
  apis: {
    timeout: 10000, // 10 seconds
    retries: 1,
    retryDelay: 3000,
    circuitBreaker: {
      enabled: true,
      threshold: 5,
      timeout: 30000,
    },
  },

  // Performance
  performance: {
    bundleAnalyzer: false,
    sourceMaps: false,
    optimization: true,
    compression: true,
    cdn: {
      enabled: true,
      domain: process.env.CDN_DOMAIN,
    },
    caching: {
      static: '31536000', // 1 year
      dynamic: '300', // 5 minutes
      api: '60', // 1 minute
    },
  },

  // Backup
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30, // days
    encryption: true,
  },

  // Compliance
  compliance: {
    gdpr: true,
    ccpa: true,
    hipaa: false,
    logging: {
      auditTrail: true,
      retention: 2555, // 7 years in days
    },
  },
} as const;