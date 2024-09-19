// detailedSearchPage.js
const { BasePage } = require('./basePage');

class DetailedSearchPage extends BasePage {
    constructor(page) {
        super(page);
        this.locators = {
            categoryDropdown: page.locator("#react-select-categoryId-input"),
            groupDropdown: page.locator("#react-select-groupId-input"),
            priceFromInput: page.locator("#priceFrom"),
            onlyWithPriceCheckbox: page.locator("//span[contains(text(), 'Samo sa cenom')]"),
            conditionInput: page.locator("#react-select-condition-input"),
            applyFiltersButton: page.locator("//button[@aria-label='Primeni filtere']"),
            searchResultCount: page.locator("//a[contains(text(),'Bluze')]/following-sibling::span"),
        };
    }

    async selectCategoryAndGroup(categoryText, groupText, delay = 0) {
        await this.selectOption(this.locators.categoryDropdown, categoryText, {}, delay);
        await this.selectOption(this.locators.groupDropdown, groupText, {}, delay);
    }
    
    async setPriceFrom(price) {
        await this.fillInput(this.locators.priceFromInput, price);
    }

    async selectCurrency(currency) {
        await this.page.getByLabel(currency).check();
    }

    async checkOnlyWithPrice() {
        await this.click(this.locators.onlyWithPriceCheckbox);
    }

    async selectConditions(conditionsArray) {
        for (const condition of conditionsArray) {
            await this.selectOption(this.locators.conditionInput, condition);
        }
    }

    async applyFilters() {
        await this.click(this.locators.applyFiltersButton);
    }

    async getSearchResultCount() {
        await this.waitForResponse('/api/web/v1/search');
        const text = await this.locators.searchResultCount.textContent();
        const count = parseInt(text.replace('.', '').replace(' rezultata', ''));
        return count;
    }
}

module.exports = { DetailedSearchPage };
