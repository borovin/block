const Selector = require('../utils/selector');

fixture `Button tests`
    .page `http://localhost:5001/examples/button.html`;

test('Default button', async t => {
    const button = Selector('b-button button');

    await t.expect(button.textContent).contains('Default button');
});