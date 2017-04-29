const Browser = require('../tools/browser');

let browser = null;

beforeEach(() => {
    browser = new Browser();
    browser.goto('/examples/button.html');
});

afterEach(() => {
    browser.close();
});

test('Primary button example', async () => {
    const snapshot = await browser.snapshot('b-button:nth-child(1)');

    expect(snapshot).toMatchSnapshot();

    browser.close();
});

test('Accent button example', async () => {
    const snapshot = await browser.snapshot('b-button:nth-child(2)');

    expect(snapshot).toMatchSnapshot();

    browser.close();
});