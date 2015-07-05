define(function (require, exports, module) {

    var Block = require('./block.js');

    describe(module.id, function(){

        it('All params set to block instance', function () {

            var block = new Block({
                number: 1,
                string: 'string1',
                bool: true,
                array: [1, 2, 3]
            });

            expect(block.number).toBe(1);
            expect(block.string).toBe('string1');
            expect(block.bool).toBe(true);
            expect(block.array).toEqual([1, 2, 3]);
        });

        it('Initialize without new', function () {

            var block = Block({
                a: 1
            });

            expect(block.a).toBe(1)
        });

        it('block.el is empty div by default', function(){

            var block = new Block;

            expect(block.el.tagName).toEqual('DIV');
            expect(block.el.textContent).toEqual('');

        });

        it('el could be a string', function(){

            var block = new Block({
                el: '<span>text</span>'
            });

            expect(block.el.tagName).toEqual('SPAN');
            expect(block.el.textContent).toEqual('text');
        });

        it('el could be an existing html element', function(){

            var block = new Block({
                el: document.createElement('b')
            });

            expect(block.el.tagName).toEqual('B');
            expect(block.el.textContent).toEqual('');
        });

        it('el has jQuery wrapper', function(){

            var block = new Block;

            expect(block.$el[0].tagName).toEqual('DIV');
            expect(block.$el[0].textContent).toEqual('');
        });

        it('instanceof works as expected', function() {

            var Block1 = Block.extend(),
                Block2 = Block1.extend();

            var block2 = new Block2;

            expect(block2 instanceof Block).toBeTruthy();
            expect(block2 instanceof Block1).toBeTruthy();
            expect(block2 instanceof Block2).toBeTruthy();

        });

        it('All properties copied to prototype', function() {

            var Block1 = Block.extend({
                    number: 1,
                    string: 'string1',
                    bool: true,
                    array: [1, 2, 3]
                }),
                Block2 = Block1.extend({
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

        it('Nested objects merged by deep extend method', function() {

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

        it('Instances copied by link', function() {

            var Block1 = Block.extend(),
                block1 = new Block1,
                Block2 = Block.extend({
                    block1: block1
                }),
                block2 = new Block2;

            expect(block2.block1).toBe(block1);
        });

        it('Get undefined', function(){

            var block = new Block();

            expect(block.get('a.b')).toBeUndefined();

        });

        it('Get boolean', function(){

            var block = new Block({
                a: {
                    b: false
                }
            });

            expect(block.get('a.b')).toBeFalsy();

        });

        it('Get number', function(){

            var block = new Block({
                a: {
                    b: 1
                }
            });

            expect(block.get('a.b')).toBe(1);

        });

        it('Get string', function(){

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            expect(block.get('a.b')).toBe('b');

        });

        it('Get function result', function(){

            var block = new Block({
                a: {
                    b: function(){
                        return this.result;
                    }
                },
                result: 'result'
            });

            expect(block.get('a.b')).toBe('result');

        });

        it('Call initialize', function () {

            spyOn(Block.prototype, 'initialize');

            new Block;

            expect(Block.prototype.initialize).toHaveBeenCalled();
        });

        it('Initialize could be overwritten', function () {

            var Block1 = Block.extend({
                count: 0,
                initialize: function () {
                    this.count++;
                }
            });

            var block = new Block1;

            block.initialize({
                count: 10
            });

            expect(block.count).toBe(11)
        });

        it('All params pass to initialize', function () {

            spyOn(Block.prototype, 'initialize');

            new Block({a: 1}, 2, 'string');

            expect(Block.prototype.initialize).toHaveBeenCalledWith({a: 1}, 2, 'string');
        });

        it('Initialize is promise', function () {

            var Block1 = Block.extend({
                initialize: function () {
                    this.a = 1;
                }
            });

            var block1 = new Block1;

            expect(typeof block1.initialize().then).toBe('function');
        });

        it('Call listeners', function () {

            var listener = jasmine.createSpy('listener');

            var block = new Block({
                listeners: {
                    'a.b': {
                        'test': listener
                    }
                },
                a: {
                    b: new Block()
                }
            });

            block.a.b.trigger('test');

            expect(listener).toHaveBeenCalled();
        });

        it('Listeners context is right', function () {

            var contextId;

            var block = new Block({
                id: 'block',
                listeners: {
                    'a.b': {
                        'test': function(){
                            contextId = this.id
                        }
                    }
                },
                a: {
                    b: new Block()
                }
            });

            block.a.b.trigger('test');

            expect(contextId).toEqual('block');
        });

        it('Listener could be a link to method', function () {

            var listener = jasmine.createSpy('listener');

            var block = new Block({
                id: 'block',
                listeners: {
                    'a.b': {
                        'test': 'testListener'
                    }
                },
                a: {
                    b: new Block()
                },
                testListener: listener
            });

            block.a.b.trigger('test');

            expect(listener).toHaveBeenCalled();
        });

        it('Listen block itself', function () {

            var listener = jasmine.createSpy('listener');

            var block = new Block({
                id: 'block',
                listeners: {
                    'change:a.b': listener
                },
                a: {
                    b: 'b'
                }
            });

            block.set('a.b', 'c');

            expect(listener).toHaveBeenCalled();
        });

        it('Set new props', function(){

            var block = new Block;

            block.set('a.b.c', 'abc');

            expect(block.a.b.c).toBe('abc');
        });

        it('Set return only changed properties', function(){

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

        it('Array modification', function(){

            var block = new Block({
                arr: [1,2,3]
            });

            block.set('arr', [4,5,6]);

            expect(block.arr).toEqual([4,5,6]);

        });

        it('Object modification', function(){

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            block.set('a.b', 'c');

            expect(block.a.b).toEqual('c');
        });

        it('Set boolean', function(){

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            block.set('a.b', false);

            expect(block.a.b).toBeFalsy();
        });

        it('Set number', function(){

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            block.set('a.b', 1);

            expect(block.a.b).toBe(1);
        });

        it('Set nested array', function(){

            var block = new Block({
                a: {
                    b: [1,2,3]
                }
            });

            block.set('a.b', [4,5]);

            expect(block.a.b).toEqual([4,5]);

        });

        it('Set trigger change events', function(){

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

        describe('include method', function () {

            afterEach(function () {
                document.body.innerHTML = '';
            });

            it('Include block', function () {

                var child = Block.extend({
                    text: 'child',
                    template: function(){
                        return '<div class="child">' + this.text + '</div>'
                    }
                });

                var block = new Block({
                    template: function(){
                        return '<div>' + this.include(child) + '</div>'
                    }
                });

                expect(block.el.querySelector('.child').innerHTML).toEqual('child');
            });

            it('Include partial', function () {

                var partial = function(){
                    return '<div class="child">' + this.text + '</div>'
                };

                var block = new Block({
                    text: 'child',
                    template: function(){
                        return '<div>' + this.include(partial) + '</div>'
                    }
                });

                expect(block.el.querySelector('.child').innerHTML).toEqual('child');
            });

        });

    });

});