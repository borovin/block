import test from 'ava'
import Browser from './helpers/browser'
import {prettyPrint} from 'html'

test.beforeEach(t => {
  t.context.browser = new Browser()

  return t.context.browser.goto('/examples/input-switch.html')
})

test.afterEach(t => {
  return t.context.browser.close()
})

test('Checked switch', async t => {
  const snapshot = await t.context.browser.snapshot('b-input-switch[name="switch_1"]')

  t.snapshot(prettyPrint(snapshot))
})

test('Unchecked switch', async t => {
  const snapshot = await t.context.browser.snapshot('b-input-switch[name="switch_2"]')

  t.snapshot(prettyPrint(snapshot))
})
