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

    static get reflectedProperties() {
        return {};
    }

    static get observedAttributes() {
        return Object.keys(this.reflectedProperties);
    }

    render() {
        this._renderTimeout && clearTimeout(this._renderTimeout);

        const morphOptions = {
            childrenOnly: true,
            onBeforeElChildrenUpdated
        };

        if (this._connected){
            this._renderTimeout = setTimeout(() => morphdom(this, `<div>${this.template}</div>`, morphOptions), 0);
        } else {
            morphdom(this, `<div>${this.template}</div>`, morphOptions);
            this.renderedCallback();
        }
    }

    get template() {
        return `<div>Block</div>`
    }

    connectedCallback() {
        for (let attr in this.constructor.reflectedProperties) {
            const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), attr) || {};
            const defaultValue = this[attr] || this.constructor.reflectedProperties[attr];

            if (this.getAttribute(attr) === null && defaultValue) {
                this.setAttribute(attr, defaultValue);
            }

            Object.defineProperty(this, attr, {
                configurable: true,
                enumerable: false,
                set: descriptor.set || function(value) {
                    if (value === false){
                        this.removeAttribute(attr);
                    } else if (typeof value === 'string') {
                        this.setAttribute(attr, value);
                    } else {
                        this.setAttribute(attr, JSON.stringify(value));
                    }
                },
                get: descriptor.get || function() {
                    let json;

                    try {
                        json = JSON.parse(this.getAttribute(attr))
                    } catch (err) {
                        json = this.getAttribute(attr);
                    }

                    return json;
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

    renderedCallback() {

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