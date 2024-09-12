// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  retries: 3,
  
  /* Maximum time one test can run for. */
  timeout: 100 * 1000,
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
    screenshot: 'on',  // Snimi screenshot nakon svakog testa
    trace: 'on',       // Snimi trace za svaku sesiju
    video: 'on-first-retry',  // Snimi video samo tokom prvog ponovnog pokušaja
    outputDir: 'test-results/',  // Gde će se čuvati svi izlazni fajlovi (video, screenshot, trace)
  },
};

module.exports = config;
