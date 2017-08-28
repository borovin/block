Feature('b-action-button')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-action-button.html')
  I.seeHtml('b-action-button')
})
