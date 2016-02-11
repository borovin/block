var _ = require('lodash');

module.exports = {
    translate: function (load) {

        var compiledString;

        try {
            compiledString = _.template(load.source, {
                variable: 'params'
            });
        } catch (err) {
            compiledString = _.template('Template error');
            setTimeout(function () {
                throw new Error('Error loading ' + load.address + '. ' + err.message);
            }, 0);
        }

        return 'module.exports = ' + compiledString.source;
    }
};
