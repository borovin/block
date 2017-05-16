import Nightmare from 'nightmare'
import url from 'url'
import fs from 'fs-extra'

class Browser {
  constructor (options) {
    this.nightmare = new Nightmare(options)
  }

  get baseUrl () {
    return process.env.BASE_URL || 'http://localhost:5000'
  }

  goto (path) {
    return this.nightmare.goto(url.resolve(this.baseUrl, path))
  }

  check () {
    return this.nightmare.check(...arguments)
  }

  type () {
    return this.nightmare.type(...arguments)
  }

  snapshot (selector) {
    return this.nightmare
            .wait(selector)
            .evaluate(querySelector => document.querySelector(querySelector).outerHTML, selector)
  }

  setProps (selector, props) {
    return this.nightmare
      .wait(selector)
      .evaluate((opt) => Object.assign(document.querySelector(opt.selector), opt.props), {selector, props})
  }

  screenshot (selector) {
    return this.nightmare
            .wait(selector)
            .evaluate(query => {
              const rect = document.querySelector(query).getBoundingClientRect()

              return {
                x: Math.ceil(rect.left),
                y: Math.ceil(rect.top),
                height: Math.ceil(rect.height),
                width: Math.ceil(rect.width)
              }
            }, selector)
            .then(rect => {
              return this.nightmare.screenshot(null, rect)
            })
  }

  close () {
    return this.nightmare
            .evaluate(() => {
              return window.__coverage__
            })
            .then(coverage => {
              if (coverage) {
                fs.outputJsonSync(`.nyc_output/coverage-${Date.now()}.json`, coverage)
              }
            })
            .then(() => this.nightmare.end())
  }
}

export default Browser
