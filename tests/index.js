const {Selector} = require('testcafe');

fixture `Button tests`
    .page `http://localhost:5001/examples/button.html`;

test('Default button', async t => {
    const button = Selector('b-button[color="primary"]');
    const text = await button.textContent;

    await t.expect(text).contains('Default button');
});

test('Accent button', async t => {
    const button = Selector('b-button[color="primary"]');
    const text = await button.textContent;

    await t.expect(text).contains('Accent button');
});