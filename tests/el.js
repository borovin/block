define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function(){

        it('block.el is empty div by default', function(){

            var block = new Block;

            expect(block.el.tagName).toEqual('DIV');
            expect(block.el.textContent).toEqual('');

        });

        it('el could be a string', function(){

            var block = new Block({
                el: '<span>text</span>'
            });

            expect(block.el.tagName).toEqual('SPAN');
            expect(block.el.textContent).toEqual('text');
        });

        it('el could be an existing html element', function(){

            var block = new Block({
                el: document.createElement('b')
            });

            expect(block.el.tagName).toEqual('B');
            expect(block.el.textContent).toEqual('');
        });

        it('el has jQuery wrapper', function(){

            var block = new Block;

            expect(block.$el[0].tagName).toEqual('DIV');
            expect(block.$el[0].textContent).toEqual('');
        });

    });
});