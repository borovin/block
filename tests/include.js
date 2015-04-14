define(function (require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function () {

        afterEach(function () {
            document.body.innerHTML = '';
        });

        it('Include block', function () {

            var child = Block.extend({
                text: 'child',
                template: function(){
                    return '<div class="child">' + this.text + '</div>'
                }
            });

            var block = new Block({
                template: function(block){
                    return '<div>' + block.include(child) + '</div>'
                }
            });

            expect(block.el.querySelector('.child').innerHTML).toEqual('child');
        });

        it('Include partial', function () {

            var partial = function(data){
                return '<div class="child">' + this.text + '</div>'
            };

            var block = new Block({
                text: 'child',
                template: function(block){
                    return '<div>' + block.include(partial) + '</div>'
                }
            });

            expect(block.el.querySelector('.child').innerHTML).toEqual('child');
        });

    });
});