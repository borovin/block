import test from 'ava'
import Browser from './helpers/browser'
import {prettyPrint} from 'html'

test.beforeEach(t => {
  t.context.browser = new Browser()

  return t.context.browser.goto('/examples/form.html')
})

test.afterEach(t => {
  return t.context.browser.close()
})

test('Form example', async t => {
  const snapshot = await t.context.browser.snapshot('b-form')

  t.snapshot(prettyPrint(snapshot))
})
