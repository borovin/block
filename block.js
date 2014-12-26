define(function(require, exports, module) {
    //requirements
    var get = require('bower_components/get/get'),
        deepExtend = require('bower_components/deepExtend/deepExtend'),
        makeClass = require('bower_components/makeClass/makeClass'),

        Backbone = require('bower_components/backbone/backbone'),
        rivets = require('bower_components/rivets/dist/rivets.bundled.min'),
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

        bindings: null,
        globalEvents: {},
        events: {},

        render: function() {

            var block = this;

            if (!block.template) {
                this.delegateEvents();
                return;
            }

            if (block.bindings){
                block.bindings.unbind();
            }

            block.setElement($(block.get('template', [block])).replaceAll(block.el));

            block.bindings = rivets.bind(block.el, block);

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

            block.__blocks = block.__blocks || _.clone(block.blocks);

            block.removeBlocks();

            $blocks.each(function() {
                var placeholder = this,
                    blockName = placeholder.getAttribute('block'),
                    params = _.extend({}, placeholder.dataset, {el: placeholder});

                var __block = block.__blocks[blockName](params);

                if (__block && __block.el){
                    __block.el.removeAttribute('block');
                }

                block.blocks[blockName].push(__block);

            });
        },

        remove: function() {

            var block = this;

            block.stopListening();
            block.undelegateEvents();
            $(document).off('.' + block.cid);

            if (block.bindings){
                block.bindings.unbind();
            }

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