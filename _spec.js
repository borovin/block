var Block = require('./index.js'),
    $ = require('./bower_components/jquery/dist/jquery.js');

describe(module.id, function() {

    afterEach(function() {
        document.body.innerHTML = '';
    });

    // ### Initialization process
    describe('initialization', function() {

        // You can pass option-object parameter to the constructor. All this options will be set directly on the block instance
        // as block properties and will be available throw this
        it('All initialization properties should be set to block instance', function() {

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
        it('Block can be initialized without new keyword', function() {

            var block = Block({
                a: 1
            });

            expect(block.a).toBe(1)
        });

        it('initialize method should be called by constructor', function() {

            spyOn(Block.prototype, 'initialize');

            new Block;

            expect(Block.prototype.initialize).toHaveBeenCalled();
        });

        it('Initialize method can be overwritten', function() {

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

        it('All initialization properties should be passed to initialize method', function() {

            spyOn(Block.prototype, 'initialize');

            new Block({a: 1}, 2, 'string');

            expect(Block.prototype.initialize).toHaveBeenCalledWith({a: 1}, 2, 'string');
        });

        it('All plain object properties pass by values and do not affect another instances', function() {

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

        it('Initializing event should be triggered', function() {

            document.body.innerHTML = '<div id="block"></div>';

            var handler = jasmine.createSpy('initialize handler');

            $('#block').on('initializing', handler);

            new Block({
                el: '#block'
            });

            expect(handler).toHaveBeenCalled();
        });

        it('Initialized event should be triggered', function() {

            document.body.innerHTML = '<div id="block"></div>';

            var handler = jasmine.createSpy('initialize handler');

            $('#block').on('initialized', handler);

            new Block({
                el: '#block'
            });

            expect(handler).toHaveBeenCalled();

        });

        it('Initialize method can return promise object', function(done) {

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

    describe('extend method', function() {

        it('instanceof should work as expected', function() {

            var Block1 = Block.extend(),
                Block2 = Block1.extend();

            var block2 = new Block2;

            expect(block2 instanceof Block).toEqual(true);
            expect(block2 instanceof Block1).toEqual(true);
            expect(block2 instanceof Block2).toEqual(true);

        });

        it('All properties should be copied to prototype', function() {

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

        it('Nested properties should be merged by deep extend method', function() {

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

        it('Plain object properties should be copied by values and do not affect other instances', function() {

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

        it('Not plain object properties should be copied by link', function() {

            var Block1 = Block.extend(),
                block1 = new Block1;

            var Block2 = Block.extend({
                    block1: block1
                }),
                block2 = new Block2;

            expect(block2.block1).toEqual(block1);
        });

    });

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

        it('el property can be function', function() {

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

        it('Block el has jQuery wrapper', function() {

            var block = new Block;

            expect(block.$el[0].tagName).toEqual('DIV');
            expect(block.$el[0].textContent).toEqual('');
        });

    });

    describe('get method', function() {

        it('Get undefined property should return expected undefined', function() {

            var block = new Block();

            expect(block.get('a.b')).toEqual(undefined);

        });

        it('Get boolean property should return expected boolean', function() {

            var block = new Block({
                a: {
                    b: false
                }
            });

            expect(block.get('a.b')).toEqual(false);

        });

        it('Get number property should return expected number', function() {

            var block = new Block({
                a: {
                    b: 1
                }
            });

            expect(block.get('a.b')).toEqual(1);

        });

        it('Get string property should return expected string', function() {

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            expect(block.get('a.b')).toEqual('b');

        });

        it('Get function result property should return function result with block context', function() {

            var block = new Block({
                a: {
                    b: function() {
                        return this.result;
                    }
                },
                result: 'result'
            });

            expect(block.get('a.b')).toEqual('result');

        });

    });

    describe('set method', function() {

        it('set new property should add it to the instance and create new objects if necessary', function() {

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

        it('set should trigger change events', function() {

            var change1 = jasmine.createSpy('a.b'),
                change2 = jasmine.createSpy('a.c');

            var block = new Block({
                a: {
                    b: 'b',
                    c: 'c'
                }
            });

            block.on('change:a.b', change1);
            block.on('change:a.c', change2);

            block.set('a', {
                b: 'new',
                c: 'c'
            });

            expect(change1).toHaveBeenCalled();
            expect(change2).not.toHaveBeenCalled();

        });

    });

    describe('include method', function() {

        it('include method can include block constructor', function() {

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

    describe('Global events', function() {

        it('Independent blocks can subscribe to each other', function() {

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