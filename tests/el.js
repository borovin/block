define(function(require, exports, module) {
    //requirements
    var Block = require('../block');

    describe('HTML-элемент блока', function(){

        it('По умолчанию элемент блока - пустой div', function(){

            var block = new Block;

            expect(block.el.tagName).toEqual('DIV');
            expect(block.el.textContent).toEqual('');

        });

        it('Элемент может быть создан из строки...', function(){

            var block = new Block({
                el: '<span>text</span>'
            });

            expect(block.el.tagName).toEqual('SPAN');
            expect(block.el.textContent).toEqual('text');
        });

        it('...или быть ссылкой на существующий элемент', function(){

            var block = new Block({
                el: document.createElement('b')
            });

            expect(block.el.tagName).toEqual('B');
            expect(block.el.textContent).toEqual('');
        });

        it('У элемента есть jQuery-обертка', function(){

            var block = new Block;

            expect(block.$el[0].tagName).toEqual('DIV');
            expect(block.$el[0].textContent).toEqual('');
        });

        it('Элемент может быть создан из template-функции...', function(){

            var block = new Block({
                template: function(){
                    return '<span>text</span>'
                }
            });

            expect(block.el.tagName).toEqual('SPAN');
            expect(block.el.textContent).toEqual('text');
        });

        it('...или из template-строки', function(){

            var block = new Block({
                template: '<span>text</span>'
            });

            expect(block.el.tagName).toEqual('SPAN');
            expect(block.el.textContent).toEqual('text');
        });

        it('Первым аргументом в template-функцию передается весь блок', function(){

            var block = new Block({
                text: 'text',
                template: function(block){
                    return '<span>' + block.text + '</span>'
                }
            });

            expect(block.el.tagName).toEqual('SPAN');
            expect(block.el.textContent).toEqual('text');
        });

        it('Partial вызывается в контексте блока', function(){

            var block = new Block({
                text: 'text',
                testPartial: _.template('<div class="partial" data-a="<%- a %>" data-b="<%- b %>"><%- text %></div>'),
                template: _.template('<div><%= partial(testPartial, {a: "a", b: "b"}) %></div>')
            });

            var partial = block.el.querySelector('.partial');

            expect(partial.textContent).toEqual('text');
            expect(partial.dataset.a).toEqual('a');
            expect(partial.dataset.b).toEqual('b');
        });

    });
});