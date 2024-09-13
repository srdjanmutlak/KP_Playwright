// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  retries: 3,
  
  /* Maximum time one test can run for. */
//  timeout: 100 * 1000,
  expect: {
    timeout: 5000
  },
  
  /* HTML report configuration */
  reporter: [['html', { outputFolder: 'playwright-report' }]], // Definiše gde će se čuvati HTML izveštaj

  /* Shared settings for all the projects below. */
  workers: 4,
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'on',  
    trace: 'on',      
    video: 'retain-on-failure', 
    outputDir: 'test-results/', 
    navigationTimeout: 15 * 1000,
    actionTimeout: 5 * 1000,
    requestTimeout: 5 * 1000,
  },
};

module.exports = config;
