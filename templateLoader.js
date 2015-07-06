define(function(require) {

    var _ = require('bower_components/lodash/lodash.js');

    return {
        translate: function(load) {

            var options = {
                variable: 'params'
            };

            return 'define(function(require){return ' + _.template(load.source, options) + '})';
        }
    }

});