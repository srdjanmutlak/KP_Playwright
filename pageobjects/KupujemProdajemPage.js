const { expect } = require('@playwright/test');

class KupujemProdajemPage {
    constructor(page) {
        this.page = page;

        // **Locators**
        this.locators = {
            cancelLoginButton: page.locator("button[class='Button_base__G3HTK Button_big__vkHxv Modal_closeIcon__CJuTW']"),
            detailedSearchButton: page.locator("//button[@aria-label='Pretražite detaljno ']"),
            categoryDropdown: page.locator("#react-select-categoryId-input"),
            groupDropdown: page.locator("#react-select-groupId-input"),
            priceFromInput: page.locator("#priceFrom"),
            dinRadioButton: page.locator("//label[contains(.,'din')]"),
            onlyWithPriceCheckbox: page.locator("//span[contains(text(), 'Samo sa cenom')]"),
            conditionInput: page.locator("#react-select-condition-input"),
            firstAdLink: page.locator("(//a[@class='Link_link__2iGTE CategoryBox_listItemName__q8gZH'])[2]"),
            addContactButton: page.locator("//button[.='Dodaj u adresar']"),
            nextAdButton: page.locator("button[aria-label='Sledeći oglas']"),
            loginHeader: page.locator("//h1[.='Ulogujte se']"),
            applyFiltersButton: page.locator("//button[@aria-label='Primeni filtere']"),
            searchResultCount: page.locator("//a[contains(text(),'Bluze')]/following-sibling::span")
        };
    }

    // **Navigation**
    async navigateTo(url) {
        await this.page.goto(url);
    }

    // **Actions**
    async click(locator) {
        await locator.click();
    }

    async fillInput(locator, text) {
        await locator.fill(text);
    }

    async typeAndEnter(locator, text, options = {}) {
        await locator.type(text, options);
        await this.page.keyboard.press('Enter');
    }

    async selectOption(locator, text, options = {}) {
        await this.typeAndEnter(locator, text, options);
    }

    async selectCategoryAndGroup(categoryText, groupText) {
        await this.selectOption(this.locators.categoryDropdown, categoryText);
        await this.selectOption(this.locators.groupDropdown, groupText);
    }

    async selectConditions(conditionsArray) {
        for (const condition of conditionsArray) {
            await this.selectOption(this.locators.conditionInput, condition);
        }
    }

    async clickOnFirstAd() {
        await this.click(this.locators.firstAdLink);
    }

    async clickOnAddContactButton() {
        await this.click(this.locators.addContactButton);
    }

    async cancelLogin() {
        await this.click(this.locators.cancelLoginButton);
    }

    // **Waits**
    async waitForResponse(urlPart, statusCode = 200) {
        await this.page.waitForResponse(response =>
            response.url().includes(urlPart) && response.status() === statusCode
        );
    }

    // **Utility Methods**
    async getSearchResultCount() {
        await this.waitForResponse('/api/web/v1/search');
        const text = await this.locators.searchResultCount.textContent();
        const count = parseInt(text.replace('.', '').replace(' rezultata', ''));
        return count;
    }

    async isSearchResultCountGreaterThan(threshold) {
        const count = await this.getSearchResultCount();
        return count > threshold;
    }

    async isH1TextVisible(text) {
        await this.waitForResponse('/api/web/v1/addressbook/add-contact', 401);
        const element = this.page.locator(`//h1[contains(.,'${text}')]`);
        const content = await element.textContent();
        expect(content).toContain(text);
    }
}

module.exports = { KupujemProdajemPage };
