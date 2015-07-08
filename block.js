define(function(require) {
    //requirements
    var get = require('bower_components/get/get.js'),
        set = require('bower_components/set/set.js'),
        deepExtend = require('bower_components/deepExtend/deepExtend.js'),
        createClass = require('bower_components/createClass/createClass.js'),
        Backbone = require('bower_components/backbone/backbone.js'),
        _ = require('bower_components/lodash/lodash.js'),
        $ = require('jquery');

    var View = Backbone.View;

    /**
     * расширенный класс Backbone.View
     * @class Block
     * @param {Object} opt block options
     * @param {String | HTMLElement} opt.el элемент к которому будет привязан блок
     * @param {Function} opt.template шаблон, который будет использован для формирования DOM элемента блока
     */
    return createClass(View, {

        constructor: function() {

            var block = this;

            var initialize = block.initialize;

            block.cid = _.uniqueId('block');

            block.initialize = function(data) {

                block.stopListening();

                deepExtend(block, block.defaults, data);

                block.initCollections();
                block.initModels();

                block._ensureElement();

                block.trigger('initializing');

                return $.when(initialize.apply(block, arguments)).then(function() {

                    block.render();

                    block.startListening();

                    block.trigger('initialized');
                });
            };

            block.initialize.apply(this, arguments);

            block.delegateGlobalEvents();
        },

        globalEvents: {},
        listeners: {},
        events: {},
        defaults: {},
        children: {},
        template: null,

        render: function() {

            var block = this,
                attrs = _.extend({}, block.get('attributes')),
                id = block.get('id'),
                $el = block.$el;

            block.removeBlocks();

            if (id) {
                attrs.id = id
            }

            if (block.template) {
                block.setElement(block.template());
                $el && $el.replaceWith(block.el);
                block.$el
                    .attr(attrs)
                    .addClass(block.get('className'));
            }

            block.el.block = block;

            block.initBlocks();
        },

        initCollections: function() {

            var block = this;

            block.collections = _.mapValues(block.collections, function(constructor, collectionName) {
                return block.get('collections.' + collectionName);
            });

            block.collection = block.get('collection');
        },

        initModels: function() {

            var block = this;

            block.models = _.mapValues(block.models, function(constructor, modelName) {
                return block.get('models.' + modelName);
            });

            block.model = block.get('model');
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
                childBlock,
                include;

            if (constructor.extend || typeof constructor === 'object') {
                childBlock = block.initBlock(constructor, params);
                include = '<' + childBlock.el.tagName + ' block-cid="' + childBlock.cid + '"></' + childBlock.el.tagName + '>';
            } else if (typeof constructor === 'function') {
                include = constructor.call(block, params);
            } else if (typeof constructor === 'string') {
                include = constructor;
            }

            return include;
        },

        initBlocks: function() {

            var block = this,
                $blocks = block.$('[block-cid]');

            $blocks.each(function() {

                var placeholder = this,
                    blockCid = placeholder.getAttribute('block-cid'),
                    child = block.children[blockCid];

                $(placeholder).replaceWith(child.el);

            });
        },

        initBlock: function(constructor, params) {

            var block = this,
                child = constructor;

            if (typeof constructor === 'function'){
                child = new constructor(params);
            }

            child.parent = block;
            block.children[child.cid] = child;

            return child;
        },

        remove: function() {

            var block = this;

            block.stopListening();
            block.undelegateEvents();
            $(document).off('.' + block.cid);

            block.removeBlocks();

            block.parent && delete block.parent[block.cid];

            View.prototype.remove.apply(block, arguments);
        },

        removeBlocks: function() {

            var block = this;

            _.each(block.children, function(blockToRemove) {

                if (blockToRemove && typeof blockToRemove.remove === 'function') {
                    blockToRemove.remove();
                }

            });

            block.children = {};
        },

        trigger: function(event, data) {

            var block = this;

            block.$el.trigger(event, data);

            return View.prototype.trigger.apply(block, arguments);
        },

        delegateGlobalEvents: function() {

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
        },

        startListening: function() {

            var block = this,
                listeners = block.get('listeners');

            _.forEach(listeners, function(listener, path) {

                var normalizedListener;

                if (_.isPlainObject(listener)) {

                    normalizedListener = _.mapValues(listener, function(value) {

                        if (typeof value === 'string') {
                            return function() {
                                block[value].apply(block, arguments);
                            }
                        } else {
                            return value;
                        }
                    });

                    block.get(path) && block.listenTo(block.get(path), normalizedListener);

                } else {

                    if (typeof listener === 'string') {
                        normalizedListener = function() {
                            block[listener].apply(block, arguments);
                        };
                    } else {
                        normalizedListener = listener;
                    }

                    block.listenTo(block, path, normalizedListener);

                }

            });
        }
    });
});
