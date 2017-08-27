const assert = require('assert')
const pretty = require('pretty')
const fs = require('fs-extra')

class Test extends Helper {
  // before/after hooks
  _before () {
    // remove if not used
  }

  _after () {
    // remove if not used
  }

  seeHtml (locator) {
    let browser = this.helpers['Nightmare'].browser
    return this.helpers['Nightmare']._locate(locator).then(function (els) {
      return browser.evaluate(function (el) {
        return codeceptjs.fetchElement(el).outerHTML
      }, els[0])
    }).then(function (outerHTML) {
      const expectedHtml = fs.readFileSync(`${process.cwd()}/tests/__snapshots__/${locator}.html`, 'utf8')
      assert.equal(pretty(outerHTML, {ocd: true}), pretty(expectedHtml, {ocd: true}), 'html not equal')
    })
  }

  collectCoverage () {
    // get nightmare instance
    let browser = this.helpers['Nightmare'].browser
    return browser.evaluate(() => {
      return window.__coverage__
    }).then(coverage => {
      if (coverage) {
        fs.outputJsonSync(`.nyc_output/coverage-${Date.now()}.json`, coverage)
      }
    })
  }
}

module.exports = Test
