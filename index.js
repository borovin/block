var get = require('get');
var set = require('set');
var createClass = require('createClass/index');
var _ = require('lodash');
var $ = require('jquery');
var Events = require('ampersand-events');
var includes = require('./utils/includes');
var morph = require('./utils/morph');

module.exports = createClass(function (config) {

    var block = this;

    block.cid = _.uniqueId('block-');

    set(block, config);

    block.el = $(block.get('el'))[0];

    //TODO: remove initialized block from element if exists and replace its children to the new block

    block.initialize();
    block.render();

}, Events, {

    el: '<div></div>',

    template: null,

    children: [],

    initialize: function () {
    },

    render: function (data) {

        var block = this;

        var changes = data ? block.set(data) : null;

        if (!data || changes) {
            block.el = morph(block.el, _.trim(block.get('template')));
            block._initChildren();
        }

        block.el.block = block;

        block.startListening();

    },

    include: function (constructor, config) {

        var includeItem;
        var includeId;

        if (typeof constructor === 'string') {
            includeItem = _.template.call(this, constructor)(config);
        }

        if (typeof constructor === 'function') {

            includeId = _.uniqueId('include-');

            includes[includeId] = {
                constructor: constructor,
                config: config || {}
            };

            includeItem = '<include id="' + includeId + '"></include>';
        }

        return includeItem;
    },

    get: function (path) {

        var block = this;

        return get(block, path);
    },

    set: function () {

        var block = this;
        var args = [block].concat([].slice.call(arguments));
        var changes = set.apply(null, args);

        if (changes) {
            block._triggerChanges(changes);
        }

        return changes;
    },

    _initChildren: function () {

        var block = this;
        var childElements = block.el.querySelectorAll('include');

        _.forEach(childElements, function (childElement) {

            var includeId = childElement.id;
            var include = includes[includeId];

            include.config.el = childElement;

            block.initChild(include.constructor, include.config);

            delete includes[includeId];

        });
    },

    initChild: function (Child, config) {

        var block = this;
        var child;

        if (typeof Child === 'function') {
            child = new Child(config);
        }

        child.parent = block;
        block.children.push(child);

        return child;
    },

    /**
     * Removes block and all it's children. Clear all event listeners.
     */
    remove: function () {

        var block = this;

        block.stopListening();
        block.removeChildren();

        _.remove(block.get('parent.children'), function (child) {
            return child === block;
        });

        $(block.el).remove();
    },

    removeChildren: function () {

        var block = this;
        var children = block.children;

        block.children = [];

        _.forEach(children, function (child) {
            child.remove();
        });
    },

    trigger: function () {

        var block = this;
        var $el = $(block.el);

        $el.trigger.apply($el, arguments);
        block.trigger.apply(block, arguments);
    },

    startListening: function () {

        var block = this;

        block.stopListening();

        _.forEach(block.get('events'), function (handler, eventKey) {

            var keyParts = eventKey.split(' ');
            var eventName = keyParts.shift();
            var selector = keyParts.join(' ') || '*';

            $(block.el).on(eventName, selector, handler.bind(block));
        });

        _.forEach(block.get('globalEvents'), function (handler, eventKey) {

            var keyParts = eventKey.split(' ');
            var eventName = keyParts.shift();
            var selector = keyParts.join(' ') || '*';

            $(document).on(eventName + '.' + block.cid, selector, handler.bind(block));

        });

    },

    stopListening: function () {

        var block = this;

        Events.stopListening.call(block);

        if (block.el) {
            $(document).off('.' + block.cid);
            $(block.el).off();
        }
    },

    _triggerChanges: function (path, data) {

        var block = this;

        if (_.isPlainObject(path)) {
            data = path;
            path = null;
        }

        if (_.isPlainObject(data)) {
            _.forEach(data, function (dataItem, key) {
                block._triggerChanges(path ? (path + '.' + key) : key, dataItem);
            });
        }

        block.trigger(path ? ('change:' + path) : 'change', data);
    }
});
