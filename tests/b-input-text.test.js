Feature('b-input-text')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-input-text.html')
  I.seeHtml('b-input-text')
})
