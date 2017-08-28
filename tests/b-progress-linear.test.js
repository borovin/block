Feature('b-progress-linear')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-progress-linear.html')
  I.seeHtml('b-progress-linear')
})
