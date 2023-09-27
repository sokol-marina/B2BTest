const elementUtil = require('../../../utils/elementUtil');
const { Eyes, Target, BatchInfo } = require('@applitools/eyes-webdriverio');

const eyes = new Eyes();


eyes.setServerUrl(process.env.APPLITOOLS_SERVER_URL);
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);

// Create a BatchInfo for desktop and mobile
const desktopBatch = new BatchInfo('Desktop Batch');
const mobileBatch = new BatchInfo('Mobile Batch');
eyes.setBatch(desktopBatch);

 // Set the batch based on the device type and viewport size
function setViewport(deviceType) {
    if (deviceType === 'desktop') {
        eyes.setViewportSize({ width: 1200, height: 800 });
        eyes.setBatch(desktopBatch);
    } else if (deviceType === 'mobile') {
        eyes.setViewportSize({ width: 375, height: 667 }); // Example mobile viewport size
        eyes.setBatch(mobileBatch);
    }
}

async function checkDesktopAndMobileViews(ipAddress, deviceType) {
    try {
        // Check the specified view
        await eyes.open(driver, 'Metered Assets New', `${deviceType} `);
        eyes.setViewportSize({ width: 1200, height: 800 });
        // Capture the current screenshot
        await eyes.check(`${deviceType} ${ipAddress}`, Target.region(elementUtil.getElement('section.welcomeAdLayout:nth-child(4)')));
        await eyes.close();
        console.log(`   Finished processing IP address: ${ipAddress} on ${deviceType}`);
    } catch (error) {
        console.error(`Error in checkViews (${deviceType}):`, error);
    }


}

module.exports = {
    checkDesktopAndMobileViews,
};