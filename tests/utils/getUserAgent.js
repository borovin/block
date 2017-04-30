const {ClientFunction} = require('testcafe');
const parse = require('user-agent-parser');

const getUserAgent = ClientFunction(() => window.navigator.userAgent);

module.exports = async function () {
    const uaString = await getUserAgent();
    return parse(uaString);
};