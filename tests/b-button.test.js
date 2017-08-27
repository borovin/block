Feature('b-button')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-button.html')
  I.seeHtml('b-button')
})
