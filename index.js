var get = require('bower_components/get/index.js'),
    set = require('bower_components/set/index.js'),
    createClass = require('bower_components/createClass/index.js'),
    backbone = require('bower_components/backbone/backbone.js'),
    _ = require('bower_components/lodash/lodash.js'),
    $ = require('bower_components/jquery/dist/jquery.js');

var View = backbone.View;

module.exports = createClass(View, {

    constructor: function(config) {

        var block = this;

        block.cid = _.uniqueId('block');

        set(block, block.defaults, config);

        block._initElement();

        block.trigger('initializing');

        $.when(block.initialize.apply(block, arguments)).then(function() {
            block.render();
            block._delegateGlobalEvents();
            block.trigger('initialized');
        });
    },

    el: '<div></div>',
    globalEvents: {},
    events: {},
    defaults: {},
    template: null,

    _children: {},

    render: function(data) {

        if (_.isPlainObject(data)){
            this.set(data);
        }

        var block = this,
            attrs = _.extend({}, block.get('attributes')),
            id = block.get('id'),
            $oldEl = block.$el;

        block.undelegateEvents();
        block._removeBlocks();

        if (id) {
            attrs.id = id;
        }

        if (block.template) {
            $oldEl.replaceWith(block._initElement(block.template()));
        }

        block.$el
            .attr(attrs)
            .addClass(block.get('className'));

        block.el.block = block;

        block.delegateEvents();
        block._initBlocks();

    },

    get: function() {

        var block = this,
            args = [block].concat([].slice.call(arguments));

        return get.apply(null, args);
    },

    set: function() {

        var block = this,
            args = [block].concat([].slice.call(arguments)),
            changed = set.apply(null, args);

        var triggerChanges = function(path, data) {

            if (_.isPlainObject(data)) {
                _.forEach(data, function(data, key) {
                    triggerChanges(path ? (path + '.' + key) : key, data);
                });
            }

            block.trigger(path ? ('change:' + path) : 'change', data);
        };

        triggerChanges('', changed);

        return changed;
    },

    include: function(constructor, params) {

        var block = this,
            include;

        switch (typeof constructor) {
            case 'function':
                include = constructor.call(block, params);
                break;
            case 'string':
                include = _.template(constructor)(params);
                break;
            default:
                include = constructor;
        }

        if (include.el && include.cid) {
            block.initBlock(include);
            include = '<' + include.el.tagName + ' block-cid="' + include.cid + '"></' + include.el.tagName + '>';
        }

        return include;
    },

    initBlock: function(Child, params) {

        var block = this;

        if (typeof Child === 'function') {
            Child = new Child(params);
        }

        Child.parent = block;
        block._children[Child.cid] = Child;

        return Child;
    },

    remove: function() {

        var block = this;

        block.stopListening();
        block.undelegateEvents();
        $(document).off('.' + block.cid);

        block._removeBlocks();

        if (block.parent){
            delete block.parent[block.cid];
        }

        View.prototype.remove.apply(block, arguments);
    },

    trigger: function(event) {

        var block = this;

        block.$el.trigger(event, [].slice.call(arguments, 1));

        return View.prototype.trigger.apply(block, arguments);
    },

    _initBlocks: function() {

        var block = this,
            $blocks = block.$('[block-cid]');

        $blocks.each(function() {

            var placeholder = this,
                blockCid = placeholder.getAttribute('block-cid'),
                child = block._children[blockCid];

            $(placeholder).replaceWith(child.el);

        });
    },

    _removeBlocks: function() {

        var block = this;

        _.each(block._children, function(blockToRemove) {

            if (blockToRemove && typeof blockToRemove.remove === 'function') {
                blockToRemove.remove();
            }

        });

        block._children = {};
    },

    _initElement: function(el) {

        this.el = $(el || this.get('el'))[0];
        this.$el = $(this.el);

        return this.el;

    },

    _delegateGlobalEvents: function() {

        var block = this;

        $(document).off('.' + block.cid);

        _.each(block.globalEvents, function(handler, event) {
            var path = event.split(' '),
                eventName = path.shift();

            if (path.length) {
                $(document).on(eventName + '.' + block.cid, path.join(' '), handler.bind(block));
            } else {
                $(document).on(eventName + '.' + block.cid, handler.bind(block));
            }

        });
    }
});