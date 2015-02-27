define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe('Вложенные блоки', function(){

        it('Вложенный блок инициализируется на элементе с атрибутом block', function(){

            var blockConstructor = jasmine.createSpy('blockConstructor');

            new Block({
                template: function(){
                    return '<div><span block="block1"></span></div>';
                },
                blocks: {
                    block1: blockConstructor
                }
            });

            expect(blockConstructor).toHaveBeenCalled();
        });

        it('В конструктор вложенного блока передается объект содержащий элемент', function(){

            var blockConstructor = jasmine.createSpy('blockConstructor');

            new Block({
                template: function(){
                    return '<div><span block="block1"></span></div>';
                },
                blocks: {
                    block1: blockConstructor
                }
            });

            expect(blockConstructor.calls.argsFor(0)[0].el.tagName).toEqual('SPAN');
        });

        it('В конструктор вложенного блока передается dataset', function(){

            var blockConstructor = jasmine.createSpy('blockConstructor');

            new Block({
                template: function(){
                    return '<div><span data-text="text" data-id="id" block="block1"></span></div>';
                },
                blocks: {
                    block1: blockConstructor
                }
            });

            expect(blockConstructor.calls.argsFor(0)[0].text).toEqual('text');
            expect(blockConstructor.calls.argsFor(0)[0].id).toEqual('id');
        });

        it('Элемент вложенного блока заменяется на template', function(){

            var block = new Block({
                template: function(){
                    return '<div><span block="block1"></span></div>';
                },
                blocks: {
                    block1: Block.extend({
                        template: function(){
                            return '<b class="block1">text</b>'
                        }
                    })
                }
            });

            expect(block.el.querySelector('.block1').tagName).toEqual('B');
        });

        it('Все вложенные блоки доступны через свойство children после инициализации', function(){

            var block = new Block({
                template: function(){
                    return '<div><span block="block1"></span></div>';
                },
                blocks: {
                    block1: Block.extend({
                        template: function(){
                            return '<b class="block1">text</b>'
                        }
                    })
                }
            });

            expect(block.children.block1[0].el.tagName).toEqual('B');
        });

        it('Все вложенные блоки содержат ссылку на родительский блок', function(){

            var block = new Block({
                template: function(){
                    return '<div><span block="block1"></span></div>';
                },
                blocks: {
                    block1: Block.extend({
                        template: function(){
                            return '<b class="block1">text</b>'
                        }
                    })
                }
            });

            expect(block.children.block1[0].parentBlock).toEqual(block);
        });

        it('Метод block вставляет дочерний блок в шаблон', function(){

            var block = new Block({
                template: _.template('<div><%= block(blocks.block1) %></div>'),
                blocks: {
                    block1: Block.extend({
                        template: _.template('<b class="block1">text</b>')
                    })
                }
            });

            expect(block.el.querySelector('.block1').textContent).toEqual('text');
        });

        it('После рендеринга все временные конструкторы удаляются', function(){

            var block = new Block({
                template: _.template('<div><%= block(blocks.block1) %></div>'),
                blocks: {
                    block1: Block.extend({
                        template: _.template('<b class="block1">text</b>')
                    })
                }
            });

            expect(_.keys(block.blocks)).toEqual(['block1']);
        });

        it('В метод block можно передать объекты-параметры', function(){

            var spy = jasmine.createSpy('block');

            var block = new Block({
                text: 'test',
                template: _.template('<div><%= block(testBlock, {a: {b: text}}) %></div>'),
                testBlock: Block.extend({
                    template: _.template('<b class="block1"><%- a.b %></b>')
                })
            });

            expect(block.el.querySelector('.block1').textContent).toEqual('test');
        });

    });
});