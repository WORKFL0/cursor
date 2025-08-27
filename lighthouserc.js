module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/diensten',
        'http://localhost:3000/over-ons', 
        'http://localhost:3000/contact',
        'http://localhost:3000/portfolio',
        'http://localhost:3000/prijzen',
        'http://localhost:3000/nieuws',
        'http://localhost:3000/case-studies',
      ],
      startServerCommand: process.env.CI ? 'npm run start' : undefined,
      numberOfRuns: process.env.CI ? 1 : 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu --disable-web-security',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      },
    },
    assert: {
      assertions: {
        // Core Web Vitals - stricter thresholds
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': 'off',
        
        // Performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxNumericValue: 20000 }],
        'unused-javascript': ['warn', { maxNumericValue: 20000 }],
        'modern-image-formats': 'error',
        'offscreen-images': 'warn',
        'render-blocking-resources': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        
        // Best practices
        'uses-https': 'off', // localhost testing
        'no-vulnerable-libraries': 'error',
        'image-aspect-ratio': 'error',
        'image-size-responsive': 'error',
        'efficient-animated-content': 'warn',
        
        // SEO fundamentals
        'meta-description': 'error',
        'document-title': 'error',
        'crawlable-anchors': 'error',
        'link-text': 'error',
        'hreflang': 'off',
        'canonical': 'warn',
        
        // Accessibility essentials
        'color-contrast': 'error',
        'image-alt': 'error',
        'button-name': 'error',
        'link-name': 'error',
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr-value': 'error',
        'heading-order': 'warn',
        'landmark-one-main': 'error',
        'list': 'error',
        'listitem': 'error',
        
        // Mobile optimization
        'viewport': 'error',
        'content-width': 'error',
        'tap-targets': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: {
        storageMethod: 'filesystem',
        storagePath: './lighthouse-reports',
      },
    },
  },
};