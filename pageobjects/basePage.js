const { expect } = require('@playwright/test');

class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://www.kupujemprodajem.com';
    }

    // Funkcija za navigaciju, koristi baseUrl i opcionalni relativni path
    async navigateTo(path = '/') {
        const fullUrl = `${this.baseUrl}${path}`;  // Kombinuje baseUrl sa putanjom
        await this.page.goto(fullUrl);  // Navigacija na kombinovani URL
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

        const response = await this.page.request.post(url, {
            data: data
        });

        expect(response.status()).toBe(expectedStatus);
        const jsonResponse = await response.json();
        expect(jsonResponse).toEqual(expectedJsonResponse);

        return jsonResponse;
    }

    // **POST Request with Token**
    async postRequestWithToken(endpoint, data, expectedStatus, expectedJsonResponse, token = null) {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await this.page.request.post(url, {
            data: data,
            headers: headers
        });

        expect(response.status()).toBe(expectedStatus);
        const jsonResponse = await response.json();
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

        conditions.forEach(condition => {
            url.searchParams.append('condition', condition);
        });

        if (hasPrice) {
            url.searchParams.append('hasPrice', 'yes');
        }

        return url.toString();
    }

    // **Function to parse listing count from HTML response**
    async getListingCountFromMeta(response) {
        const htmlContent = await response.text();
        const metaDescriptionRegex = /<meta name="description" content="([\d.,]+) oglasa/;
        const match = metaDescriptionRegex.exec(htmlContent);

        expect(match).not.toBeNull();
        expect(match[1]).not.toBeUndefined();

        const resultCount = parseInt(match[1].replace(/\./g, ''), 10);

        return resultCount;
    }

    // **Utility Methods**
    async retryClick(locator1, locator2, retries = 3, delay = 2000) {
        await this.page.waitForTimeout(delay);

        for (let i = 0; i < retries; i++) {
            try {
                if (await locator1.isVisible()) {
                    return;
                } else {
                    await locator2.click();
                    await this.page.waitForTimeout(delay);
                }
            } catch (error) {
                if (i === retries - 1) throw error;
                await this.page.waitForTimeout(delay);
            }
        }
    }    
}

module.exports = { BasePage };
