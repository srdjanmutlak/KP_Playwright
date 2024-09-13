const { test, expect } = require('@playwright/test');
const { KupujemProdajemPage } = require('../pageobjects/KupujemProdajemPage');

test.describe.parallel('KP tests', () => {
    let kpPage;

    test.beforeEach(async ({ page }) => {
        kpPage = new KupujemProdajemPage(page);

        // Navigacija do početne stranice i zatvaranje login prozora
        await kpPage.navigateTo('https://www.kupujemprodajem.com/');
        await kpPage.cancelLogin();  
    });

    test('Detailed Search test', async () => { 
        // **Navigacija do detaljne pretrage**
        await kpPage.click(kpPage.locators.detailedSearchButton);

        // **Izbor kategorije i grupe**
        await kpPage.selectCategoryAndGroup('Odeća | Ženska', 'Bluze'); 

        // **Postavljanje cene i valute**
        await kpPage.fillInput(kpPage.locators.priceFromInput, '100');
        await kpPage.click(kpPage.locators.dinRadioButton);

        // **Primena dodatnih filtera**
        await kpPage.click(kpPage.locators.onlyWithPriceCheckbox);
        await kpPage.selectConditions(['Novo', 'Nekorišćeno']);

        // **Primena filtera**
        await kpPage.click(kpPage.locators.applyFiltersButton);

        // **Dobijanje i asertacija broja rezultata pretrage**
        const resultCount = await kpPage.getSearchResultCount();
        expect(resultCount).toBeGreaterThan(1000);
    });

    test('Unauthorized access control check', async () => { 
        // **Otvaranje prvog oglasa**
        await kpPage.clickOnFirstAd();

        // **Pokušaj dodavanja kontakta bez autorizacije**
        await kpPage.clickOnAddContactButton();

        // **Korišćenje isH1TextVisible metode i asercija**
        const isVisible = await kpPage.isH1TextVisible('Ulogujte se');
        expect(isVisible).toBe(true);
    });
});
