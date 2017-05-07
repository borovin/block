const test = require('ava');
const Browser = require('../tools/browser');
const {prettyPrint} = require('html');

test.beforeEach(t => {
    t.context.browser = new Browser();

    return t.context.browser.goto('/examples/input.html');
});

test.afterEach(t => {
    return t.context.browser.close();
});

test('Default text input', async t => {
    const snapshot = await t.context.browser.snapshot('b-input:nth-child(1)');

    t.snapshot(prettyPrint(snapshot));
});

test('Floating label input', async t => {
    const snapshot = await t.context.browser.snapshot('b-input:nth-child(2)');

    t.snapshot(prettyPrint(snapshot));
});

test('Filled input', async t => {
    const snapshot = await t.context.browser.snapshot('b-input:nth-child(3)');

    t.snapshot(prettyPrint(snapshot));
});

test('Input error', async t => {
    const snapshot = await t.context.browser.snapshot('b-input:nth-child(4)');

    t.snapshot(prettyPrint(snapshot));
});