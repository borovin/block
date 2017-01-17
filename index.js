const morphdom = require('morphdom');

class Block extends window.HTMLElement {
    constructor(props = {}) {
        super();

        if (props.content){
            this.content = props.content;
        }

        if (this.innerHTML){
            this.content = this.innerHTML;
        }

        this.innerHTML = '';

        for (let attr in this.constructor.attributes) {
            const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), attr) || {};
            const defaultValue = this.constructor.attributes[attr];
            Object.defineProperty(this, attr, {
                configurable: true,
                enumerable: false,
                set: descriptor.set || function(value) {
                    this.setAttribute(attr, value);
                },
                get: descriptor.get || function() {
                    return this.getAttribute(attr) || defaultValue;
                }
            })
        }
    }

    static get attributes() {
        return {}
    }

    static get observedAttributes(){
        return Object.keys(this.attributes);
    }

    render() {
        morphdom(this, `<div>${this.template}</div>`, {childrenOnly: true});
    }

    get template() {
        return `<div>Block</div>`
    }

    connectedCallback() {
        for (let attr in this.constructor.attributes) {
            const defaultValue = this.constructor.attributes[attr];
            this.setAttribute(attr, defaultValue);
        }
        this.render();
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        const isChanged = oldVal !== newVal;

        if (this._renderTimeout && isChanged) {
            clearTimeout(this._renderTimeout);
        }

        if (isChanged) {
            this._renderTimeout = setTimeout(this.render.bind(this), 0);
        }
    }
}

module.exports = Block;