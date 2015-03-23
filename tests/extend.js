define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function() {

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

    });
});