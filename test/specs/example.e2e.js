
const expect = require('chai').expect;
const elementUtil = require('../util/elementUtil');
const chromeModheader = require('chrome-modheader');

const generateRandomIpListsWithinRange = require('./randomeIPList');
const { handleNewWindowAndVerify } = require('./windowHandling');
const { iterateListOfLists } = require('../config/mainPage')
const { captureBaselineScreenshotsEyes, compareScreenshotsEyes } = require('../config/eyesSetup');


const expectedMessage = "Activate now for unlimited articles, courtesy of The University of Georgia. No payment needed."
const expectedHeader = 'Unlock your complimentary access.';
const expectedCTA = 'ACTIVATE NOW';

const expectedURL = 'http://www.accessnyt.com/'; 


const ipRanges = [
    [[12, 8, 195, 96], [12, 8, 195, 127]],
    [[12, 193, 48, 128], [12, 193, 48, 191]]
];


describe('Data Layer Test', () => {
    const DATA_LAYER_URL = process.env.DATA_LAYER_URL;
    const IP_SEGMENTS_URL_PARAMETER = "ip_address";
    const CALLER_ID_PARAMETER = "caller_id";
    const CALLER_ID_PARAMETER_VALUE = "magnolia";
    const fastlyClientIp = '12.8.195.96';
    let authHeaders;


    before(async () => {
        try {
            authHeaders = new Headers();
            authHeaders.set(process.env.DATA_LAYER_AUTHKEY, process.env.DATA_LAYER_AUTHVALUE);

            const requestOptions = {
                method: 'GET',
                headers: authHeaders
            };
            const response = await fetch(DATA_LAYER_URL, requestOptions);

        } catch (error) {
            console.error('An error occurred:', error);
            return null;
        }

    });

    it('Should fetch data from the data layer', async () => {
        let url;

        async function getDataLayer() {

            url = `${DATA_LAYER_URL}?${CALLER_ID_PARAMETER}=${CALLER_ID_PARAMETER_VALUE}`;

            if (fastlyClientIp) {
                url += `&${IP_SEGMENTS_URL_PARAMETER}=${fastlyClientIp}`;
                //console.log('URL :', '\n', url);

            }
            try {
                const response = await fetch(url, {
                    headers: authHeaders,
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`Failed API Request: ${response.statusText} -- HTTP Response Code: ${response.status}`);
                }

                const jsonKiddModel = await response.json();
                return jsonKiddModel;
            } catch (error) {
                console.error('An error occurred:', error);
                throw error;
            }
        }

        // Example test case
        const formattedCookies = [];
        const jsonKiddModel = await getDataLayer(formattedCookies, '');

        expect(jsonKiddModel).to.exist; // Assert that jsonKiddModel is not null or undefined
        // Chai assertion for the second expectation
        expect(jsonKiddModel.user.type).to.equal('anon', 'Expected user type to be "anon"');
        expect(jsonKiddModel.user.tracking.uid).to.equal(0, 'Expected tracking UID to be 0'); // Assert the tracking UID

        //console.log('Data Layer:', '\n', jsonKiddModel);

    });

});


describe('QA B2B Assets testing', () => {

    it('should successfully click the "Updated our terms" button inside an iframe', async () => {

        await browser.url('/')
        const cta = await elementUtil.getElement('.css-1fzhd9j');
        cta.click();
    });

    it('open the main page with ip address', async () => {

        // Number of checks IP addresses in each list
        const listOfLists = generateRandomIpListsWithinRange(ipRanges, 1);
        const maxLength = Math.max(...listOfLists.map(innerArray => innerArray.length));
        // Flag to track if "Check range of IPs" has been printed
        let isFirstIteration = true;

        for (const innerArray of listOfLists) {
            const innerArrayLength = innerArray.length;
            for (let i = 0; i < maxLength; i++) {
                if (i < innerArrayLength) {
                    const ipAddress = innerArray[i];
                    const { actualMessage, actualHeader } = await iterateListOfLists(ipAddress);

                    expect(actualMessage.replace("\n", " ")).to.be.equal(expectedMessage, `The Asset header should be  ${expectedMessage}`);
                    expect(actualHeader).to.equal(expectedHeader, `The Asset header should be  ${expectedHeader}`);
                    expect(await elementUtil.getElementText('a.welcomeAdLayout__button')).to.equal(expectedCTA, `The CTA should have text: ${expectedCTA}`);

                    //Capture screenshot using Applitools Eyes
                    if (isFirstIteration) {
                        // Capture the first screenshot as the baseline using Applitools Eyes
                        await captureBaselineScreenshotsEyes(ipAddress);
                        isFirstIteration = false;
                    } else {
                        // Capture subsequent screenshots and compare them to the baseline
                        await browser.pause(1000);
                        await compareScreenshotsEyes(ipAddress);
                    }
                    console.log('   Finished processing IP address.');
                }
            }
        }
    });


    it('should click the add and verify the Educational Page', async () => {

        await browser.url('/');

        // Save a screenshot with a timestamp
        const date = new Date();
        await browser.saveScreenshot('../QaTestProject/test/screenshots/wdio' + date + '.png');

        // Call the window handling function
        const actualDrivesToURL = await handleNewWindowAndVerify(browser, elementUtil);
        await handleNewWindowAndVerify(browser, elementUtil);
        expect(actualDrivesToURL).to.equal(expectedURL, `The URL should be equal to: "${expectedURL}"`);

    });
});







