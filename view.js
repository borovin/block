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

    _children: [],

    initialize: function () {
    },

    render: function (data) {

        var view = this;

        var changes = data ? view.set(data) : null;

        if (!data || changes) {
            view.el = morph(view.el, _.trim(view.get('template')));
            view._initChildren();
        }

        if (view.el.view && view.el.view !== view){
            _.forEach(view.el.view._children, function(child){
                view.initChild(child);
            });

            view.el.view.removeEvents();
        }

        view.el.view = view;

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
        view._children.push(child);

        return child;
    },

    /**
     * Removes block and all it's children. Clear all event listeners.
     */
    remove: function () {

        var view = this;

        view.removeEvents();
        view.removeChildren();

        _.remove(view.get('parent._children'), function (child) {
            return child === view;
        });

        $(view.el).remove();
    },

    removeChildren: function(){

        var view = this;
        var children = view._children;

        view._children = [];

        _.forEach(children, function (child) {
            child.remove();
        });
    },

    removeEvents: function(){

        var view = this;

        $(document).off('.' + view.cid);
        view.stopListening();
        $(view.el).off();
    },

    trigger: function (event) {

        var view = this;

        view.$el.trigger.apply(view.$el, arguments);
        view.trigger.apply(view, arguments);
    },

    _triggerChanges: function (path, data) {

        var view = this;

        if (_.isPlainObject(path)){
            data = path;
            path = null;
        }

        if (_.isPlainObject(data)) {
            _.forEach(data, function (data, key) {
                view.triggerChanges(path ? (path + '.' + key) : key, data);
            });
        }

        view.trigger(path ? ('change:' + path) : 'change', data);
    }
});
