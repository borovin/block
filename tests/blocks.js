define(function (require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function () {

        afterEach(function () {
            document.body.innerHTML = '';
        });

        it('Initialize on element with attribute block="blockName"', function () {

            var blockConstructor = jasmine.createSpy('blockConstructor');

            document.body.innerHTML = '<div block="block"></div>';

            new Block({
                el: document.body,
                blocks: {
                    block: blockConstructor
                }
            });

            expect(blockConstructor).toHaveBeenCalled();
        });

        it('Context has el', function () {

            var el;

            document.body.innerHTML = '<div id="block" block="block"></div>';

            new Block({
                el: document.body,
                blocks: {
                    block: function (ctx) {
                        el = ctx.el;
                    }
                }
            });


            expect(el.id).toEqual('block');
        });

        it('Context has parentBlock', function () {

            var ctx;

            document.body.innerHTML = '<div id="block" block="block"></div>';

            var block = new Block({
                el: document.body,
                blocks: {
                    block: function (context) {
                        ctx = context;
                    }
                }
            });


            expect(ctx.parentBlock).toEqual(block);
        });

        it('Context has dataset', function () {

            var ctx;

            document.body.innerHTML = '<div data-a="a" data-b="b" block="block"></div>';

            new Block({
                el: document.body,
                blocks: {
                    block: function (context) {
                        ctx = context;
                    }
                }
            });

            expect(ctx.a).toEqual('a');
            expect(ctx.b).toEqual('b');
        });

        it('Context convert data to number', function () {

            var ctx;

            document.body.innerHTML = '<div data-number="1" block="block"></div>';

            new Block({
                el: document.body,
                blocks: {
                    block: function (context) {
                        ctx = context;
                    }
                }
            });

            expect(ctx.number).toEqual(1);
        });

        it('Context convert data to bool', function () {

            var ctx;

            document.body.innerHTML = '<div data-bool="false" block="block"></div>';

            new Block({
                el: document.body,
                blocks: {
                    block: function (context) {
                        ctx = context;
                    }
                }
            });

            expect(ctx.bool).toEqual(false);
        });

    });
});