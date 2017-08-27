Feature('b-toolbar')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-toolbar.html')
  I.seeHtml('b-toolbar')
})
