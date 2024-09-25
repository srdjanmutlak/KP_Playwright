const { BasePage } = require('./basePage');
const { LoginPage } = require('./loginPage');
const { HomePage } = require('./homePage');
const { DetailedSearchPage } = require('./detailedSearchPage');
const { AdPage } = require('./adPage');

class POManager {
    constructor(page) {
        this.page = page;
        this.basePage = new BasePage(this.page);
        this.loginPage = new LoginPage(this.page);
        this.homePage = new HomePage(this.page);
        this.detailedSearchPage = new DetailedSearchPage(this.page);
        this.adPage = new AdPage(this.page);
    }

    getBasePage() {
        return this.basePage;
    }

    getLoginPage() {
        return this.loginPage;
    }

    getKupujemProdajemPage() {
        return this.kupujemProdajemPage;
    }

    getHomePage() {
        return this.homePage;
    }

    getDetailedSearchPage() {
        return this.detailedSearchPage;
    }

    getAdPage() {
        return this.adPage;
    }
}

module.exports = { POManager };
