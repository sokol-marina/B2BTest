
const expect = require('chai').expect;
const elementUtil = require('../../../utils/elementUtil');
const generateRandomIpListsWithinRange = require('../../../utils/randomeIPList');
const { handleNewWindowAndVerify } = require('../../../utils/windowHandling');
const { iterateListOfLists } = require('../../src/pages/mainPage')
const { checkDesktopAndMobileViews } = require('../config/eyesSetup');
const { getDataLayer } = require('../../../backend/dataUtils/dataLayer')

const expectedMessage = "Activate now for unlimited articles, courtesy of The University of Georgia. No payment needed."
const expectedHeader = 'Unlock your complimentary access.';
const expectedCTA = 'ACTIVATE NOW';

const expectedURL = 'http://www.accessnyt.com/';

const expectCISAccountCode = '913412169'
const displayName = 'The University of Georgia';


const ipRanges = [
    [[12, 8, 195, 96], [12, 8, 195, 127]],
    [[12, 193, 48, 128], [12, 193, 48, 191]]
];


describe('Data Layer Test', () => {

    const fastlyClientIp = '12.8.195.96';

    it('Should fetch data from the data layer', async () => {

        const jsonKiddModel = await getDataLayer(fastlyClientIp);
        // Example test case
        console.log('****************** Data layer Verification *********************')
        expect(jsonKiddModel).to.exist; // Assert that jsonKiddModel is not null or undefined
        expect(jsonKiddModel.user.type).to.equal('anon', 'Expected user type to be "anon", Actual: ', jsonKiddModel.user.type);// Assert the User is Anon
        expect(jsonKiddModel.user.tracking.uid).to.equal(0, 'Expected tracking UID to be 0'); // Assert the tracking UID
        expect(jsonKiddModel.ip.corp.cisAccountCode).to.equal(expectCISAccountCode, `Expected CIS Account Number: ${expectCISAccountCode}, Actual: ${jsonKiddModel.ip.corp.cisAccountCode}`);
        expect(jsonKiddModel.ip.corp.displayName).to.equal(displayName, `Expected Display Name: ${displayName}, Actual: ${jsonKiddModel.ip.corp.displayName}`);
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

        for (const innerArray of listOfLists) {
            const innerArrayLength = innerArray.length;
            for (let i = 0; i < maxLength; i++) {
                if (i < innerArrayLength) {
                    const ipAddress = innerArray[i];
                    const { actualMessage, actualHeader, actualButtonText } = await iterateListOfLists(ipAddress);

                    expect(actualMessage.replace("\n", " ")).to.be.equal(expectedMessage, `The Asset header should be  ${expectedMessage}`);
                    expect(actualHeader).to.equal(expectedHeader, `The Asset header should be  ${expectedHeader}`);
                    expect(actualButtonText).to.equal(expectedCTA, `The CTA should have text: ${expectedCTA}`);

                    // Call the window handling function
                    const actualDrivesToURL = await handleNewWindowAndVerify(browser, elementUtil);
                    expect(actualDrivesToURL).to.equal(expectedURL, `The URL should be equal to: "${expectedURL}"`);
                    //Capture screenshot using Applitools Eyes
                    await checkDesktopAndMobileViews(ipAddress, 'desktop');
                }
            }
        }
    });


    it('should take a screenshot', async () => {

        await browser.url('/');
        // Save a screenshot with a timestamp
        const date = new Date();
        await browser.saveScreenshot('../screenshots' + date + '.png');
    });
});







