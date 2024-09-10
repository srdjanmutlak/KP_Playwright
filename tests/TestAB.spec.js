const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

test.describe.parallel('Tests', () => {
    let testPage;

    test.beforeEach(async ({ page }) => {
        const poManager = new POManager(page);
        testPage = poManager.getTestPage();

        await testPage.goToTestApp();  
    });

    test('Test app', async () => { 

    });

    test.skip('Unauthorized access control check', async () => { 

    });
});
