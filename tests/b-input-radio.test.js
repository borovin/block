Feature('b-input-radio')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-input-radio.html')
  I.seeHtml('b-input-radio')
})
