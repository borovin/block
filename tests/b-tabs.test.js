Feature('b-tabs')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-tabs.html')
  I.seeHtml('b-tabs')
})
