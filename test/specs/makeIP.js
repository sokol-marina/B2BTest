

const tokenLimit = 256;
var list = [];




// start the recursion loop on the first token, starting with replacement value 0
//makeIP(tokens, 0, 0);

module.exports = function makeIP (tokens, index, nextValue, end) {
    //exports.makeIp = function (tokens, index, nextValue) {
    // if the index has not advanced past the last token, we need to
    // evaluate if it should change
    //var tokens = start.split('.');
    if (index < tokens.length) {
        // if the token is % we need to replace it
        if (tokens[index] === '%') {
            // while the nextValue is less than our max, we want to keep making ips
            while (nextValue < tokenLimit) {
                if (tokens.join('.') != end) {
                    // slice the tokens array to get a new array that will not change the original
                    let newTokens = tokens.slice(0);
                    // change the token to a real value
                    newTokens[index] = nextValue++;

                    // move on to the next token
                    makeIP(newTokens, index + 1, 0);
                }
            }
        } else {
            // the token was not %, move on to the next token
            makeIP(tokens, index + 1, 0);
        }
    } else {
        
        list.push(tokens.join('.'))

    }
    return list;

}