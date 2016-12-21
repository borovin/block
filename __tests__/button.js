const Button = require('../button');

require('@webcomponents/custom-elements');

it('Should render content', () => {
    const button = new Button();

    button.connectedCallback();

    expect(button.innerHTML).toBe('button');

});