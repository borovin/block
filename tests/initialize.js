define(function (require, exports, module) {
    //requirements
    var Block = require('../block');

    describe('Инициализация класса', function () {

        it('Первый объект-параметр копируется в свойства экземпляра класса при инициализации', function () {

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

        it('Даже если метод initialize был переопределен', function () {

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

        it('Класс может быть проинициализирован без ключевого слова new', function () {

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

        it('При инициализации вызывается метод initialize', function () {

            spyOn(Block.prototype, 'initialize');

            new Block;

            expect(Block.prototype.initialize).toHaveBeenCalled();
        });

        it('В метод initialize передаются все параметры инициализации', function () {

            spyOn(Block.prototype, 'initialize');

            new Block({a: 1}, 2, 'string');

            expect(Block.prototype.initialize).toHaveBeenCalledWith({a: 1}, 2, 'string');
        });

        it('Метод initialize всегда возвращает promise', function () {

            var Block1 = Block.extend({
                initialize: function () {
                    this.a = 1;
                }
            });

            var block1 = new Block1;

            expect(typeof block1.initialize().then).toBe('function');
        });

        it('Инициализация дефолтных моделей и коллекций', function () {

            var Block1 = Block.extend({
                models: {
                    model1: function () {
                        return 'model1';
                    }
                },
                model: function () {
                    return 'model';
                },
                collections: {
                    collection1: function () {
                        return 'collection1';
                    }
                },
                collection: function () {
                    return 'collection';
                }
            });

            var block1 = new Block1;

            expect(block1.models.model1).toBe('model1');
            expect(block1.model).toBe('model');

            expect(block1.collections.collection1).toBe('collection1');
            expect(block1.collection).toBe('collection');
        });

        it('Создание моделей и коллекций при инициализации', function () {

            var Block1 = Block.extend({
                models: {
                    model1: function () {
                        return 'model1';
                    }
                },
                model: function () {
                    return 'model';
                },
                collections: {
                    collection1: function () {
                        return 'collection1';
                    }
                },
                collection: function () {
                    return 'collection';
                }
            });

            var block1 = new Block1({
                models: {
                    model1: 'customModel1'
                },
                collections: {
                    collection1: 'customCollection1'
                },
                model: 'customModel',
                collection: 'customCollection'
            });

            expect(block1.models.model1).toBe('customModel1');
            expect(block1.model).toBe('customModel');

            expect(block1.collections.collection1).toBe('customCollection1');
            expect(block1.collection).toBe('customCollection');
        });

        it('Метод initBlock возвращает новый блок', function () {

            var block1 = new Block(),
                block2 = Block.extend({
                    name: 'block2'
                }),
                block3 = block1.initBlock(block2);

            expect(block3.name).toEqual('block2');
        });

        it('Метод initBlock добавляет блок в children', function () {

            var Block1 = Block.extend({
                    name: 'block1'
                }),
                Block2 = Block.extend({
                    name: 'block2'
                });

            var block1 = new Block1;

            block1.initBlock(Block2);

            expect(block1.children[0].name).toBe('block2');
        });

        it('Метод initBlock добавляет parentBlock', function () {

            var Block1 = Block.extend({
                    name: 'block1'
                }),
                Block2 = Block.extend({
                    name: 'block2'
                });

            var block1 = new Block1;

            var block3 = block1.initBlock(Block2);

            expect(block3.parentBlock).toEqual(block1);
        });

        it('Children независимы', function () {

            var Block1 = Block.extend({
                    name: 'block1'
                }),
                Block2 = Block.extend({
                    name: 'block2'
                });

            var block1 = new Block1;

            var block3 = block1.initBlock(Block2);

            expect(block3.children).not.toBe(block1.children);
        });

    });
});