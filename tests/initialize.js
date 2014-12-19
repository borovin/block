define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe('Инициализация класса', function(){

        it('Первый объект-параметр копируется в свойства экземпляра класса при инициализации', function(){

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

        it('Класс может быть проинициализирован без ключевого слова new', function(){

            var block = Block({
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

        it('При инициализации вызывается метод initialize', function(){

            spyOn(Block.prototype, 'initialize');

            var block = new Block;

            expect(Block.prototype.initialize).toHaveBeenCalled();
        });

        it('В метод initialize передаются все параметры инициализации', function(){

            spyOn(Block.prototype, 'initialize');

            var block = new Block({a: 1}, 2, 'string');

            expect(Block.prototype.initialize).toHaveBeenCalledWith({a: 1}, 2, 'string');
        });

        it('Метод initialize всегда возвращает promise', function(){

            var Block1 = Block.extend({
                initialize: function(){
                    this.a = 1;
                }
            });

            var block1 = new Block1;

            expect(typeof block1.initialize().then).toBe('function');
        });

    });
});