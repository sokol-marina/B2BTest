const assert = require('chai').assert;
const expect = require('chai').expect;
const makeIP = require('./makeIP');

const chromeModheader = require('chrome-modheader');
const elementUtil = require('../util/elementUtil');


const messageElement = 'span.richText__weight--light';
const headerElement = '.welcomeAdLayout__text p span';

const expectedMessage = "Activate now for unlimited articles, courtesy of Villanova University. No payment needed."
const expectedHeader = 'Unlock your complimentary access.';

let start = '153.104.%.%';


const end = '153.104.255.255';

describe('Iframe Test', () => {
    it('should click a button inside an "Updated our terms" iframe', async () => {
        await browser.url('/');
        await browser.waitUntil(() => {
            return $('.css-1fzhd9j').isExisting();
        }, {
            timeout: 10000, // Maximum time to wait in milliseconds
            timeoutMsg: 'Search element did not become available'
        });
        const searchElement = $('.css-1fzhd9j');
        // Now that the search element is available, you can interact with it
        searchElement.click();

    });
});


describe('My Login application', async () => {
    it('open the main page with ip address', async () => {
        //await browser.url('/');
        let tokens = start.split('.');
        let list = await makeIP(tokens, 0, 0, end);
        let newList = await Object.entries(list).slice(0, 2).map(entry => entry[1]);
        for (const el of newList) {
            await browser.url(chromeModheader.getAddHeaderUrl('fastly-client-ip', el));
            await browser.pause(2000);
            await browser.url('/');

            var actualMessage = await elementUtil.getElementText(messageElement);
            const actualHeader = await elementUtil.getElementText(headerElement);

            expect(actualMessage.replace("\n", " ")).to.be.equal(expectedMessage);
            const btn = 'a.welcomeAdLayout__button';

            const element = elementUtil.getElement(btn);
            assert.equal(actualHeader, expectedHeader);
            assert.equal(await elementUtil.getElementText(btn), 'ACTIVATE NOW');
            assert.equal(await element.getAttribute('href'), 'http://www.accessnyt.com/');
        }
    });
});

describe('Window Handling Test', async () => {
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




