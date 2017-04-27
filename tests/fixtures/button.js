const Selector = require('../utils/selector');

fixture `Button tests`
    .page `http://localhost:5001/examples/button.html`;

test.only('Default button', async t => {
    const button = Selector('b-button');
    const outerHTML = await button.outerHTML;

    await t.expect(outerHTML).contains('Default button');
});

test('Accent button', async t => {
    const button = Selector('b-button[color="accent"]');
    const text = await button.textContent;

    await t.expect(text).contains('Accent button');
});