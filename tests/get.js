define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe('Метод get', function() {

        it('Возвращает значение свойства, если это не функция', function(){

            var block = new Block({
                a: 'a'
            });

            expect(block.get('a')).toEqual('a');

        });

        it('Возвращает значение вложенного свойства', function(){

            var block = new Block({
                a: {
                    b: {
                        c: 'c'
                    }
                }
            });

            expect(block.get('a.b.c')).toEqual('c');

        });

        it('Возвращает результат выполнения функции в контексте блока', function(){

            var block = new Block({
                a: {
                    b: {
                        c: function(){
                            return this.b;
                        }
                    }
                },
                b: 'b'
            });

            expect(block.get('a.b.c')).toEqual('b');

        });

        it('Возвращает undefined, если свойство не определено', function(){

            var block = new Block();

            expect(block.get('a.b.c')).toBeUndefined();

        });

    });

});