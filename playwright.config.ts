import { defineConfig, devices } from '@playwright/test'

/**
 * Comprehensive End-to-End Testing Configuration for Workflo New Project
 * Supports cross-browser testing, performance monitoring, and accessibility testing
 */
export default defineConfig({
  testDir: './tests',
  
  // Test organization
  testMatch: ['**/e2e/**/*.spec.ts', '**/e2e/**/*.test.ts'],
  testIgnore: ['**/unit/**', '**/integration/**'],
  
  // Parallel execution
  fullyParallel: !process.env.CI, // Sequential in CI for stability
  forbidOnly: !!process.env.CI,
  
  // Retry configuration
  retries: process.env.CI ? 3 : 1,
  
  // Worker configuration
  workers: process.env.CI ? 2 : '50%',
  
  // Timeouts
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  
  // Reporting
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    ...(process.env.CI ? ['github' as any] : []),
  ],
  
  // Global test configuration
  use: {
    // Base URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Browser context
    viewport: { width: 1280, height: 720 },
    
    // Tracing and debugging
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: process.env.CI ? 'only-on-failure' : 'on',
    video: process.env.CI ? 'retain-on-failure' : 'on',
    
    // Test artifacts
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'UTC',
    
    // Color scheme
    colorScheme: 'light',
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  projects: [
    // Desktop browsers - Primary testing
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        video: 'retain-on-failure',
      },
      testMatch: ['**/e2e/**/*.spec.ts'],
    },

    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['**/e2e/critical/**/*.spec.ts'], // Only critical tests
    },

    {
      name: 'Desktop Safari',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: ['**/e2e/critical/**/*.spec.ts'], // Only critical tests
    },

    // Mobile devices - Responsive testing
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        hasTouch: true,
      },
      testMatch: ['**/e2e/mobile/**/*.spec.ts', '**/e2e/critical/**/*.spec.ts'],
    },

    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        hasTouch: true,
      },
      testMatch: ['**/e2e/mobile/**/*.spec.ts'],
    },

    // Tablet testing
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        hasTouch: true,
      },
      testMatch: ['**/e2e/tablet/**/*.spec.ts'],
    },

    // Accessibility testing
    {
      name: 'Accessibility',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        // reducedMotion: 'reduce',
        // forcedColors: 'active',
      },
      testMatch: ['**/e2e/accessibility/**/*.spec.ts'],
    },

    // Performance testing
    {
      name: 'Performance',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Throttle network for realistic conditions
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--disable-gpu'],
        },
      },
      testMatch: ['**/e2e/performance/**/*.spec.ts'],
    },
  ],

  // Development server configuration
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
    }
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./tests/setup/playwright-global-setup.ts'),
  globalTeardown: require.resolve('./tests/setup/playwright-global-teardown.ts'),
})