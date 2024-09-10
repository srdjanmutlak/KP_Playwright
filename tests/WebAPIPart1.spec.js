const {test, request} = require('@playwright/test');
const {APiUtils, loginPayLoad, addToCartPayLoad} = require('../utils/APiUtils');
const {POManager} = require('../pageobjects/POManager');
const productDetails = addToCartPayLoad.product[0];
const _id = productDetails._id
const price = productDetails.productPrice
const name = productDetails.productName

let response;
test.beforeAll( async()=>
{
   const apiContext = await request.newContext();
   const apiUtils = new APiUtils(apiContext,loginPayLoad);
   response =  await apiUtils.addToCart(addToCartPayLoad);

})

test('@API Add to cart', async ({page})=>
{ 
    page.addInitScript(value => {

        window.localStorage.setItem('token',value);
    }, response.token );

const poManager = new POManager(page);

const dashboardPage = poManager.getDashboardPage();
await dashboardPage.goToDashboard()
await dashboardPage.navigateToCart();

const cartPage = poManager.getCartPage();
await cartPage.VerifyProductIdAndPriceIsDisplayed(_id, price, name);
await cartPage.clickOnThrashBinButton();

await cartPage.VerifyThatThereAreNoProductsInCart();

});

