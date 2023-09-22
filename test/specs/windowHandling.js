const { assert, expect } = require('chai');

// Define the window handling function
async function handleNewWindowAndVerify(browser, elementUtil) {
    // Wait until the ACTIVATE NOW BTN becomes clickable
    const BannerCTA = $('a.welcomeAdLayout__button');
    await elementUtil.waitForElementToBeClickable(BannerCTA);
    assert.equal(await BannerCTA.getAttribute('href'), 'http://www.accessnyt.com/');
    await BannerCTA.click();

    // Get the original window handle
    const originalWindowHandle = await browser.getWindowHandle();

    // Switch to the new window
    const isSwitchedToNewWindow = await browser.waitUntil(
        async () => {
            const windowHandles = await browser.getWindowHandles();
            return windowHandles.length > 1;
        },
        { timeout: 10000, timeoutMsg: 'New window did not open within 10 seconds after click.' }
    );

    if (isSwitchedToNewWindow) {
        // Get the window handles
        const windowHandles = await browser.getWindowHandles();

        // Switch to the newly opened window
        let desiredWindowHandle = windowHandles[1]; // Assuming it's the second window
        await browser.switchToWindow(desiredWindowHandle);


        // Get the page source of the new window
        const newWindowPageSource = await browser.getPageSource();
        const expectedURL = 'https://nytimesineducation.com/access-nyt/';
        expect(await browser.getUrl()).to.equal(expectedURL, `URL should match ${expectedURL}`);

        // Verify the presence of expected text on the new window
        const expectedEDUText = 'Activate Your Complimentary Access to NYTimes.com, Provided by your School, College or University';
        expect(newWindowPageSource).to.include(expectedEDUText, `Expected text "${expectedEDUText}" should be visible in the new window.`);

        await browser.closeWindow();
        await browser.switchToWindow(originalWindowHandle);

        // Assert additional verifications on the original window
        assert.equal(await browser.getTitle(), 'The New York Times - Breaking News, US News, World News and Videos');
      
    } else {
        console.log('New window handle not found.');
    }
}

module.exports = {
    handleNewWindowAndVerify,
};