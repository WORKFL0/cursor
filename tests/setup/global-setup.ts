/**
 * Global test setup - runs once before all tests
 */

export default async function globalSetup() {
  // Set test environment variables
  // process.env.NODE_ENV = 'test'; // Read-only property
  process.env.NEXT_PUBLIC_APP_ENV = 'test';
  
  // Mock external services
  process.env.SENTRY_DSN = 'https://test@sentry.io/test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  
  // Disable telemetry
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  
  // Setup test database if needed
  // This would be expanded for actual database testing
  console.log('🧪 Global test setup completed');
}