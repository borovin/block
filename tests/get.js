define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function() {

        it('Get undefined', function(){

            var block = new Block();

            expect(block.get('a.b')).toBeUndefined();

        });

        it('Get boolean', function(){

            var block = new Block({
                a: {
                    b: false
                }
            });

            expect(block.get('a.b')).toBeFalsy();

        });

        it('Get number', function(){

            var block = new Block({
                a: {
                    b: 1
                }
            });

            expect(block.get('a.b')).toBe(1);

        });

        it('Get string', function(){

            var block = new Block({
                a: {
                    b: 'b'
                }
            });

            expect(block.get('a.b')).toBe('b');

        });

        it('Get function result', function(){

            var block = new Block({
                a: {
                    b: function(){
                        return this.result;
                    }
                },
                result: 'result'
            });

            expect(block.get('a.b')).toBe('result');

        });

    });

});