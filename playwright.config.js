// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  retries :3,
  
  /* Maximum time one test can run for. */
  timeout: 100 * 1000,
  expect: {
  
    timeout: 5000
  },
  
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  workers: 4,
  use: {

    browserName : 'chromium',
    headless : true,
    screenshot : 'on',
    trace : 'on'.
    video: 'on-first-retry',
    
    
  },


};

module.exports = config;
