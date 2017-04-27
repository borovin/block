const Browser = require('../tools/browser');

test('Primary button example', async () => {
    const selector = 'b-button[color="primary"]';
    const browser = new Browser();

    browser.goto('/examples/button.html');

    const snapshot = await browser.snapshot(selector);

    expect(snapshot).toMatchSnapshot();

    browser.close();
});

test('Accent button example', async () => {
    const selector = 'b-button[color="accent"]';
    const browser = new Browser();

    browser.goto('/examples/button.html');

    const snapshot = await browser.snapshot(selector);

    expect(snapshot).toMatchSnapshot();

    browser.close();
});