define(function(require, exports, module) {
    //requirements
    var get = require('bower_components/get/get'),
        deepExtend = require('bower_components/deepExtend/deepExtend'),
        makeClass = require('bower_components/makeClass/makeClass'),

        Backbone = require('bower_components/backbone/backbone'),
        _ = require('bower_components/lodash/dist/lodash'),
        $ = require('jquery');

    var View = Backbone.View;

    return makeClass(View, {

        constructor: function() {

            var block = this;

            var initialize = block.initialize,
                render = block.render;

            block.initialize = function(data) {

                block.stopListening();

                if (data) {
                    deepExtend(block, data);
                }

                block._ensureElement();

                return $.when(initialize.apply(block, arguments)).then(function() {
                    block.render();
                });
            };

            block.render = function(data) {

                if (data){
                    deepExtend(block, data);
                }

                return render.apply(block, arguments);
            };

            block.cid = _.uniqueId('block');

            block.initialize.apply(this, arguments);

            block.delegateGlobalEvents();
        },

        globalEvents: {},
        events: {},

        Blocks: {},
        blocks: {},

        Models: {},
        models: {},

        Collections: {},
        collections: {},

        Model: function(){},
        Collection: function(){},

        initialize: function(){

            var block = this;

            block.initCollections();
            block.initModels();
        },

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

        set: function(data) {

            var block = this;

            deepExtend(block, data);

            block.trigger('set', data);
        },

        initBlocks: function() {

            var block = this,
                $blocks = block.$('[block]');

            block.removeBlocks();

            $blocks.each(function() {
                var placeholder = this,
                    blockName = placeholder.getAttribute('block'),
                    params = _.extend({}, placeholder.dataset, {el: placeholder});

                var __block = block.Blocks[blockName](params);

                if (__block && __block.el){
                    __block.el.removeAttribute('block');
                }

                block.blocks[blockName] = block.blocks[blockName] || [];

                block.blocks[blockName].push(__block);

            });
        },

        initModels: function(){

            var block = this;

            block.models = _.mapValues(block.Models, function(constructor){
                return constructor();
            });

            block.model = block.Model();
        },

        initCollections: function(){

            var block = this;

            block.collections = _.mapValues(block.Collections, function(constructor){
                return constructor();
            });

            block.collection = block.Collection();
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

            _.each(block.blocks, function(blockList, blockName) {

                _.each(blockList, function(blockToRemove) {
                    if (blockToRemove && typeof blockToRemove.remove === 'function') {
                        blockToRemove.remove();
                    }
                });

                block.blocks[blockName] = [];

            });
        },

        trigger: function(event, data) {

            var block = this;

            block.$el.trigger(event, data);

            return View.prototype.trigger.apply(block, arguments);
        },

        delegateGlobalEvents: function() {

            var block = this;

            $(document).off('.' + block.cid);

            _.each(block.globalEvents, function(handler, eventName) {
                $(document).on(eventName + '.' + block.cid, handler.bind(block));
            });
        }
    });
});