var View = require('block');

describe('constructor', function () {

    it('should return view instance', function () {

        var view = new View();

        expect(view instanceof View).toBe(true);

    });

    it('should set all props to instance', function () {

        var view = new View({
            a: 1,
            b: 2
        });

        expect(view.a).toBe(1);
        expect(view.b).toBe(2);

    });
});
