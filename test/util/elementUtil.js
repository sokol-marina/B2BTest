class ElementUtil {

    getElementText(selector) {
        const message = $(selector);
        message.waitForExist({ timeout: 5000 });
        let text = message.getText();
        return text;
    }
    getHeaderText(selector) {
        const header = $(selector);
        header.isDisplayed();
        var headerText = header.getText();
        return headerText;
    }


    clickElement(selector) {
        const element = $(selector);
        element.waitForExist({ 
            timeout: 5000,
            timeoutMsg: `Element ${selector} taking too long to exist` // Custom error message on timeout
    });
        element.click;
    }

    navigateToPage(pagePath) {
        const url = `https://np.a.nytimes.com/svc/nyt-secure/testing/set-cookie?ip_address=${pagePath}`;
        browser.url(url);
    }

}
module.exports = new ElementUtil();