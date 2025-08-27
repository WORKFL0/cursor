/**
 * Staging environment configuration
 */
export const stagingConfig = {
  // Application
  app: {
    name: 'Workflo New Project',
    version: process.env.npm_package_version || '1.0.0',
    environment: 'staging',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://workflo-new-project-staging.vercel.app',
    port: 3000,
  },

  // Database
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: 20,
    ssl: true,
    logging: false,
  },

  // Cache
  cache: {
    url: process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL,
    ttl: 600, // 10 minutes
    maxMemory: '256mb',
  },

  // Monitoring
  monitoring: {
    enabled: true,
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: 'staging',
      sampleRate: 0.5,
      debug: false,
    },
    metrics: {
      enabled: true,
      interval: 30000, // 30 seconds
    },
    logging: {
      level: 'info',
      console: true,
      file: true,
    },
  },

  // Security
  security: {
    cors: {
      origin: [
        'https://workflo-new-project-staging.vercel.app',
        'https://workflo.it',
        'https://admin.workflo.it',
      ],
      credentials: true,
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // requests per window
    },
    encryption: {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
    },
    headers: {
      hsts: true,
      csp: true,
      xssProtection: true,
    },
  },

  // Features
  features: {
    analytics: true,
    debugging: false,
    hotReload: false,
    devTools: false,
    errorOverlay: false,
  },

  // APIs
  apis: {
    timeout: 20000, // 20 seconds
    retries: 2,
    retryDelay: 2000,
  },

  // Performance
  performance: {
    bundleAnalyzer: false,
    sourceMaps: false,
    optimization: true,
    compression: true,
  },
} as const;