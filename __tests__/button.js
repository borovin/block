import test from 'ava'
import Browser from './helpers/browser'
import {prettyPrint} from 'html'

test.beforeEach(t => {
  t.context.browser = new Browser()

  return t.context.browser.goto('/examples/button.html')
})

test.afterEach(t => {
  return t.context.browser.close()
})

test('Primary button example', async t => {
  const snapshot = await t.context.browser.snapshot('b-button[color="primary"]')

  t.snapshot(prettyPrint(snapshot))
})

test('Primary flat button example', async t => {
  const snapshot = await t.context.browser.snapshot('b-button[color="primary"][flat]')

  t.snapshot(prettyPrint(snapshot))
})
