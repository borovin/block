define(function(require) {
    //requirements
    var amdLoader = require('bower_components/amd-loader/amd-loader');

    var _ = require('bower_components/lodash/lodash');

    return amdLoader('tpl', function(name, source, req, callback, errback, config) {

        var options = {
            variable: 'block'
        };

        var content = 'define(function(require){return ' + _.template(source, options) + '})';

        callback(content);
    });
});