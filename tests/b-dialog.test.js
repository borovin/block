Feature('b-dialog')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-dialog.html')
  I.click('b-button')
  I.seeHtml('b-dialog')
})
