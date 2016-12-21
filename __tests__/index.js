const Block = require('../index');

class TestBlock extends Block {
    static get attributes() {
        return Object.assign({}, Block.attributes, {
            'test-attr': 'pass'
        })
    }

    get template() {
        return `${super.template} <span>${this['test-attr']}</span>`;
    }
}

window.customElements.define('test-block', TestBlock);

it('should initialize content', () => {
    const testBlock = new TestBlock({
        content: '<span>test content</span>'
    });

    expect(testBlock.content).toBe('<span>test content</span>');
});

it('should initialize attributes', () => {
    const testBlock = new TestBlock();

    testBlock.connectedCallback();

    expect(testBlock['test-attr']).toBe('pass');
    expect(testBlock.getAttribute('test-attr')).toBe('pass');
});

it('should render template', () => {
    const testBlock = new TestBlock();

    testBlock.connectedCallback();

    expect(testBlock.innerHTML).toBe('<div>Block</div> <span>pass</span>');
});

it('should link properties to attributes', () => {
    const testBlock = new TestBlock();

    testBlock.connectedCallback();

    testBlock['test-attr'] = 'changed';

    expect(testBlock['test-attr']).toBe('changed');
    expect(testBlock.getAttribute('test-attr')).toBe('changed');
});

it('should render after attribute changed', (done) => {
    const testBlock = new TestBlock();

    testBlock.connectedCallback();

    testBlock['test-attr'] = 'changed';

    testBlock.attributeChangedCallback('test-attr', 'pass', 'changed');

    setTimeout(() => {
        expect(testBlock.innerHTML).toBe('<div>Block</div> <span>changed</span>');
        done();
    }, 0);
});

it('should render once after all attributes changed', (done) => {
    const testBlock = new TestBlock();

    testBlock.render = jest.fn();

    testBlock.attributeChangedCallback('test-attr', 'pass', 'changed');
    testBlock.attributeChangedCallback('test-attr', 'pass', 'changed');

    setTimeout(() => {
        expect(testBlock.render.mock.calls.length).toBe(1);
        done();
    }, 0);
});