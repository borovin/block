define(function (require, exports, module) {
    //requirements
    var get = require('bower_components/get/get'),
        set = require('bower_components/set/set'),
        deepExtend = require('bower_components/deepExtend/deepExtend'),
        makeClass = require('bower_components/makeClass/makeClass'),

        Backbone = require('bower_components/backbone/backbone'),
        _ = require('bower_components/lodash/lodash'),
        $ = require('jquery');

    var View = Backbone.View;

    return makeClass(View, {

        constructor: function () {

            var block = this;

            var initialize = block.initialize,
                render = block.render;

            block.cid = _.uniqueId('block');

            block.initialize = function (data) {

                block.stopListening();

                deepExtend(block, block.defaults, data);

                block.initCollections();
                block.initModels();

                block._ensureElement();

                block.trigger('initializing');

                return $.when(initialize.apply(block, arguments)).then(function () {

                    block.render();

                    block.startListening();

                    block.trigger('initialized');
                });
            };

            block.render = function (data) {

                deepExtend(block, data);

                return render.apply(block, arguments);
            };

            block.initialize.apply(this, arguments);

            block.delegateGlobalEvents();
        },

        globalEvents: {},
        listeners: {},
        events: {},
        defaults: {},
        children: {},

        render: function () {

            var block = this,
                id = block.get('id');

            block.removeBlocks();

            if (block.template) {
                block.setElement($(block.template(block)).replaceAll(block.el));
            }

            if (id) {
                block.el.id = id;
            }

            block.initBlocks();

            block.el.block = block;

        },

        initCollections: function () {

            var block = this;

            block.collections = _.mapValues(block.collections, function (constructor, collectionName) {
                return block.get('collections.' + collectionName);
            });

            block.collection = block.get('collection');
        },

        initModels: function () {

            var block = this;

            block.models = _.mapValues(block.models, function (constructor, modelName) {
                return block.get('models.' + modelName);
            });

            block.model = block.get('model');
        },

        get: function () {

            var block = this,
                args = [block].concat([].slice.call(arguments));

            return get.apply(null, args);
        },

        set: function () {

            var block = this,
                args = [block].concat([].slice.call(arguments)),
                __set = set.apply(null, args);

            block.trigger('set', __set);

            return __set;
        },

        include: function (constructor, params) {

            var block = this,
                include = block.initBlock(constructor, params);

            return '<' + include.el.tagName + ' block-cid="' + include.cid + '"></' + include.el.tagName + '>';
        },

        initBlocks: function () {

            var block = this,
                $blocks = block.$('[block-cid]');

            $blocks.each(function () {

                var placeholder = this,
                    blockCid = placeholder.getAttribute('block-cid'),
                    child = block.children[blockCid];

                $(placeholder).replaceWith(child.el);

            });
        },

        initBlock: function (constructor, params) {

            var block = this,
                child = constructor.call(block, _.extend({}, params, {
                    parentBlock: block
                }));

            block.children[child.cid] = child;

            return child;
        },

        remove: function () {

            var block = this;

            block.stopListening();
            block.undelegateEvents();
            $(document).off('.' + block.cid);

            block.removeBlocks();

            View.prototype.remove.apply(block, arguments);
        },

        removeBlocks: function () {

            var block = this;

            _.each(block.children, function (blockToRemove) {

                if (blockToRemove && typeof blockToRemove.remove === 'function') {
                    blockToRemove.remove();
                }

            });

            block.children = {};
        },

        trigger: function (event, data) {

            var block = this;

            block.$el.trigger(event, data);

            return View.prototype.trigger.apply(block, arguments);
        },

        delegateGlobalEvents: function () {

            var block = this;

            $(document).off('.' + block.cid);

            _.each(block.globalEvents, function (handler, event) {
                var path = event.split(' '),
                    eventName = path.shift();

                if (path.length) {
                    $(document).on(eventName + '.' + block.cid, path.join(' '), handler.bind(block));
                } else {
                    $(document).on(eventName + '.' + block.cid, handler.bind(block));
                }

            });
        },

        startListening: function () {

            var block = this,
                listeners = block.get('listeners');

            _.forEach(listeners, function (listener, path) {

                var normalizedListener = _.mapValues(listener, function (value) {

                    if (typeof value === 'string') {
                        return function () {
                            block[value].apply(block, arguments);
                        }
                    } else {
                        return value;
                    }
                });

                block.listenTo(block.get(path), normalizedListener);

            });
        }
    });
});
