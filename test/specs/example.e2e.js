const assert = require('chai').assert;
const expect = require('chai').expect;
const makeIP = require('./makeIP');
const chromeModheader = require('chrome-modheader');
const elementUtil = require('../util/elementUtil');


const messageElement = 'span.richText__weight--light';
const headerElement = 'span[class="richText__weight--bold welcomeAd__header"]';
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
            await console.log('Im in the LOOP')
            await browser.url(chromeModheader.getAddHeaderUrl('fastly-client-ip', el));
            await browser.pause(2000);
            await browser.url('/');

            var actualMessage = await elementUtil.getElementText(messageElement);
            const actualHeader = await elementUtil.getHeaderText(headerElement);

            expect(actualMessage.replace("\n", " ")).to.be.equal(expectedMessage);
            assert.equal(actualHeader, expectedHeader);

            const link = await $('=complimentory access')
            //const headerText2 =  $('span.welcomeAd__wrap').getText();
            //const headerText3 = headerText1 +' ' + headerText2;
            //const btn = await $('.welcomeAdLayout__button');
            //assert.equal(elementUtil.getElementText(btn), 'Activate Now');
        }
    })
    it('Take a screenshot', async () => {
        const date = new Date()

        await browser.saveScreenshot('../QaTestProject/test/screenshots/wdio' + date + '.png');
    });
});






