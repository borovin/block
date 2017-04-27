const Browser = require('../tools/browser');

let browser;

beforeEach(() => {
    browser = new Browser();
    browser.goto('/examples/form.html');
});

afterEach(() => {
    browser.close();
});

test('Primary button example', async () => {
    const snapshot = await browser.snapshot('b-form');

    expect(snapshot).toMatchSnapshot();

    browser.close();
});
