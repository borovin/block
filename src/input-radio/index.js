const Block = require('../block');
const template = require('./template');
require('./styles');

class Input extends Block {
    static get tagName() {
        return 'b-input-radio';
    }

    static get reflectedProperties() {
        return {
            label: null,
            value: null,
            error: null,
            name: null,
            checked: null
        };
    }

    get template() {
        return template(this);
    }
}

window && window.customElements.define(Input.tagName, Input);

module.exports = Input;