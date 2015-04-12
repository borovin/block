define(function (require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function () {

        afterEach(function () {
            document.body.innerHTML = '';
        });

        it('Include block', function () {

            var child = Block.extend({
                template: function(){
                    return '<div class="child">child</div>'
                }
            });

            var block = new Block({
                template: function(block){
                    return '<div>' + block.include(child) + '</div>'
                }
            });

            expect(block.el.querySelector('.child').innerHTML).toEqual('child');
        });

    });
});