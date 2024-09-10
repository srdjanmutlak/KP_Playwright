const {expect} = require('@playwright/test');

const loginPayLoad = {userEmail:"anshika@gmail.com",userPassword:"Iamking@000"};

const addToCartPayLoad = {
    _id:"620c7bf148767f1f1215d2ca",
    product:[{
       _id:"6262e95ae26b7e1a10e89bf0",
       productName:"zara coat 3",
       productCategory:"fashion",
       productSubCategory:"shirts",
       productPrice:31500,
       productDescription:"zara coat 3",
       productImage:"https://rahulshettyacademy.com/api/ecom/uploads/productImage_1650649434146.jpeg",
       productRating:"0",
       productTotalOrders:"0",
       productStatus:true,
       productFor:"women",
       productAddedBy:"admin@gmail.com",
       __v:0
    }]
 }

class APiUtils
{

    constructor(apiContext,loginPayLoad)
    {
        this.apiContext =apiContext; 
        this.loginPayLoad = loginPayLoad;
        
    }

    async getToken()
     {
        const loginResponse =  await  this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:this.loginPayLoad
         } )//200,201,
        const loginResponseJson = await loginResponse.json();
        const token =loginResponseJson.token;
        console.log(token);
        return token;

    }

    async createOrder(orderPayLoad)
    {
        let response = {};
       response.token = await this.getToken();
    const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
   {
    data : orderPayLoad,
    headers:{
                'Authorization' :response.token,
                'Content-Type'  : 'application/json'
            },

   })
   const orderResponseJson =await orderResponse.json();
   console.log(orderResponseJson);
  const orderId = orderResponseJson.orders[0];
   response.orderId = orderId;

   return response;
}

async addToCart(addToCartPayLoad) {
    let response = {};
    response.token = await this.getToken();

    const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/user/add-to-cart", {
        data: addToCartPayLoad,
        headers: {
            'Authorization': response.token,
            'Content-Type': 'application/json'
        },
    });

    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);

    const expectedMessage = 'Product Added To Cart';
    expect(orderResponseJson.message).toContain(expectedMessage);

    return response;
}

    }
module.exports = {APiUtils, loginPayLoad, addToCartPayLoad};




