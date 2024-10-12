// detailedSearchPage.js
const { BasePage } = require('./basePage');

class DetailedSearchPage extends BasePage {
    constructor(page) {
        super(page);
        this.locators = {
            categoryDropdown: page.locator("#react-select-categoryId-input"),
            groupDropdown: page.locator("#react-select-groupId-input"),
            groupDropdownOption: page.locator('div[role="option"][aria-selected="false"] div:has-text("Bluze")').first(),
            priceFromInput: page.locator("#priceFrom"),
          //  dinRadioButton: page.locator("//label[contains(.,'din')]"),
            onlyWithPriceCheckbox: page.locator("//span[contains(text(), 'Samo sa cenom')]"),
            conditionInput: page.locator("#react-select-condition-placeholder"),
            applyFiltersButton: page.locator("//button[@aria-label='Primeni filtere']"),
            searchResultCount: page.locator("//a[contains(text(),'Bluze')]/following-sibling::span"),
        };
    }

    async clickOnCategory() {
        await this.click(this.locators.categoryDropdown);
    }

    // async selectCategoryAndGroup(categoryText, groupText, delay = 0) {
    //     await this.selectOption(this.locators.categoryDropdown, categoryText, {}, delay);
    //     await this.selectOption(this.locators.groupDropdown, groupText, {}, delay);
    // }

    async selectCategoryAndGroup(categoryText, groupText) {
        // Prvo biramo kategoriju
        await this.selectDropdownOption(categoryText);

        // Trkamo čekanje dropdowna sa timeout-om od 2 sekunde
        const isGroupDropdownVisible = await Promise.race([
            this.locators.groupDropdownOption.isVisible(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Dropdown nije otvoren na vreme')), 2000))
        ]);
    
        // Ako dropdown nije otvoren, ručno ga otvaramo (ovo radi samo jednom i ako ne uspe test se prekida)
        if (!isGroupDropdownVisible) {
            await this.click(this.locators.groupDropdown);
        }
    
        // Biramo grupu
        await this.selectDropdownOption(groupText);
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

    // async selectConditions(conditionsArray) {
    //     for (const condition of conditionsArray) {
    //         await this.selectOption(this.locators.conditionInput, condition);
    //     }
    // }

    // type in console to freeze dropdown: setTimeout(() => { debugger; }, 3000);
    async selectDropdownOption(optionText) {    
        // Pronalazimo opciju na osnovu teksta i kliknemo na nju
        const optionLocator = `div[role="option"][aria-selected="false"] div:has-text("${optionText}")`;
        await this.page.click(optionLocator);
    }   

    async selectConditions(conditionsArray) {
        // Klik na glavni input za prikazivanje opcija (ukoliko je to potrebno da bi se prikazale opcije)
        await this.click(this.locators.conditionInput);
    
        // Petlja kroz sve uslove u conditionsArray i klik na odgovarajući checkbox element
        for (const condition of conditionsArray) {
            const checkboxLocator = `label:has-text("${condition}")`;
            await this.page.click(checkboxLocator);
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
