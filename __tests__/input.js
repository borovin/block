const Browser = require('../tools/browser');

let browser = null;

beforeEach(() => {
    browser = new Browser();
    browser.goto('/examples/input.html');
});

afterEach(() => {
    browser.close();
});

test('Default text input', async () => {
    const snapshot = await browser.snapshot('b-input:nth-child(1)');

    expect(snapshot).toMatchSnapshot();
});

test('Floating label input', async () => {
    const snapshot = await browser.snapshot('b-input:nth-child(2)');

    expect(snapshot).toMatchSnapshot();
});

test('Filled input', async () => {
    const snapshot = await browser.snapshot('b-input:nth-child(3)');

    expect(snapshot).toMatchSnapshot();
});

test('Input error', async () => {
    const snapshot = await browser.snapshot('b-input:nth-child(4)');

    expect(snapshot).toMatchSnapshot();
});