/**
 * Playwright global setup - runs once before all E2E tests
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Wait for the web server to be ready
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  
  // Launch a browser to warm up the application
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the app to ensure it's running
    await page.goto(baseURL);
    await page.waitForSelector('body', { timeout: 30000 });
    
    console.log('🚀 Application is ready for testing');
    
    // Check health endpoint
    const healthResponse = await page.goto(`${baseURL}/api/health`);
    if (healthResponse?.status() !== 200) {
      console.warn('⚠️ Health check failed, but continuing with tests');
    }
    
  } catch (error) {
    console.error('❌ Failed to prepare application for testing:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;