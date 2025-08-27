/**
 * Playwright global teardown - runs once after all E2E tests
 */

async function globalTeardown() {
  console.log('🧹 E2E test cleanup completed');
  
  // Clean up any test data
  // Close database connections
  // Clean up temporary files
  // Reset external services if needed
}

export default globalTeardown;