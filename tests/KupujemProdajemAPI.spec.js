const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

test.describe.parallel('KP tests with new pages in POManager', () => {
    let poManager;
    let basePage;

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);

        // Dohvatanje novih stranica kroz POManager
        basePage = poManager.getBasePage();
    });

    test('Search using dynamic paths in API', async ({ page }) => {
        // Generiši dinamički URL
        const searchUrl = await basePage.generateSearchUrl({
            categoryId: 743,  // Kategorija Odeća | Ženska
            groupId: 1992,  // Grupa Bluze
            priceFrom: 100,
            currency: 'rsd',  // Može biti rsd ili eur
            conditions: ['new', 'as-new'],  // Stanje artikla
            hasPrice: true  // Samo artikli sa cenom
        });
    
        // Slanje GET zahteva
        const response = await page.request.get(searchUrl);

        // Provera broja oglasa preko funkcije
        const listingCount = await basePage.getListingCountFromMeta(response);
    
        // Provera da li je broj oglasa veći od 1000
        expect(listingCount).toBeGreaterThan(1000);
    });
    test('POST address book add-contact returns 401 when not logged in', async () => {
        // Pozivamo postRequest funkciju sa dinamičkim parametrima
        const jsonResponse = await basePage.postRequest(
            '/api/web/v1/addressbook/add-contact/', 
            {"contact_id":1613340,"threadId":""}, 
            401,
            {
                success: false,
                errors: [
                    {
                        error_code: 'not_authorized',
                        error_description: 'Nije autorizovan'
                    }
                ]
            });
    });      
});
