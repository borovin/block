Feature('b-input-switch')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-input-switch.html')
  I.seeHtml('b-input-switch')
})
