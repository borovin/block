const morphdom = require('morphdom');

require('./styles');

function onBeforeElChildrenUpdated(fromEl, toEl) {
    if (fromEl.content) {
        fromEl.content = toEl.innerHTML;
        return false;
    }
}

class Block extends window.HTMLElement {
    constructor(props = {}) {
        super();

        Object.assign(this, props);
    }

    static get observedAttributes() {
        return Object.keys(this.properties || {});
    }

    render() {
        this._renderTimeout && clearTimeout(this._renderTimeout);

        const morphOptions = {
            childrenOnly: true,
            onBeforeElChildrenUpdated
        };

        this._renderTimeout = setTimeout(() => morphdom(this, `<div>${this.template}</div>`, morphOptions), 0);
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
            this.content = this.innerHTML;
            this.innerHTML = '';
            this.render();
            this._connected = true;
        }, 0);
    }

    set content(value) {
        const newContent = value;
        const oldContent = this._content;

        this._content = newContent;

        if (this._connected && (oldContent !== newContent)) {
            this.render();
        }
    }

    get content() {
        return this._content;
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (this._connected && (oldVal !== newVal)) {
            this.render();
        }
    }
}

module.exports = Block;