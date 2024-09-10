const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

test.describe.parallel('KP tests', () => {
    let kupujemProdajemPage;

    test.beforeEach(async ({ page }) => {
        const poManager = new POManager(page);
        kupujemProdajemPage = poManager.getKupujemProdajem();

        await kupujemProdajemPage.goToKupujemProdajem();  
        await kupujemProdajemPage.cancelLogin();  
    });
    test('Detailed Search test', async () => { 
        await kupujemProdajemPage.clickOnDetailedSearch();
        await kupujemProdajemPage.selectCategoryAndGroup('Odeća | Ženska', 'Bluze'); 
        await kupujemProdajemPage.enterTextInPriceFrom('100');
        await kupujemProdajemPage.clickOnDinRButton();
        await kupujemProdajemPage.clickOnOnlyWithPrice();
        await kupujemProdajemPage.chooseConditions(["Novo", "Nekorišćeno"]);
        await kupujemProdajemPage.clickOnApplyFiltersButton();

        const isGreaterThanThousand = await kupujemProdajemPage.isSearchResultCountGreaterThan(1000);
        expect(isGreaterThanThousand).toBe(true);
    });
    test('Unauthorized access control check', async () => { 
    
        // Continue with the rest of the actions
        await kupujemProdajemPage.clickOnFirstAdd();
        await kupujemProdajemPage.clickOnAddContactButton();

        await kupujemProdajemPage.isH1TextVisible("Ulogujte se");
    });
});
