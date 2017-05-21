import test from 'ava'
import Browser from './helpers/browser'
import {prettyPrint} from 'html'

test.beforeEach(t => {
  t.context.browser = new Browser()

  return t.context.browser.goto('/examples/b-form.html')
})

test.afterEach(t => {
  return t.context.browser.close()
})

test('Form example', async t => {
  const snapshot = await t.context.browser.snapshot('b-form')

  t.snapshot(prettyPrint(snapshot))
})

test('Form action prop change', async t => {
  const browser = t.context.browser

  await browser.type('input[name="a"]', 'test')
  await browser.setProps('b-form', {
    action: '/test'
  })

  const snapshot = await browser.snapshot('b-form')

  t.snapshot(prettyPrint(snapshot))
})
