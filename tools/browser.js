const Nightmare = require('nightmare');
const url = require('url');

class Browser {
    constructor(options) {
        this.nightmare = Nightmare(options);
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
            .evaluate(selector => document.querySelector(selector).outerHTML, selector);
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
        this.nightmare.then(() => this.nightmare.end())
    }
}

module.exports = Browser;