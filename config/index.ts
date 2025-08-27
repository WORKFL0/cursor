/**
 * Centralized configuration management
 * Automatically loads the correct environment configuration
 */

import { developmentConfig } from './environments/development';
import { stagingConfig } from './environments/staging';
import { productionConfig } from './environments/production';

export type AppConfig = typeof developmentConfig;

/**
 * Get the current environment configuration
 */
export function getConfig(): AppConfig {
  const env = process.env.NODE_ENV || 'development';
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || env;

  switch (appEnv) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'development':
    case 'test':
    default:
      return developmentConfig;
  }
}

/**
 * Current application configuration
 */
export const config = getConfig();

/**
 * Environment-specific feature flags
 */
export const isProduction = config.app.environment === 'production';
export const isStaging = config.app.environment === 'staging';
export const isDevelopment = config.app.environment === 'development';
export const isTest = process.env.NODE_ENV === 'test';

/**
 * Common configuration utilities
 */
export const configUtils = {
  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled: (feature: keyof typeof config.features): boolean => {
    return config.features[feature] as boolean;
  },

  /**
   * Get database connection string with proper SSL settings
   */
  getDatabaseUrl: (): string => {
    const url = config.database.url;
    if (!url) {
      throw new Error('DATABASE_URL is not configured');
    }
    return url;
  },

  /**
   * Get cache connection string
   */
  getCacheUrl: (): string => {
    const url = config.cache.url;
    if (!url) {
      throw new Error('Cache URL is not configured');
    }
    return url;
  },

  /**
   * Get API timeout with fallback
   */
  getApiTimeout: (customTimeout?: number): number => {
    return customTimeout || config.apis.timeout;
  },

  /**
   * Get rate limit configuration
   */
  getRateLimit: () => {
    return config.security.rateLimit;
  },

  /**
   * Get CORS configuration
   */
  getCorsConfig: () => {
    return config.security.cors;
  },

  /**
   * Get monitoring configuration
   */
  getMonitoringConfig: () => {
    return config.monitoring;
  },

  /**
   * Validate required environment variables
   */
  validateRequiredEnvVars: (): void => {
    const required = [
      'DATABASE_URL',
    ];

    // Add production-specific required vars
    if (isProduction) {
      required.push(
        'SENTRY_DSN',
        'NEXTAUTH_SECRET',
      );
    }

    const missing = required.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  },

  /**
   * Get security headers configuration
   */
  getSecurityHeaders: () => {
    const headers: Record<string, string> = {};

    if (config.security.headers?.hsts) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    }

    if (config.security.headers?.xssProtection) {
      headers['X-XSS-Protection'] = '1; mode=block';
    }

    if (config.security.headers?.noSniff) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    if (config.security.headers?.referrerPolicy) {
      headers['Referrer-Policy'] = config.security.headers.referrerPolicy;
    }

    if (config.security.headers?.csp) {
      headers['Content-Security-Policy'] = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' https:",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ');
    }

    return headers;
  },
};

// Validate environment variables on startup
if (typeof window === 'undefined') {
  try {
    configUtils.validateRequiredEnvVars();
  } catch (error) {
    console.error('Configuration validation failed:', error);
    if (isProduction) {
      process.exit(1);
    }
  }
}

export default config;