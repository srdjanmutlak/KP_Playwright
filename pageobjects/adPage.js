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
        await this.retryClick(this.locators.addContactButton, this.locators.nextAdButton);
    }

    async clickAddContact() {
        await this.click(this.locators.addContactButton);
    }

}

module.exports = { AdPage };
