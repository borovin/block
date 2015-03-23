define(function (require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function () {

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

    });
});