define(function (require, exports, module) {
    //requirements
    var Block = require('../block');

    describe(module.id, function () {

        afterEach(function () {
            document.body.innerHTML = '';
        });

        it('Include with custom tag', function () {

            var constructor = function(){};

            var block = new Block({
                el: document.body
            });

            expect(block.include(constructor, {tag: 'tr'}).indexOf('<tr')).toBe(0);
        });

    });
});