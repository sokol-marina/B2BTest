

const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class EducationPage extends Page {
    /**
     * define selectors using getter methods
     */
    get flashAlert () {
        return $('#flash');
    }
}

module.exports = new EducationPage();
