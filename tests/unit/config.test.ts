/**
 * Unit tests for configuration system
 */

import { getConfig, configUtils, isDevelopment, isProduction } from '@/config';

// Mock environment variables
const originalEnv = process.env;

describe('Configuration System', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getConfig', () => {
    it('should return development config by default', () => {
      process.env.NODE_ENV = 'development';
      const config = getConfig();
      
      expect(config.app.environment).toBe('development');
      expect(config.features.debugging).toBe(true);
      expect(config.performance.sourceMaps).toBe(true);
    });

    it('should return production config when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      const config = getConfig();
      
      expect(config.app.environment).toBe('production');
      expect(config.features.debugging).toBe(false);
      expect(config.performance.sourceMaps).toBe(false);
    });

    it('should return staging config when NEXT_PUBLIC_APP_ENV is staging', () => {
      process.env.NEXT_PUBLIC_APP_ENV = 'staging';
      const config = getConfig();
      
      expect(config.app.environment).toBe('staging');
      expect(config.features.analytics).toBe(true);
      expect(config.features.debugging).toBe(false);
    });
  });

  describe('configUtils', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    describe('isFeatureEnabled', () => {
      it('should return correct feature flag values', () => {
        const config = getConfig();
        
        expect(configUtils.isFeatureEnabled('debugging')).toBe(config.features.debugging);
        expect(configUtils.isFeatureEnabled('analytics')).toBe(config.features.analytics);
      });
    });

    describe('getDatabaseUrl', () => {
      it('should return database URL from config', () => {
        process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
        
        const url = configUtils.getDatabaseUrl();
        expect(url).toBe('postgresql://test:test@localhost:5432/test');
      });

      it('should throw error if DATABASE_URL is not set', () => {
        delete process.env.DATABASE_URL;
        
        expect(() => {
          configUtils.getDatabaseUrl();
        }).toThrow('DATABASE_URL is not configured');
      });
    });

    describe('getRateLimit', () => {
      it('should return rate limit configuration', () => {
        const rateLimit = configUtils.getRateLimit();
        
        expect(rateLimit).toHaveProperty('windowMs');
        expect(rateLimit).toHaveProperty('max');
        expect(typeof rateLimit.windowMs).toBe('number');
        expect(typeof rateLimit.max).toBe('number');
      });
    });

    describe('getCorsConfig', () => {
      it('should return CORS configuration', () => {
        const cors = configUtils.getCorsConfig();
        
        expect(cors).toHaveProperty('origin');
        expect(cors).toHaveProperty('credentials');
        expect(Array.isArray(cors.origin)).toBe(true);
      });
    });

    describe('getSecurityHeaders', () => {
      it('should return security headers for production', () => {
        process.env.NODE_ENV = 'production';
        
        const headers = configUtils.getSecurityHeaders();
        
        expect(headers).toHaveProperty('Strict-Transport-Security');
        expect(headers).toHaveProperty('X-XSS-Protection');
        expect(headers).toHaveProperty('X-Content-Type-Options');
        expect(headers).toHaveProperty('Content-Security-Policy');
      });
    });

    describe('validateRequiredEnvVars', () => {
      it('should not throw in development with minimal env vars', () => {
        process.env.NODE_ENV = 'development';
        process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
        
        expect(() => {
          configUtils.validateRequiredEnvVars();
        }).not.toThrow();
      });

      it('should throw in production without required env vars', () => {
        process.env.NODE_ENV = 'production';
        delete process.env.SENTRY_DSN;
        delete process.env.NEXTAUTH_SECRET;
        
        expect(() => {
          configUtils.validateRequiredEnvVars();
        }).toThrow();
      });
    });
  });

  describe('Environment Detection', () => {
    it('should correctly detect development environment', () => {
      process.env.NODE_ENV = 'development';
      // Re-import to get updated values
      jest.resetModules();
      const { isDevelopment, isProduction } = require('@/config');
      
      expect(isDevelopment).toBe(true);
      expect(isProduction).toBe(false);
    });

    it('should correctly detect production environment', () => {
      process.env.NODE_ENV = 'production';
      // Re-import to get updated values
      jest.resetModules();
      const { isDevelopment, isProduction } = require('@/config');
      
      expect(isDevelopment).toBe(false);
      expect(isProduction).toBe(true);
    });
  });
});