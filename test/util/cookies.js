class getCookies {

    getCookie() {
        const NYT_A_NAME = "nyt-a";
        const ABRA_OVERRIDES_NAME = "abra-overrides";
        const NYT_S_NAME = "NYT-S";
        const NYT_JKIDD_NAME = "nyt-jkidd";
        const NYT_JKIDD_UID_KEY_NAME = "uid";
        const JKIDD_T_NAME = "jkidd-t";

        const formattedCookies = [];
        // Secure; regi, login, etc
        const cookie = {
            domain: "nytimes.com",
            path: "/",
            name: NYT_A_NAME,
            value: "9cpP-TVwvMWQI8bNPaVwcd"
        };
        formattedCookies.push(cookie);
        console.log('formatted Cookies :', formattedCookies)

        return formattedCookies;
    }
}
module.exports = new getCookies(); 