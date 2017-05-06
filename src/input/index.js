const Block = require('../block');
const template = require('./template');

const types = {
    text: require('../input-text'),
    radio: require('../input-radio'),
    checkbox: require('../input-checkbox')
};

class Input extends Block {
    static get tagName() {
        return 'b-input';
    }

    static get types() {
        return types;
    }

    static get reflectedProperties() {
        return {
            label: null,
            value: null,
            type: 'text',
            placeholder: null,
            error: null,
            name: null
        };
    }

    get template() {
        return template(this);
    }

    get _innerInputTagName() {
        return this.constructor.types[this.type].tagName;
    }

    renderedCallback() {
        super.renderedCallback();

        const innerInput = this.querySelector(this._innerInputTagName);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const {attributeName} = mutation;
                const attributeValue = innerInput.getAttribute(attributeName);

                if (attributeValue) {
                    this.setAttribute(attributeName, attributeValue);
                } else {
                    this.removeAttribute(attributeName);
                }
            });
        });

        observer.observe(innerInput, {
            attributes: true,
            childList: false,
            characterData: false
        });
    }
}

window && window.customElements.define(Input.tagName, Input);

module.exports = Input;