const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

test.describe.parallel('KP tests with new pages in POManager', () => {
    let poManager;
    let homePage;
    let detailedSearchPage;
    let adPage;
    let loginPage;

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);

        // Dohvatanje novih stranica kroz POManager
        homePage = poManager.getHomePage();
        detailedSearchPage = poManager.getDetailedSearchPage();
        adPage = poManager.getAdPage();
        loginPage = poManager.getLoginPage();

        // Navigacija do početne stranice i zatvaranje login prozora
        await homePage.navigateTo('https://www.kupujemprodajem.com/');
        await loginPage.cancelLogin();
    });

    test('Detailed Search test using new pages from POManager', async () => {
        await homePage.goToDetailedSearch();
        await detailedSearchPage.selectCategoryAndGroup('Odeća | Ženska', 'Bluze', 50);
        await detailedSearchPage.setPriceFrom('100');
        await detailedSearchPage.selectCurrency('rsd');
        await detailedSearchPage.checkOnlyWithPrice();
        await detailedSearchPage.selectConditions(['Novo', 'Nekorišćeno']);
        await detailedSearchPage.applyFilters();

        const resultCount = await detailedSearchPage.getSearchResultCount();
        expect(resultCount).toBeGreaterThan(1000);
    });

    test('Unauthorized access control check using AdPage', async () => {
        await adPage.openFirstAd();
        await adPage.handleFirstAd();
        await adPage.clickAddContact();

        await loginPage.isHeaderTextVisibleAfter401('Ulogujte se');
        });
});
