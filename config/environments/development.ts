/**
 * Development environment configuration
 */
export const developmentConfig = {
  // Application
  app: {
    name: 'Workflo New Project',
    version: '1.0.0',
    environment: 'development',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    port: 3000,
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/workflo_dev',
    maxConnections: 10,
    ssl: false,
    logging: true,
  },

  // Cache
  cache: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: 300, // 5 minutes
    maxMemory: '100mb',
  },

  // Monitoring
  monitoring: {
    enabled: true,
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: 'development',
      sampleRate: 1.0,
      debug: true,
    },
    metrics: {
      enabled: true,
      interval: 15000, // 15 seconds
    },
    logging: {
      level: 'debug',
      console: true,
      file: false,
    },
  },

  // Security
  security: {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
    rateLimit: {
      windowMs: 60 * 1000, // 1 minute
      max: 1000, // requests per window
    },
    encryption: {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
    },
  },

  // Features
  features: {
    analytics: false,
    debugging: true,
    hotReload: true,
    devTools: true,
    errorOverlay: true,
  },

  // APIs
  apis: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000,
  },

  // Performance
  performance: {
    bundleAnalyzer: true,
    sourceMaps: true,
    optimization: false,
    compression: false,
  },
} as const;