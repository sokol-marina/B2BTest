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

    getElement(selector) {
        const el = $(selector);
        el.waitForExist({ timeout: 5000 });
        return el;
    }

    navigateToPage(pagePath) {
        const url = `https://np.a.nytimes.com/svc/nyt-secure/testing/set-cookie?ip_address=${pagePath}`;
        browser.url(url);
    }


}
module.exports = new ElementUtil();