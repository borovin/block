define(function(require, exports, module) {
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

        constructor: function() {

            var block = this;

            var initialize = block.initialize,
                render = block.render;

            block.initialize = function(data) {

                block.stopListening();

                deepExtend(block, data);

                block._ensureElement();

                block.initCollections();
                block.initModels();

                return $.when(initialize.apply(block, arguments)).then(function() {
                    block.render();
                });
            };

            block.render = function(data) {

                deepExtend(block, data);

                return render.apply(block, arguments);
            };

            block.cid = _.uniqueId('block');

            block.initialize.apply(this, arguments);

            block.delegateGlobalEvents();
        },

        globalEvents: {},
        events: {},
        defaults: {},
        children: {},

        render: function() {

            var block = this;

            if (!block.template) {
                block.delegateEvents();
                return;
            }

            block.setElement($(block.get('template', [block])).replaceAll(block.el));

            block.initBlocks();

            block.el.block = block;

        },

        get: function() {

            var block = this,
                args = [block].concat([].slice.call(arguments));

            return get.apply(null, args);
        },

        set: function() {

            var block = this,
                args = [block].concat([].slice.call(arguments)),
                __set = set.apply(null, args);

            block.trigger('set', __set);

            return __set;
        },

        initBlocks: function() {

            var block = this,
                $blocks = block.$('[block]');

            block.removeBlocks();

            $blocks.each(function() {
                var placeholder = this,
                    blockName = placeholder.getAttribute('block'),
                    params = _.extend({}, placeholder.dataset, {
                        el: placeholder,
                        parentBlock: block
                    });

                var __block = block.blocks[blockName].call(block, params);

                if (__block && __block.el) {
                    __block.el.removeAttribute('block');
                }

                block.children[blockName] = block.children[blockName] || [];

                block.children[blockName].push(__block);

            });
        },

        initModels: function() {

            var block = this;

            block.models = _.mapValues(block.models, function(constructor, modelName) {
                return block.get('models.' + modelName);
            });

            block.model = block.get('model');
        },

        initCollections: function() {

            var block = this;

            block.collections = _.mapValues(block.collections, function(constructor, collectionName) {
                return block.get('collections.' + collectionName);
            });

            block.collection = block.get('collection');
        },

        remove: function() {

            var block = this;

            block.stopListening();
            block.undelegateEvents();
            $(document).off('.' + block.cid);

            block.removeBlocks();

            return View.prototype.remove.apply(block, arguments);
        },

        removeBlocks: function() {

            var block = this;

            _.each(block.children, function(blockList) {

                _.each(blockList, function(blockToRemove) {
                    if (blockToRemove && typeof blockToRemove.remove === 'function') {
                        blockToRemove.remove();
                    }
                });

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

                if (path.length){
                    $(document).on(eventName + '.' + block.cid, path.join(' '), handler.bind(block));
                } else {
                    $(document).on(eventName + '.' + block.cid, handler.bind(block));
                }

            });
        }
    });
});
