const {test, expect} = require('@playwright/test');
class KupujemProdajemPage
{
constructor(page)
{
    this.page = page;
    this.cancelLoginButton = page.locator("button[class='Button_base__G3HTK Button_big__vkHxv Modal_closeIcon__CJuTW']")
    this.detailedSearchButton = page.locator("//button[@aria-label='Pretražite detaljno ']");
    this.categoryDropdownLocator = page.locator("#react-select-categoryId-input");
    this.groupDropdownLocator = page.locator("#react-select-groupId-input");
    this.priceFromLocator = page.locator("#priceFrom");
    this.dinRadioButtonLocator = page.locator("//label[contains(.,'din')]");
    this.onlyWithPriceChBx = page.locator("//span[contains(text(), 'Samo sa cenom')]");
    this.conditionInputLocator = page.locator("#react-select-condition-input");
    this.firstAdLocator = page.locator("(//a[@class='Link_link__2iGTE CategoryBox_listItemName__q8gZH'])[2]");
    this.addContactButtonLocator = page.locator("//button[.='Dodaj u adresar']")
    this.addNextAddLocator = page.locator("button[aria-label='Sledeći oglas']")
    this.h1LoginLocator = page.locator("//h1[.='Ulogujte se']")

    this.applyFiltersButtonLocator = page.locator("//button[@aria-label='Primeni filtere']");
    this.searchResultCountLocator = page.locator("//a[contains(text(),'Bluze')]/following-sibling::span");
}

async goToKupujemProdajem()
{
    await this.page.goto("https://www.kupujemprodajem.com/");
}

async goToKPFixedSearch()
{
    await this.page.goto("https://www.kupujemprodajem.com/odeca-zenska/bluze/pretraga?categoryId=743&groupId=1992");
}

async cancelLogin()
{
    await this.cancelLoginButton.click();
}

async clickOnDetailedSearch()
{
    await this.detailedSearchButton.click();
}

async clickOnDinRButton()
{
    await this.dinRadioButtonLocator.click();
}

async clickOnCategory()
{
    await this.categoryDropdownLocator.click();
}

async clickOnOnlyWithPrice()
{
    await this.onlyWithPriceChBx.click();
}

async clickOnFirstAdd()
{
    await this.firstAdLocator.click();
}

async clickOnNextAdButton()
{
    await this.addNextAddLocator.click();
}

async clickOnAddContactButton()
{
    await this.addContactButtonLocator.click();
}

async ulogujteSeIsVisible()
{
    const h1 = await this.h1LoginLocator.textContent();
    expect(h1.includes('Ulogujte se')).toBeTruthy();
}

async isAddContactButtonVisible()
{
    const addContactText = await this.addContactButtonLocator.textContent();
    console.log('Text content of Add Contact button:', addContactText);
    
    expect(addContactText.includes('Dodaj u adresar')).toBeTruthy();
}

async isH1TextVisible(text) {
    const element = await this.page.locator(`//h1[contains(.,'${text}')]`);
    const content = await element.textContent();
    expect(content).toContain(text);
}

async chooseConditions(conditions) {
    for (const condition of conditions) {
        await this.conditionInputLocator.type(condition);
        await this.page.keyboard.press('Enter');
    }
}

async enterTextInCategoryDropdownWithDelay(text) {
    await this.groupDropdownLocator.click(); 
    await this.categoryDropdownLocator.type(text, { delay: 100 }); 
    await this.page.keyboard.press('Enter');  
}

async enterTextInGroupDropdownWithDelay(text) {
    await this.groupDropdownLocator.type(text); 
    await this.page.keyboard.press('Enter');  
}

async enterTextInPriceFrom(text) {
    await this.priceFromLocator.type(text); 
    await this.page.keyboard.press('Enter');  
}

async selectCategoryAndGroup(categoryText, groupText) {
 //   await this.clickOnCategory();
    await this.enterTextInCategoryDropdownWithDelay(categoryText);
    await this.enterTextInGroupDropdownWithDelay(groupText);
}

async clickOnApplyFiltersButton()
{
    await this.applyFiltersButtonLocator.click();
}

async waitForSearchResponse() {
    await this.page.waitForResponse(response => 
        response.url().includes('/api/web/v1/search') && 
        response.status() === 200
    );
}

async waitForAddContactUnauthorizedResponse() {
    await this.page.waitForResponse(response => 
        response.url().includes('/api/web/v1/addressbook/add-contact') && 
        response.status() === 401
    );
}

async getSearchResultCount() {

    await this.waitForSearchResponse();
    const text = await this.searchResultCountLocator.textContent();  // Izvlačimo tekst iz locatora
    const count = parseInt(text.replace('.', '').replace(' rezultata', ''));  // Uklanjamo tačku i reč "rezultata" da bismo dobili broj
    return count;  // Vraćamo broj rezultata
}

async isSearchResultCountGreaterThan(threshold) {
    const count = await this.getSearchResultCount();
    return count > threshold;  // Proveravamo da li je broj rezultata veći od zadatog praga
}

}
module.exports = {KupujemProdajemPage};
