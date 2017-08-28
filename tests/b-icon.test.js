Feature('b-icon')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-icon.html')
  I.seeHtml('b-icon')
})
