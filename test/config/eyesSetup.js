const elementUtil = require('../util/elementUtil');
const { Eyes, Target } = require('@applitools/eyes-webdriverio');

const eyes = new Eyes();

eyes.setServerUrl(process.env.APPLITOOLS_SERVER_URL);
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);

async function setupEyes() {
    try {
        await browser.waitUntil(async () => {
            try {
                await eyes.open(browser, 'Metered Assets New', 'Welcome Banner Test');
                return true;
            } catch (error) {
                console.error('Error occurred during eyes.open:', error);
                return false;
            }
        }, {
            timeout: 40000,
            timeoutMsg: 'Eyes.open did not complete successfully'
        });
    } catch (error) {
        console.error('Error in setupEyes:', error);
    }
}



async function tearDownEyes() {
    try {
        await eyes.close();
        await browser.deleteSession();
    } catch (error) {
        console.error('Error in tearDownEyes:', error);
    }
}

async function compareScreenshotsEyes(ipAddress) {
    await eyes.open(driver, 'Metered Assets New', 'Welcome Banner Test');

    const bannerElement = await elementUtil.getElement('.welcomeAdLayout');
    // Capture the current screenshot
    await eyes.check(`IP address ${ipAddress}`, Target.region(bannerElement));
    await eyes.close();

}

async function captureScreenshotsEyes(ipAddress) {
    await eyes.open(driver, 'Metered Assets New', 'Welcome Banner Test');
    // Capture the screenshot
    const bannerElement = await elementUtil.getElement('.welcomeAdLayout');
    await eyes.check(`Baseline with IP address ${ipAddress}`, Target.region(bannerElement));
    await eyes.close();
}

module.exports = {
    eyes,
    setupEyes,
    tearDownEyes,
    captureScreenshotsEyes,
    compareScreenshotsEyes,
};