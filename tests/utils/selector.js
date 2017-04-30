const {Selector} = require('testcafe');

module.exports = function() {
    return Selector(...arguments).addCustomDOMProperties({
        outerHTML: el => el.outerHTML
    });
};