const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

test.describe.parallel('KP tests with new pages in POManager', () => {
    let poManager;
    let homePage;
    let detailedSearchPage;
    let adPage;
    let loginPage;
    let basePage;

    let uiResultCount;

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);

        basePage = poManager.getBasePage();
        homePage = poManager.getHomePage();
        detailedSearchPage = poManager.getDetailedSearchPage();
        adPage = poManager.getAdPage();
        loginPage = poManager.getLoginPage();

        await homePage.navigateTo();
        await loginPage.cancelLogin();
    });

    test('Compare result counts between UI and API and establish that the result is greater than 1000', async ({ page }) => {
        // **UI Test** - Navigacija do stranice za detaljnu pretragu i primena filtera
        await homePage.goToDetailedSearch();
        await detailedSearchPage.clickOnCategory();
        await detailedSearchPage.selectCategoryAndGroup('Odeća | Ženska', 'Bluze');
        await detailedSearchPage.setPriceFrom('100');
        await detailedSearchPage.selectCurrency('rsd');
        await detailedSearchPage.checkOnlyWithPrice();
        await detailedSearchPage.selectConditions(['Novo', 'Nekorišćeno']);
        await detailedSearchPage.applyFilters();
    
        // Dohvatanje broja rezultata sa UI
        const uiResultCount = await detailedSearchPage.getSearchResultCount();
    
        // **API Test** - Generisanje dinamičkog URL-a i slanje GET zahteva
        const searchUrl = await basePage.generateSearchUrl({
            categoryId: 743,  // Kategorija Odeća | Ženska
            groupId: 1992,  // Grupa Bluze
            priceFrom: 100,
            currency: 'rsd',  // Može biti rsd ili eur
            conditions: ['new', 'as-new'],  // Stanje artikla
            hasPrice: true  // Samo artikli sa cenom
        });
    
        const response = await page.request.get(searchUrl);
    
        // Dohvatanje broja oglasa iz meta podataka API odgovora
        const apiResultCount = await basePage.getListingCountFromMeta(response);
    
        // **Poređenje rezultata** - Upoređivanje broja rezultata dobijenih iz UI i API-ja
        expect(uiResultCount).toEqual(apiResultCount);
        expect(uiResultCount).toBeGreaterThan(1000);
    });         

    test('Unauthorized access control check using AdPage', async () => {
        await adPage.openFirstAd();
        await adPage.handleFirstAd();
        await adPage.clickAddContact();

        await loginPage.isHeaderTextVisibleAfter401('Ulogujte se');
    });
});
