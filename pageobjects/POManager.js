const {LoginPage} = require('./LoginPage');
const {DashboardPage} = require('./DashboardPage');
const {OrdersHistoryPage} = require('./OrdersHistoryPage');
const {OrdersReviewPage} = require('./OrdersReviewPage');
const {CartPage} = require('./CartPage');
const {KupujemProdajemPage} = require('./KupujemProdajemPage');
const {TestPage} = require('./TestPage');

class POManager
{
constructor(page)
{
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    this.ordersReviewPage = new OrdersReviewPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.kupujemProdajemPage = new KupujemProdajemPage(this.page);

    this.testPage = new TestPage(this.page);

}

getTestPage()
{
    return this.testPage;
}


getLoginPage()
{
    return this.loginPage;
}

getCartPage()
{
    return this.cartPage;
}

getDashboardPage()
{
    return this.dashboardPage;
}
getOrdersHistoryPage()
{
    return this.ordersHistoryPage;
}

getOrdersReviewPage()
{
    return this.ordersReviewPage;
}

getKupujemProdajem()
{
    return this.kupujemProdajemPage;
}
}
module.exports = {POManager};