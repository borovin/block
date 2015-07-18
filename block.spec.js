import Block from './block.js';

describe('Block', function(){

    it('All params set to block instance', function () {

        var block = new Block({
            number: 1,
            string: 'string1',
            bool: true,
            array: [1, 2, 3]
        });

        expect(block.number).toBe(1);
        expect(block.string).toBe('string1');
        expect(block.bool).toBe(true);
        expect(block.array).toEqual([1, 2, 3]);
    });

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

    it('Set new props', function(){

        var block = new Block;

        block.set('a.b.c', 'abc');

        expect(block.a.b.c).toBe('abc');
    });

    it('Set return only changed properties', function(){

        var block = new Block({
            a: {
                b: 'b',
                c: 'c',
                d: 'd'
            }
        });

        var changedProps = block.set('a', {
            e: 'e',
            b: 'b',
            c: 'cc'
        });

        expect(changedProps).toEqual({a: {e: 'e', c: 'cc'}});
    });

    it('Array modification', function(){

        var block = new Block({
            arr: [1,2,3]
        });

        block.set('arr', [4,5,6]);

        expect(block.arr).toEqual([4,5,6]);

    });

    it('Object modification', function(){

        var block = new Block({
            a: {
                b: 'b'
            }
        });

        block.set('a.b', 'c');

        expect(block.a.b).toEqual('c');
    });

    it('Set boolean', function(){

        var block = new Block({
            a: {
                b: 'b'
            }
        });

        block.set('a.b', false);

        expect(block.a.b).toBeFalsy();
    });

    it('Set number', function(){

        var block = new Block({
            a: {
                b: 'b'
            }
        });

        block.set('a.b', 1);

        expect(block.a.b).toBe(1);
    });

    it('Set nested array', function(){

        var block = new Block({
            a: {
                b: [1,2,3]
            }
        });

        block.set('a.b', [4,5]);

        expect(block.a.b).toEqual([4,5]);

    });

    it('Set trigger change events', function(){

        var change1 = jasmine.createSpy('a.b'),
            change2 = jasmine.createSpy('a.c');

        var block = new Block({
            a: {
                b: 'b',
                c: 'c'
            }
        });

        block.on('change:a.b', change1);
        block.on('change:a.c', change2);

        block.set('a', {
            b: 'new',
            c: 'c'
        });

        expect(change1).toHaveBeenCalled();
        expect(change2).not.toHaveBeenCalled();

    });

});