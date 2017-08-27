Feature('b-input-checkbox')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-input-checkbox.html')
  I.seeHtml('b-input-checkbox')
})
