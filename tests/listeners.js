define(function (require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function () {

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

    });
});