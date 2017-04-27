const Block = require('../block');
const template = require('./template');

require('./styles');

class Input extends Block {
    static get tagName() {
        return 'b-input';
    }

    static get properties() {
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

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('keyup', e => {
            const input = e.target;

            this.removeAttribute('error');

            if (input.value) {
                this.setAttribute('value', input.value);
            } else {
                this.removeAttribute('value');
            }
        });
    }
}

window.customElements.define(Input.tagName, Input);

module.exports = Input;