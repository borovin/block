var View = require('block');

describe('constructor', function () {

    it('should return view instance', function () {

        var view = new View();

        expect(view instanceof View).toBe(true);

    });

    it('should return view instance without new keyword', function () {

        var view = View();

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

    it('should set nested props to instance', function () {

        var view = new View({
            a: {
                b: {
                    c: 1
                }
            }
        });

        expect(view.a.b.c).toBe(1);

    });
});
