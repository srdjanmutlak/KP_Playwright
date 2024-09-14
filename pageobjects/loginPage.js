// loginPage.js
const { BasePage } = require('./basePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.locators = {
            cancelLoginButton: page.locator("button[class='Button_base__G3HTK Button_big__vkHxv Modal_closeIcon__CJuTW']"),
            loginHeader: page.locator("aside[role='dialog'] h1"),
        };
    }

    async cancelLogin() {
        await this.click(this.locators.cancelLoginButton);
    }

    async isHeaderTextVisibleAfter401(expectedText) {
        await this.waitForResponse('/api/web/v1/addressbook/add-contact', 401);
        const content = await this.locators.loginHeader.textContent();
        return content.includes(expectedText);
    }
}

module.exports = { LoginPage };