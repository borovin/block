const test = require('ava')
const stringifyAttributes = require('./stringifyAttributes')

test('stringifyAttributes test', t => {
  const snapshot = stringifyAttributes({
    'a': 1,
    'b': 'b',
    'c': false,
    'd': true,
    'e': {a: 1}
  })

  t.snapshot(snapshot)
})
