const { expect } = require('@playwright/test');

class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://www.kupujemprodajem.com';
    }

    // **Common Actions**
    async navigateTo(url) {
        await this.page.goto(url);
    }

    async click(locator) {
        await locator.click();
    }

    async fillInput(locator, text) {
        await locator.fill(text);
    }

    async typeAndEnter(locator, text, options = {}, delay = 0) {
        if (delay > 0) {
            await locator.pressSequentially(text, { delay });
        } else {
            await locator.pressSequentially(text);
        }
        await this.page.keyboard.press('Enter');
    }
    
    async selectOption(locator, text, options = {}, delay = 0) {
        await this.typeAndEnter(locator, text, options, delay);
    }

    // **Waits**
    async waitForResponse(urlPart, statusCode = 200) {
        await this.page.waitForResponse(response =>
            response.url().includes(urlPart) && response.status() === statusCode
        );
    }

    // **POST Request Function with Dynamic Expectations**
    async postRequest(endpoint, data, expectedStatus, expectedJsonResponse) {
        const url = `${this.baseUrl}${endpoint}`;

        // Slanje POST zahteva pomoću Playwright-a
        const response = await this.page.request.post(url, {
            data: data // Dinamički podaci za POST
        });

        // Dinamički proveravamo status odgovora
        expect(response.status()).toBe(expectedStatus);

        // Parsiranje JSON odgovora
        const jsonResponse = await response.json();

        // Dinamički proveravamo sadržaj JSON odgovora
        expect(jsonResponse).toEqual(expectedJsonResponse);

        return jsonResponse;
    }

    // **POST Request with Token**
    async postRequestWithToken(endpoint, data, expectedStatus, expectedJsonResponse, token = null) {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = token
            ? { Authorization: `Bearer ${token}` }  // Dodaj Authorization header ako postoji token
            : {};

        const response = await this.page.request.post(url, {
            data: data,
            headers: headers  // Prosleđivanje header-a sa tokenom (ako postoji)
        });

        // Provera statusa odgovora
        expect(response.status()).toBe(expectedStatus);

        // Parsiranje JSON odgovora
        const jsonResponse = await response.json();

        // Provera sadržaja JSON odgovora
        expect(jsonResponse).toEqual(expectedJsonResponse);

        return jsonResponse;
    }
    
    // Generiše dinamički URL za API pretragu
    async generateSearchUrl({ categoryPath, groupPath, categoryId, groupId, priceFrom, currency, conditions, hasPrice }) {
        const url = new URL(`${this.baseUrl}/${categoryPath}/${groupPath}/pretraga`);

        url.searchParams.append('categoryId', categoryId);
        url.searchParams.append('groupId', groupId);
        url.searchParams.append('priceFrom', priceFrom);
        url.searchParams.append('currency', currency);

        // Direktno dodavanje uslova (conditions)
        conditions.forEach(condition => {
            url.searchParams.append('condition', condition);
        });

        if (hasPrice) {
            url.searchParams.append('hasPrice', 'yes');
        }

        return url.toString();
    }

    // Funkcija za slanje API GET zahteva i proveru odgovora (status 200 OK)
    async searchByApi(options) {
        const searchUrl = await this.generateSearchUrl(options);

        const response = await this.page.request.get(searchUrl);
        if (response.status() !== 200) {
            throw new Error(`Expected status 200, but got ${response.status()}`);
        }

        const result = await response.text();
        return result;
    }

    // **Function to parse listing count from HTML response**
    async getListingCountFromMeta(response) {
        // Dobijamo HTML sadržaj iz odgovora
        const htmlContent = await response.text();

        // Parsiranje broja oglasa iz meta tag-a
        const metaDescriptionRegex = /<meta name="description" content="([\d.,]+) oglasa/;
        const match = metaDescriptionRegex.exec(htmlContent);

        // Proverava da li je nađeno podudaranje
        expect(match).not.toBeNull();
        expect(match[1]).not.toBeUndefined();

        // Parsiranje broja oglasa
        const resultCount = parseInt(match[1].replace(/\./g, ''), 10);

        return resultCount; // Vraća broj oglasa
    }
    
    // **Utility Methods**
    async retryClick(locator1, locator2, retries = 3, delay = 2000) {
        await this.page.waitForTimeout(delay);

        for (let i = 0; i < retries; i++) {
            try {
                // Check visibility of locator1 (addContact button)
                if (await locator1.isVisible()) {
                    // If locator1 is visible, exit the function (do nothing)
                    return;
                } else {
                    // If locator1 is not visible, try to click locator2 (Next ad button)
                    await locator2.click();
                    // Wait for a short time before the next check
                    await this.page.waitForTimeout(delay);
                }
            } catch (error) {
                if (i === retries - 1) throw error; // Re-throw the error if retries exhausted
                await this.page.waitForTimeout(delay); // Wait before retrying
            }
        }
    }    
}

module.exports = { BasePage };
