// homePage.js
const { BasePage } = require('./basePage');

class HomePage extends BasePage {
    constructor(page) {
        super(page);
        this.locators = {
            detailedSearchButton: page.locator("//button[@aria-label='Pretražite detaljno ']"),
        };
    }
    
    async goToDetailedSearch() {
        await this.click(this.locators.detailedSearchButton);
    }
}

module.exports = { HomePage };
