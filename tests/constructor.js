define(function (require, exports, module) {

    var Block = require('../block');

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

    });

});