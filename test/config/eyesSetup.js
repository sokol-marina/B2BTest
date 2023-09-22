const elementUtil = require('../util/elementUtil');
const { Eyes, Target } = require('@applitools/eyes-webdriverio');

const eyes = new Eyes();

eyes.setServerUrl(process.env.APPLITOOLS_SERVER_URL);
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);


async function compareScreenshotsEyes(ipAddress) {
    try {
        await eyes.open(driver, 'Metered Assets New', 'Welcome Banner Test');

        // Capture the current screenshot
        await eyes.check(`IP address ${ipAddress}`, Target.region(elementUtil.getElement('.welcomeAdLayout')));
        await eyes.close();
    } catch (error) {
        console.error('Error in captureScreenshotsEyes:', error);
    }

}

async function captureBaselineScreenshotsEyes(ipAddress) {
    try {
        await eyes.open(driver, 'Metered Assets New', 'Welcome Banner Test');
        // Capture the screenshot
        await eyes.check(`Baseline with IP address ${ipAddress}`, Target.region(elementUtil.getElement('.welcomeAdLayout')));
        await eyes.close();
    } catch (error) {
        console.error('Error in captureScreenshotsEyes:', error);
    }
}

module.exports = {
    captureBaselineScreenshotsEyes,
    compareScreenshotsEyes,
};