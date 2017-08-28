Feature('b-textarea')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-textarea.html')
  I.seeHtml('b-textarea')
})
