import test from 'ava'
import Browser from './helpers/browser'
import {prettyPrint} from 'html'

test.beforeEach(t => {
  t.context.browser = new Browser()

  return t.context.browser.goto('/examples/block.html')
})

test.afterEach(t => {
  return t.context.browser.close()
})

test('Test block example', async t => {
  const snapshot = await t.context.browser.snapshot('b-test')

  t.snapshot(prettyPrint(snapshot))
})
