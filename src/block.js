const morphdom = require('morphdom');
const trim = require('lodash/trim');

require('./styles');

class Block extends window.HTMLElement {
    constructor(props = {}) {
        super();

        Object.assign(this, props);
    }

    static get observedAttributes() {
        return Object.keys(this.properties || {});
    }

    render() {
        morphdom(this, `<div>${this.template}</div>`, {childrenOnly: true});
    }

    get template() {
        return `<div>Block</div>`
    }

    connectedCallback() {
        for (let attr in this.constructor.properties) {
            const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), attr) || {};
            const defaultValue = this[attr] || this.constructor.properties[attr];

            if (!this.getAttribute(attr) && defaultValue) {
                this.setAttribute(attr, defaultValue);
            }

            Object.defineProperty(this, attr, {
                configurable: true,
                enumerable: false,
                set: descriptor.set || function(value) {
                    this.setAttribute(attr, value);
                },
                get: descriptor.get || function() {
                    return this.getAttribute(attr) || defaultValue;
                }
            });
        }

        setTimeout(() => {
            this._connected = true;
            this.content = this.innerHTML;
            this.innerHTML = '';
            this.render();
        }, 0);
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        const isChanged = oldVal !== newVal;

        if (isChanged && this._connected) {
            this.render();
        }
    }
}

module.exports = Block;