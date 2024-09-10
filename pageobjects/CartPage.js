const {test, expect} = require('@playwright/test');
class CartPage
{
constructor(page)
{
    this.page = page;
    this.cartProducts = page.locator("div li").first();
    this.productsText = page.locator(".card-body b");
    this.cart =  page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
    this.checkout = page.locator("text=Checkout");

}

async VerifyProductIdAndPriceIsDisplayed(_id, price, name) {
    const orderIdDetails = await this.page.locator(".itemNumber").textContent();
    expect(orderIdDetails.includes(_id)).toBeTruthy();
    console.log(orderIdDetails);
    console.log(_id);

    const orderPriceDetails = await this.page.locator("div[class='prodTotal cartSection']").textContent();
    expect(orderPriceDetails.includes(price)).toBeTruthy();
    console.log(orderPriceDetails);
    console.log(price);

    const orderNameDetails = await this.page.locator("div[class='cartSection'] h3").textContent();
    expect(orderNameDetails.includes(name)).toBeTruthy();
    console.log(orderNameDetails);
    console.log(name);
}

async VerifyThatThereAreNoProductsInCart() {
    const h1 = await this.page.locator("div[class='ng-star-inserted'] h1").textContent();
    expect(h1.includes('No Products in Your Cart')).toBeTruthy();
    console.log(h1);

    const toastMsg = await this.page.locator("#toast-container").textContent();
    expect(toastMsg.includes('No Product in Your Cart')).toBeTruthy();
    console.log(toastMsg);
}


async VerifyProductIsDisplayed(productName)
{
   
    await this.cartProducts.waitFor();
    const bool =await this.getProductLocator(productName).isVisible();
    expect(bool).toBeTruthy();

}

async Checkout()
{
    await this.checkout.click();
}

async clickOnThrashBinButton()
{
    await this.page.locator("button[class='btn btn-danger']").click()
}

 getProductLocator(productName)
{
    return  this.page.locator("h3:has-text('"+productName+"')");
}

}
module.exports = {CartPage};