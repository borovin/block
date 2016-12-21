const Button = require('../button');

it('Should render content', () => {
    const button = new Button();

    button.connectedCallback();

    expect(button.innerHTML).toBe('button');
});