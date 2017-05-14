import test from 'ava'
import Browser from './helpers/browser'
import {prettyPrint} from 'html'

test.beforeEach(t => {
  t.context.browser = new Browser()

  return t.context.browser.goto('/examples/input-radio.html')
})

test.afterEach(t => {
  return t.context.browser.close()
})

test('Checked radio input', async t => {
  const snapshot = await t.context.browser.snapshot('b-input-radio:nth-child(1)')

  t.snapshot(prettyPrint(snapshot))
})

test('Unchecked radio input', async t => {
  const snapshot = await t.context.browser.snapshot('b-input-radio:nth-child(2)')

  t.snapshot(prettyPrint(snapshot))
})
