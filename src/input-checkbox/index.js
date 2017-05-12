const Block = require('../block');
const template = require('./template');
require('./styles');

class Input extends Block {
    static get tagName() {
        return 'b-input-checkbox';
    }

    static get reflectedProperties() {
        return {
            label: null,
            value: null,
            error: null,
            name: null
        };
    }

    get checked() {
        return this.querySelector('input').checked;
    }

    set checked(value) {
        return this.querySelector('input').checked = !!value;
    }

    get template() {
        return template(this);
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('change', e => {
            const input = e.target;

            this.checked = input.checked;
        });
    }
}

window && window.customElements.define(Input.tagName, Input);

module.exports = Input;