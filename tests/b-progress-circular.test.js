Feature('b-progress-circular')

After(I => {
  I.collectCoverage()
})

Scenario('layout', I => {
  I.amOnPage('/examples/b-progress-circular.html')
  I.seeHtml('b-progress-circular')
})
