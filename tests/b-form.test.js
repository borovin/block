Feature('b-form')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-form.html')
  I.seeHtml('b-form')
})
