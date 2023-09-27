
const elementUtil = require('../../../utils/elementUtil');
const chromeModheader = require('chrome-modheader');


async function iterateListOfLists(ipAddress) {
    console.log(`Testing with IP address: ${ipAddress}`);
    await browser.url(chromeModheader.getAddHeaderUrl('fastly-client-ip', ipAddress));
    await browser.pause(1000);
    await browser.url('/');
    await browser.pause(1000);
    

    // Find the banner element
    
    const actualMessage = await elementUtil.getElementText('span.richText__weight--light'); //span.richText__weight--light
    const actualHeader = await elementUtil.getElementText('.welcomeAdLayout__text p span');
    const actualButtonText = await elementUtil.getElementText('a.welcomeAdLayout__button')

    return { actualMessage, actualHeader, actualButtonText}; 

}

module.exports = {
    iterateListOfLists, };