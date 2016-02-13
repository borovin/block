var get = require('get');
var set = require('set');
var createClass = require('createClass/index');
var _ = require('lodash');
var $ = require('jquery');
var Events = require('ampersand-events');
var includes = require('./utils/includes');
var morph = require('./utils/morph');

module.exports = createClass(function (config) {

    var view = this;

    view.cid = _.uniqueId('view-');

    set(view, config);

    view.el = $(view.get('el'))[0];

    view.initialize();
    view.render();

}, Events, {

    el: '<div></div>',

    template: null,

    children: [],

    initialize: function () {
    },

    render: function (data) {

        var view = this;
        var prevView = view.el.view;

        var changes = data ? view.set(data) : null;

        if (!data || changes) {
            view.el = morph(view.el, _.trim(view.get('template')));
            view._initChildren();
        }

        view.el.view = view;

        if (prevView && prevView !== view) {
            _.forEach(prevView.children, function (child) {
                view.initChild(child);
            });

            prevView.stopListening();
        }

        view.startListening();

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

        var view = this;

        return get(view, path);
    },

    set: function () {

        var view = this;
        var args = [view].concat([].slice.call(arguments));
        var changes = set.apply(null, args);

        if (changes) {
            view._triggerChanges(changes);
        }

        return changes;
    },

    _initChildren: function () {

        var view = this;
        var childElements = view.el.querySelectorAll('include');

        _.forEach(childElements, function (childElement) {

            var includeId = childElement.id;
            var include = includes[includeId];

            include.config.el = childElement;

            view.initChild(include.constructor, include.config);

            delete includes[includeId];

        });
    },

    initChild: function (Child, config) {

        var view = this;
        var child;

        if (typeof Child === 'function') {
            child = new Child(config);
        }

        child.parent = view;
        view.children.push(child);

        return child;
    },

    /**
     * Removes block and all it's children. Clear all event listeners.
     */
    remove: function () {

        var view = this;

        view.stopListening();
        view.removeChildren();

        _.remove(view.get('parent.children'), function (child) {
            return child === view;
        });

        $(view.el).remove();
    },

    removeChildren: function () {

        var view = this;
        var children = view.children;

        view.children = [];

        _.forEach(children, function (child) {
            child.remove();
        });
    },

    trigger: function () {

        var view = this;
        var $el = $(view.el);

        $el.trigger.apply($el, arguments);
        view.trigger.apply(view, arguments);
    },

    startListening: function () {

        var view = this;

        view.stopListening();

        _.forEach(view.get('events'), function (handler, eventKey) {

            var keyParts = eventKey.split(' ');
            var eventName = keyParts.shift();
            var selector = keyParts.join(' ') || '*';

            $(view.el).on(eventName, selector, handler.bind(view));
        });

        _.forEach(view.get('globalEvents'), function (handler, eventKey) {

            var keyParts = eventKey.split(' ');
            var eventName = keyParts.shift();
            var selector = keyParts.join(' ') || '*';

            $(document).on(eventName + '.' + view.cid, selector, handler.bind(view));

        });

    },

    stopListening: function () {

        var view = this;

        Events.stopListening.call(view);

        if (view.el) {
            $(document).off('.' + view.cid);
            $(view.el).off();
        }
    },

    _triggerChanges: function (path, data) {

        var view = this;

        if (_.isPlainObject(path)) {
            data = path;
            path = null;
        }

        if (_.isPlainObject(data)) {
            _.forEach(data, function (dataItem, key) {
                view.triggerChanges(path ? (path + '.' + key) : key, dataItem);
            });
        }

        view.trigger(path ? ('change:' + path) : 'change', data);
    }
});
