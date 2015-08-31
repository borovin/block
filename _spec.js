// # Block specification

var Block = require('./index.js'),
    $ = require('./bower_components/jquery/dist/jquery.js');

describe(module.id, function() {

    afterEach(function() {
        document.body.innerHTML = '';
    });

    // ### Initialization process
    describe('initialization', function() {

        // You can pass option-object parameter to the constructor. All this options will be set directly on the block instance
        // as block properties and will be available throw this context
        it('Sets all initialization properties to block instance', function() {

            var block = new Block({
                number: 1,
                string: 'string1',
                bool: true,
                array: [1, 2, 3]
            });

            expect(block.number).toEqual(1);
            expect(block.string).toEqual('string1');
            expect(block.bool).toEqual(true);
            expect(block.array).toEqual([1, 2, 3]);
        });

        // Block can be initialized as regular function without new keyword. It is useful when you need to wrap block
        // constructor into anonymous function for some initialization purposes
        it('Can be initialized without new keyword', function() {

            var block = Block({
                a: 1
            });

            expect(block.a).toBe(1)
        });

        it('Should call initialize method from constructor', function() {

            spyOn(Block.prototype, 'initialize');

            new Block;

            expect(Block.prototype.initialize).toHaveBeenCalled();
        });

        // By default initialize method is empty. So you can override it with your own logic.
        it('Can override initialize method', function() {

            var Block1 = Block.extend({
                count: 0,
                initialize: function() {
                    this.count++;
                }
            });

            var block = new Block1({
                count: 10
            });

            expect(block.count).toEqual(11)
        });

        it('Should pass all initialization properties to initialize method', function() {

            var a, b, c;

            var SomeBlock = Block.extend({
                initialize: function(options, param1, param2){
                    a = options;
                    b = param1;
                    c = param2;
                }
            });

            new SomeBlock({a: 1}, 2, 'string');

            expect(a).toEqual({a: 1});
            expect(b).toEqual(2);
            expect(c).toEqual('string');
        });

        it('Should pass all plain object properties by values and does not affect another instances', function() {

            var plainObject = {
                a: 1
            };

            var block1 = new Block({
                plainObject: plainObject
            });

            var block2 = new Block({
                plainObject: plainObject
            });

            block1.plainObject.a = 2;

            expect(block2.plainObject.a).toEqual(1);
        });

        it('Should trigger initializing event before initialization', function() {

            document.body.innerHTML = '<div id="block"></div>';

            var a;

            var SomeBlock = Block.extend({
                a: 1,
                initialize: function(){
                    this.a = 2;
                }
            });

            $('#block').on('initializing', function(e){
                a = e.target.block.a;
            });

            new SomeBlock({
                el: '#block'
            });

            expect(a).toEqual(1);
        });

        it('Should trigger initialized event after initialization', function() {

            document.body.innerHTML = '<div id="block"></div>';

            var a;

            var SomeBlock = Block.extend({
                a: 1,
                initialize: function(){
                    this.a = 2;
                }
            });

            $('#block').on('initialized', function(e){
                a = e.target.block.a;
            });

            new SomeBlock({
                el: '#block'
            });

            expect(a).toEqual(2);

        });

        it('Can return promise from initialize method', function(done) {

            document.body.innerHTML = '<div id="block"></div>';

            $('#block').on('initialized', function() {
                done();
            });

            var Block1 = Block.extend({
                el: '#block',
                initialize: function() {

                    var deferred = $.Deferred();

                    setTimeout(function() {
                        deferred.resolve();
                    }, 100);

                    return deferred.promise();
                }
            });

            new Block1;

        });

    });

    // ### Extending Block class
    describe('extend method', function() {

        it('instanceof should work as expected', function() {

            var Block1 = Block.extend(),
                Block2 = Block1.extend();

            var block2 = new Block2;

            expect(block2 instanceof Block).toEqual(true);
            expect(block2 instanceof Block1).toEqual(true);
            expect(block2 instanceof Block2).toEqual(true);

        });

        it('extend method should copy all properties to prototype', function() {

            var Block1 = Block.extend({
                number: 1,
                string: 'string1',
                bool: true,
                array: [1, 2, 3]
            });

            var Block2 = Block1.extend({
                number: 2
            }, {
                string: 'string2'
            }, {
                bool: false
            }, {
                array: [3, 2, 1]
            });

            var block2 = new Block2;

            expect(block2.number).toEqual(2);
            expect(block2.string).toEqual('string2');
            expect(block2.bool).toEqual(false);
            expect(block2.array).toEqual([3, 2, 1]);
        });

        it('extend method should merge all nested properties by deep merge algorithm', function() {

            var Block1 = Block.extend({
                nested: {
                    a: 1,
                    b: 2
                }
            });

            var Block2 = Block1.extend({
                nested: {
                    a: 2,
                    c: 3
                }
            });

            var block2 = new Block2();

            expect(block2.nested).toEqual({
                a: 2,
                b: 2,
                c: 3
            });
        });

        it('extend method should copy plain object properties by values and does not affect other instances', function() {

            var plainObject = {
                a: 1
            };

            var Block1 = Block.extend({
                    plainObject: plainObject
                }),
                block1 = new Block1;

            var Block2 = Block.extend({
                    plainObject: plainObject
                }),
                block2 = new Block2;

            block1.plainObject.a = 2;

            expect(block2.plainObject.a).toEqual(1);
        });

        it('Should copy not plain object properties by link', function() {

            var Block1 = Block.extend(),
                block1 = new Block1;

            var Block2 = Block.extend({
                    block1: block1
                }),
                block2 = new Block2;

            expect(block2.block1).toEqual(block1);
        });

    });

    // ### Block el (element) property
    describe('el property', function() {

        it('el property should be empty div by default', function() {

            var block = new Block;

            expect(block.el.tagName).toEqual('DIV');
            expect(block.el.textContent).toEqual('');

        });

        it('el property can be html string', function() {

            var block = new Block({
                el: '<span>text</span>'
            });

            expect(block.el.tagName).toEqual('SPAN');
            expect(block.el.textContent).toEqual('text');
        });

        it('el property can be an existing html element', function() {

            var block = new Block({
                el: document.createElement('b')
            });

            expect(block.el.tagName).toEqual('B');
            expect(block.el.textContent).toEqual('');
        });

        it('el property can be css selector', function() {

            document.body.innerHTML = '<b id="block">test</b>';

            var block = new Block({
                el: '#block'
            });

            expect(block.el.tagName).toEqual('B');
            expect(block.el.textContent).toEqual('test');
        });

        it('el property can be a function', function() {

            document.body.innerHTML = '<b id="block">test</b>';

            var block = new Block({
                elementID: 'block',
                el: function() {
                    return document.getElementById(this.elementID);
                }
            });

            expect(block.el.tagName).toEqual('B');
            expect(block.el.textContent).toEqual('test');
        });

        it('el property has jQuery wrapper', function() {

            var block = new Block;

            expect(block.$el[0].tagName).toEqual('DIV');
            expect(block.$el[0].textContent).toEqual('');
        });

    });

    // ### get method
    // You can get any block property by keypath (ex: `block.get('foo.bar.baz')`). If on of property in this path is function
    // (getter accessor) it will be executed with block context.
    describe('get method', function() {

        it('get method should return expected undefined property', function() {

            var block = new Block();

            expect(block.get('a.b')).toEqual(undefined);

        });

        it('get method should return expected boolean property', function() {

            var block = new Block({
                a: {
                    b: false
                }
            });

            expect(block.get('a.b')).toEqual(false);

        });

        it('get method should return expected number property', function() {

            var block = new Block({
                a: {
                    b: 1
                }
            });

            expect(block.get('a.b')).toEqual(1);

        });

        it('get method should return expected string property', function() {

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            expect(block.get('a.b')).toEqual('b');

        });

        it('get method should return function result with block context', function() {

            var block = new Block({
                a: {
                    b: function() {
                        return this.c;
                    }
                },
                c: 'result'
            });

            expect(block.get('a.b')).toEqual('result');

        });

    });

    // ### set method
    // `set` method update or create property by keypath. If some property in this path does not exist it will be created automatically.
    // `set` method return only changed properties.
    describe('set method', function() {

        it('set method should add new property to the instance and create new objects if necessary', function() {

            var block = new Block;

            block.set('a.b.c', 'abc');

            expect(block.a.b.c).toBe('abc');
        });

        it('set method should return only changed properties', function() {

            var block = new Block({
                a: {
                    b: 'b',
                    c: 'c',
                    d: 'd'
                }
            });

            var changedProps = block.set('a', {
                e: 'e',
                b: 'b',
                c: 'cc'
            });

            expect(changedProps).toEqual({a: {e: 'e', c: 'cc'}});
        });

        it('set method should modify array without merging', function() {

            var block = new Block({
                array: [1, 2, 3]
            });

            block.set('array', [4, 5, 6]);

            expect(block.array).toEqual([4, 5, 6]);

        });

        it('set method should modify object value by key path', function() {

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            block.set('a.b', 'c');

            expect(block.a.b).toEqual('c');
        });

        it('set method should set boolean value event it is false', function() {

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            block.set('a.b', false);

            expect(block.a.b).toEqual(false);
        });

        it('set method should set number event it is 0', function() {

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            block.set('a.b', 0);

            expect(block.a.b).toEqual(0);
        });

        // `set` method will trigger corresponding `change` events if any properties in keypath are changed.
        // For nested properties all chain will be triggered from lowest level. (ex: `change:foo.bar.baz` -> `change:foo.bar` -> `change:foo`)
        it('set should trigger change events', function() {

            var change1 = jasmine.createSpy('a.b'),
                change2 = jasmine.createSpy('a.c'),
                change3 = jasmine.createSpy('a');

            var block = new Block({
                a: {
                    b: 'b',
                    c: 'c'
                }
            });

            block.on('change:a.b', change1);
            block.on('change:a.c', change2);
            block.on('change:a', change3);

            block.set('a', {
                b: 'new',
                c: 'c'
            });

            expect(change1).toHaveBeenCalled();
            expect(change2).not.toHaveBeenCalled();

        });

    });

    // ### include method
    // `include` method is proper way to decompose block on sub-blocks. It will automatically initialize and remove all nested
    // blocks to avoid memory leaks.
    describe('include method', function() {

        it('include method can include block constructor and pass properties', function() {

            var child = Block.extend({
                template: function() {
                    return '<div class="child">' + this.text + '</div>'
                }
            });

            var block = new Block({
                template: function() {
                    return '<div>' + this.include(child, {text: 'child'}) + '</div>'
                }
            });

            expect(block.el.querySelector('.child').innerHTML).toEqual('child');
        });

        it('include method can include block instance', function() {

            var child = Block.extend({
                template: function() {
                    return '<div class="child">' + this.text + '</div>'
                }
            });

            var block = new Block({
                template: function() {
                    return '<div>' + this.include(child({text: 'child'})) + '</div>'
                }
            });

            expect(block.el.querySelector('.child').innerHTML).toEqual('child');
        });

        it('include method can include partial function', function() {

            var partial = function() {
                return '<div class="child">' + this.text + '</div>'
            };

            var block = new Block({
                text: 'child',
                template: function() {
                    return '<div>' + this.include(partial) + '</div>'
                }
            });

            expect(block.el.querySelector('.child').innerHTML).toEqual('child');
        });

        it('include method can include html string', function() {

            var htmlString = '<div class="child">child</div>';

            var block = new Block({
                template: function() {
                    return '<div>' + this.include(htmlString) + '</div>'
                }
            });

            expect(block.el.querySelector('.child').innerHTML).toEqual('child');
        });

    });

    // ### Global Events
    // Independent blocks (blocks that are not parent and child to each other) can subscribe to each other by `globalEvents`
    // property. It will properly remove all global events when one of the block is removed.
    describe('Global events', function() {

        it('Can subscribe to independent block events', function() {

            document.body.innerHTML = '<div id="block1"></div><div id="block2"></div>';

            var eventHandler = jasmine.createSpy('eventHandler');

            var a, b;

            var Block1 = Block.extend({
                el: '#block1',
                globalEvents: {
                    'event #block2': function(e, param1, param2) {

                        eventHandler();
                        a = param1;
                        b = param2;
                    }
                }
            });

            var Block2 = Block.extend({
                el: '#block2'
            });

            var block1 = new Block1;
            var block2 = new Block2;

            block2.trigger('event', 'a', 'b');

            expect(eventHandler).toHaveBeenCalled();
            expect(a).toEqual('a');
            expect(b).toEqual('b');

        });

    });

});