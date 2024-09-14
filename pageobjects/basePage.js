// basePage.js
class BasePage {
    constructor(page) {
        this.page = page;
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
            // Use pressSequentially with delay between key presses
            await locator.pressSequentially(text, { delay });
        } else {
            // Use pressSequentially without delay
            await locator.pressSequentially(text);
        }
        await this.page.keyboard.press('Enter'); // Press Enter after typing
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
