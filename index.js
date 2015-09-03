var get = require('bower_components/get/index.js'),
    set = require('bower_components/set/index.js'),
    createClass = require('bower_components/createClass/index.js'),
    backbone = require('bower_components/backbone/backbone.js'),
    _ = require('bower_components/lodash/lodash.js'),
    $ = require('bower_components/jquery/dist/jquery.js');

var View = backbone.View;

/**
 * Extended Backbone View
 *
 * You can extend any Block class by static Block.extend method. This method set all passed properties to new block prototype using
 * deep merge method.
 *
 * ```
 * var SomeBlock = Block.extend({a: {b: 1}}, {a: {c: 2}});
 *
 * var someBlock = new SomeBlock();
 *
 * someBlock.a.b === 1;
 * someBlock.a.c === 2;
 * ```
 *
 * @module block
 */

module.exports = createClass(View, {

    /**
     * Block can be initialized as regular function without new keyword.
     *
     * ```
     * var block = Block(config);
     * ```
     *
     * All config properties passed to constructor will be set on block instance using deep merge algorithm.
     *
     * ```
     * var SomeBlock = Block.extend({a: {b: 1}});
     * var someBlock = new SomeBlock({a: {c: 2}});
     * someBlock.a.b === 1;
     * someBlock.a.c === 2;
     * ```
     *
     * @constructor Block
     * @param {object} config all properties from this config-object will be set on block instance
     */
    constructor: function(config) {

        var block = this;

        block.cid = _.uniqueId('block');

        set(block, config);

        block._initElement();

        /**
         * initializing event triggers before initialize and render methods
         *
         * ```
         * block.on('initializing', function(block){});
         * ```
         *
         * @event initializing
         * @property {object} block block instance where the event was appeared
         */
        block.trigger('initializing', block);

        $.when(block.initialize.apply(block, arguments)).then(function() {
            block.render();
            block._delegateGlobalEvents();

            /**
             * initialized event triggers after initialize and render methods
             *
             * ```
             * block.on('initialized', function(block){});
             * ```
             *
             * @event initialized
             * @property {object} block block instance where the event was appeared
             */
            block.trigger('initialized', block);
        });
    },

    /**
     * Block element for initialization. It will be replaced with block.template during render process.
     * May be an existing DOM element or css selector.
     *
     * ```
     * new Block({
     *  el: '.page'
     * });
     *
     * new Block({
     *  el: document.getElementById('page')
     * });
     * ```
     *
     * @type {HTMLElement|selector|string|function}
     */
    el: '<div></div>',

    /**
     * Same as Backbone.View events. Delegate event listeners to block.el.
     *
     * ```
     * var SomeBlock = Block.extend({
     *      events: {
     *          'initialized .childBlock': function(e, childBlock){}
     *      }
     * });
     * ```
     *
     * @type {object}
     */
    events: {},

    /**
     * Same as events, but delegated to document. By global events independent block (not parent->child) can listen events from each other.
     *
     * ```
     * var SomeBlock = Block.extend({
     *      globalEvents: {
     *          'initialized .otherBlock': function(e, otherBlock){}
     *      }
     * });
     * ```
     *
     * @type {object}
     */
    globalEvents: {},

    /**
     * Result of template function will replace block.el during render process.
     * You can use any template engine. All block properties are available throw this context inside template function.
     *
     * ```
     * var SomeBlock = Block.extend({
     *      template: function(){
     *          return '<div>' + this.anyProperty + '</div>'
     *      }
     * });
     * ```
     *
     * @type {string|function}
     */
    template: null,

    /**
     * Map (or function that returns map) of html attributes which will be added to block.el during render process.
     *
     * ```
     * var block = new Block({
     *      project: 'reltio',
     *      attributes: function(){
     *          return {
     *              href: 'http://' + this.project + '.com',
     *              title: this.project + ' web site'
     *          }
     *      }
     * });
     * ```
     *
     * @type {function|object}
     */
    attributes: {},

    /**
     * String (or function that return string) which will be added to block.el class during render process.
     *
     * ```
     * var block = new Block({
     *      status: 'active',
     *      className: function(){
     *          return 'listItem ' + this.status;
     *      }
     * })
     * ```
     *
     * @type {function|string}
     */
    className: '',

    /**
     * String (or function that return string) which will be set as block.el id during render process.
     *
     * @type {function|string}
     */
    id: null,

    _children: {},

    /**
     * Render method set new data on block instance and invoke template function if it is defined. Current block
     *
     * @param {object} data data which will be set to block instance before rendering. So you can get it in template throw this context.
     * @returns {object} block instance for chaining
     */
    render: function(data) {

        if (_.isPlainObject(data)){
            this.set(data);
        }

        var block = this,
            attrs = _.extend({}, block.get('attributes')),
            id = block.get('id'),
            $oldEl = block.$el;

        if (id) {
            attrs.id = id;
        }

        if (block.template) {
            $oldEl.replaceWith(block._initElement(block.get('template')));
        }

        block.$el
            .attr(attrs)
            .addClass(block.get('className'));

        return block;
    },

    /**
     * You can get any block property by keypath. If one of the property is undefined get method return undefined (not error).
     * If one of the property is function it will be executed in block context and return the result to get method.
     *
     * ```
     * var block = new Block({
     *      text: 'string',
     *      a: {
     *          b: 2,
     *          c: function(){ return this.text; }
     *      }
     * });
     *
     * block.get('a.b') // -> 2
     * block.get('a.c') // -> 'string'
     * block.get('a.b.c.d') // -> undefined
     * ```
     *
     * @returns {value|undefined}
     */
    get: function() {

        var block = this,
            args = [block].concat([].slice.call(arguments));

        return get.apply(null, args);
    },

    /**
     * Update or create property by keypath. If some property in this path does not exist it will be created automatically.
     * `set` method return only changed properties. All changed properties trigger change:propertyKeyPath event.
     *
     * ```
     * var block = new Block({
     *      a: {
     *          b: 1
     *      }
     * });
     *
     * block.on('change:a.b', function(e, newValue){
     *      console.log(newValue) // -> 2
     * });
     *
     * block.on('change:a', function(e, newValue){
     *      console.log(newValue) // -> {b: 2}
     * });
     *
     * block.set('a.b', 2);
     * ```
     *
     * @returns {object|undefined}
     */
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

    /**
     * `include` method is proper way to decompose block into sub-blocks in template. It will automatically initialize and remove all nested
     * blocks during render process to avoid memory leaks.
     *
     * ```
     * var block = new Block({
     *      template: function() {
     *          return '<div>' + this.include(childBlock, {text: 'child'}) + '</div>'
     *      }
     * });
     * ```
     *
     * @param constructor
     * @param params
     * @returns {string}
     */
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

    /**
     * If you need to initialize child block manually (not inside template) you can use this method.
     * All child blocks will be properly removed when you remove parent block to avoid memory leaks.
     *
     * ```
     * var parentBlock = new Block();
     * var childBlock = parentBlock.initBlock(Block, {text: 'child'});
     * parentBlock.remove();
     * ```
     *
     * @param Child
     * @param params
     * @returns {childBlock}
     */
    initBlock: function(Child, params) {

        var block = this;

        if (typeof Child === 'function') {
            Child = new Child(params);
        }

        Child.parent = block;
        block._children[Child.cid] = Child;

        return Child;
    },

    /**
     * Removes block and all it's children. Clear all event listeners.
     */
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

    /**
     * Trigger event with any data as event properties. Event will be triggered by block instance and block.el as well.
     *
     * ```
     * var block = new Block();
     *
     * block.on('someEvent', function(data){});
     * block.$el.on('someEvent', function(e, data){});
     *
     * block.trigger('someEvent');
     * ```
     *
     * @param event
     * @param data
     */
    trigger: function(event, data) {

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

        var block = this;

        block.undelegateEvents();
        block._removeBlocks();

        block.el = $(el || block.get('el'))[0];
        block.$el = $(block.el);
        block.el.block = block;

        block.delegateEvents();
        block._initBlocks();

        return block.el;

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