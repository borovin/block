const test = require('ava')
const Browser = require('./helpers/browser')
const {prettyPrint} = require('html')

test.beforeEach(t => {
  t.context.browser = new Browser()

  return t.context.browser.goto('/examples/button.html')
})

test.afterEach(t => {
  return t.context.browser.close()
})

test('Primary button example', async t => {
  const snapshot = await t.context.browser.snapshot('b-button:nth-child(1)')

  t.snapshot(prettyPrint(snapshot))
})

test('Accent button example', async t => {
  const snapshot = await t.context.browser.snapshot('b-button:nth-child(2)')

  t.snapshot(prettyPrint(snapshot))
})
