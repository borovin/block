const Nightmare = require('nightmare');
const url = require('url');
const fs = require('fs-extra');

class Browser {
    constructor(options) {
        this.nightmare = new Nightmare(options);
    }

    get baseUrl() {
        return process.env.BASE_URL || 'http://localhost:5000';
    }

    goto(path) {
        return this.nightmare.goto(url.resolve(this.baseUrl, path));
    }

    snapshot(selector) {
        return this.nightmare
            .wait(selector)
            .evaluate(querySelector => new Promise(resolve => resolve(document.querySelector(querySelector).outerHTML)), selector);
    }

    screenshot(selector) {
        return this.nightmare
            .wait(selector)
            .evaluate(selector => {
                const rect = document.querySelector(selector).getBoundingClientRect();

                return {
                    x: Math.ceil(rect.left),
                    y: Math.ceil(rect.top),
                    height: Math.ceil(rect.height),
                    width: Math.ceil(rect.width)
                };
            }, selector)
            .then(rect => {
                return this.nightmare.screenshot(null, rect)
            });
    }

    close() {
        return this.nightmare
            .evaluate(() => {
                return window.__coverage__;
            })
            .then(coverage => {
                if (coverage){
                    fs.outputJsonSync(`.nyc_output/coverage-${Date.now()}.json`, coverage);
                }
            })
            .then(() => this.nightmare.end());
    }
}

module.exports = Browser;