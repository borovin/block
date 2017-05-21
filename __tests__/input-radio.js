import test from 'ava'
import Browser from './helpers/browser'
import {prettyPrint} from 'html'

test.beforeEach(t => {
  t.context.browser = new Browser()

  return t.context.browser.goto('/examples/b-input-radio.html')
})

test.afterEach(t => {
  return t.context.browser.close()
})

test('Unchecked radio input', async t => {
  const snapshot = await t.context.browser.snapshot('b-input-radio')

  t.snapshot(prettyPrint(snapshot))
})

test('Checked radio input', async t => {
  const snapshot = await t.context.browser.snapshot('b-input-radio[checked]')

  t.snapshot(prettyPrint(snapshot))
})
