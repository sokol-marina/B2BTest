const assert = require('chai').assert;
const expect = require('chai').expect;
const generateRandomIpListsWithinRange = require('./randomeIPList');
require('dotenv').config();

const { Eyes, Target } = require('@applitools/eyes-webdriverio');

const chromeModheader = require('chrome-modheader');
const elementUtil = require('../util/elementUtil');

const messageElement = 'span.richText__weight--light';
const headerElement = '.welcomeAdLayout__text p span';

const expectedMessage = "Activate now for unlimited articles, courtesy of The University of Georgia. No payment needed."
const expectedHeader = 'Unlock your complimentary access.';
const expectedCTA = 'ACTIVATE NOW';


const ipRanges = [
    [[12, 8, 195, 96], [12, 8, 195, 127]],
    [[12, 193, 48, 128], [12, 193, 48, 191]]
];
const NumberOfCheckPerRange = 2;


describe('QA B2B Assets testing', () => {

    // Test-specific objects
    let eyes;

    before(async () => {
        eyes = new Eyes();
        eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
        await browser.waitUntil(async () => {
            try {
                await eyes.open(browser, 'Metered Assets New', 'Welcome Banner Test');
                return true; // Return true to indicate success
            } catch (error) {
                console.error('Error occurred during eyes.open:', error);
                return false; // Return false to continue waiting
            }
        }, {
            timeout: 40000, // Maximum time to wait in milliseconds
            timeoutMsg: 'Eyes.open did not complete successfully'
        });
    });

    after(async () => {
        await eyes.close();
        await browser.deleteSession();
    });

    it('should successfully click the "Updated our terms" button inside an iframe', async () => {

        await browser.url('/')
        try {
            // Wait for the search element to become available
            await browser.waitUntil(
                async () => {
                    return $('.css-1fzhd9j').isExisting();
                },
                {
                    timeout: 5000, // Maximum time to wait in milliseconds
                    timeoutMsg: 'Search element did not become available'
                }
            );

            // Get and interact with the search element
            const searchElement = elementUtil.getElement('.css-1fzhd9j');
            await searchElement.click();
            console.log('Agreed to the Updated Terms ');


            // Add assertions or further interactions as needed
        } catch (error) {
            console.log('Updated Terms window is not displaying', `${error}`);
        }
    });

    it('open the main page with ip address', async () => {


        // Number of IP addresses in each list
        const listOfLists = generateRandomIpListsWithinRange(ipRanges, NumberOfCheckPerRange);
        const maxLength = Math.max(...listOfLists.map(innerArray => innerArray.length));

        for (let i = 0; i < maxLength; i++) {
            for (const innerArray of listOfLists) {
                if (i < innerArray.length) {


                    const ipAddress = innerArray[i];
                    console.log(`Testing with IP address: ${ipAddress}`);

                    await browser.url(chromeModheader.getAddHeaderUrl('fastly-client-ip', ipAddress));
                    await browser.pause(500);
                    await browser.url('/');
                    await browser.pause(1000);

                    // Capture screenshot using Applitools Eyes
                    const testName = `IP address ${ipAddress}`;
                    // Find the banner element
                    const bannerElement = await elementUtil.getElement('.welcomeAdLayout');

                    var actualMessage = await elementUtil.getElementText(messageElement); //span.richText__weight--light
                    const actualHeader = await elementUtil.getElementText(headerElement);

                    expect(actualMessage.replace("\n", " ")).to.be.equal(expectedMessage, `The Asset header should be  ${expectedMessage}`);
                    expect(actualHeader).to.equal(expectedHeader, `The Asset header should be  ${expectedHeader}`);
                    expect(await elementUtil.getElementText('a.welcomeAdLayout__button')).to.equal(expectedCTA, `The CTA should have text: ${expectedCTA}`);
                    expect(await elementUtil.getElement('a.welcomeAdLayout__button').getAttribute('href')).to.equal('http://www.accessnyt.com/', "The CTA should have text: 'http://www.accessnyt.com/'");

                    await eyes.check(testName, Target.region(bannerElement));

                }

                else { console.log('Check ramge of IPs') }
            }

        }

    });


    it('should click the add and verify the Educational Page', async () => {
        await browser.url('/');
        const element = elementUtil.getElement('a.welcomeAdLayout__button');
        const date = new Date()
        await browser.saveScreenshot('../QaTestProject/test/screenshots/wdio' + date + '.png');

        await element.click();

        // Get the original window handle
        const originalWindowHandle = await browser.getWindowHandle();

        // Wait until the ACTIVATE NOW BTN becomes clickable
        await element.waitUntil(
            async () => await element.isClickable(),
            { timeout: 10000, timeoutMsg: 'Element was not clickable within 10 seconds.' }
        );
        // Click the element
        await element.click();

        // Switch to the new window
        const isSwitchedToNewWindow = await browser.waitUntil(
            async () => {
                const windowHandles = await browser.getWindowHandles();
                return windowHandles.length > 1;
            },
            { timeout: 10000, timeoutMsg: 'New window did not open within 10 seconds after click.' }
        );
        console.log('\n', isSwitchedToNewWindow, '\n');
        if (isSwitchedToNewWindow) {
            const windowHandles = await browser.getWindowHandles();
            let desiredWindowHandle = windowHandles[2];
            await browser.switchToWindow(desiredWindowHandle);
            const newWindowPageSource = await browser.getPageSource();

            const expectedURL = 'https://nytimesineducation.com/access-nyt/';
            expect(await browser.getUrl()).to.equal(expectedURL, `URL should match ${expectedURL}`);
            // Perform an action to verify the click behavior using newWindowPageSource
            const expectedEDUText = 'Activate Your Complimentary Access to NYTimes.com, Provided by your School, College or University';
            expect(newWindowPageSource).to.include(expectedEDUText, `Expected text "${expectedEDUText}" should be visible in the new window.`);

            // Switch back to the original window
            await browser.switchToWindow(originalWindowHandle);
            const oldWindowPageSource = await browser.getPageSource();
            console.log('NYT Page title:', await browser.getTitle(), '\n');
            assert.equal(await element.getAttribute('href'), 'http://www.accessnyt.com/');


        } else {
            console.log('New window handle not found.');
        }

    });

});




//describe('Data Layer Test', () => {
//    it('should fetch data layer', async () => {
//        console.log("IM IN DATA LAYER")
//        const dataLayerUrl = 'https://np.a.nytimes.com/svc/nyt-secure/testing/set-cookie';
//        const key = 'x-jkidd-auth';
//        const value = 'CAESIHkPvrEBdWRi5KbFp3PkuHrnQvLr44H8I1Z6584kOOuhGiQKHGh2cy5wWHlKYkRmZWVzSzZ4MGxVSHAzeGxERlAQ1Pj87gE';
//        const headers = new Headers();
//        headers.append(key, value);
//        const requestOptions = {
//            method: 'GET',
//            headers: headers
//        };
//        console.log(headers);
//        try {
//            const response = fetch(dataLayerUrl, requestOptions);
//            if (!response.ok) {
//                throw new Error('Failed to fetch data layer');
//            }
//            const data = response.json();
//            console.log(JSON.stringify(data));
//            return data;
//        } catch (error) {
//            console.error('An error occurred:', error);
//            return null; // You can handle the error as needed
//        }
//    })
//});




