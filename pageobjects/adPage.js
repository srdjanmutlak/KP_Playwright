// adPage.js
const { BasePage } = require('./basePage');

class AdPage extends BasePage {
    constructor(page) {
        super(page);
        this.locators = {
            firstAdLink: page.locator("(//a[@class='Link_link__2iGTE CategoryBox_listItemName__q8gZH'])[2]"),
            nextAdButton: page.locator("button[aria-label='Sledeći oglas']"),
            addContactButton: page.locator("//button[.='Dodaj u adresar']"),
            loginHeader: page.locator("//h1[contains(text(),'Ulogujte se')]"),
        };
    }

    async openFirstAd() {
        await this.click(this.locators.firstAdLink);
    }

    async handleFirstAd() {

        const isNextAddButtonVisible = await Promise.race([
            this.page.waitForSelector("button[aria-label='Sledeći oglas']", { state: 'visible', timeout: 5000 }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Dropdown nije otvoren na vreme')), 4000))
        ]);
    
        // Ako dropdown nije otvoren, ručno ga otvaramo (ovo radi samo jednom i ako ne uspe test se prekida)
        if (!isNextAddButtonVisible) {
            await this.page.reload();  // Reload stranice
        }

        await this.retryClick(this.locators.addContactButton, this.locators.nextAdButton);
    }

    async clickAddContact() {
        await this.click(this.locators.addContactButton);
    }

}

module.exports = { AdPage };
