define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe('Инициализация конструктора класса', function(){

        it('Первый объект-параметр копируется в свойства оббъекта при инициализации', function(){

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

    });
});