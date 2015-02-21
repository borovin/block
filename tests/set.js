define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe('Метод set', function() {

        it('Устанавливает значение через deepextend', function(){

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            block.set({
                a: {
                    c: 'c'
                }
            });

            expect(block.get('a.b')).toBe('b');
            expect(block.get('a.c')).toBe('c');

        });

        it('Устанавливает значение по указанному пути', function(){

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            block.set('a.c.d', 'c');

            expect(block.get('a.b')).toBe('b');
            expect(block.get('a.c.d')).toBe('c');

        });

        it('Вызывает событие set', function(){

            var block = new Block(),
                handler = jasmine.createSpy('handler');

            block.on('set', handler);

            block.set('a.c', {d: 'd'});

            expect(handler).toHaveBeenCalledWith({a: {c: {d: 'd'}}});

        });

    });

});