const Block = require('../block');
const template = require('./template');

class Input extends Block {
    static get tagName() {
        return 'b-input';
    }

    static get properties() {
        return {
            label: null,
            value: null,
            type: 'text'
        };
    }

    get template() {
        return template(this);
    }

    connectedCallback() {
        super.connectedCallback();

        const input = this.shadowDom.querySelector('input');

        this.addEventListener('keyup', e => {
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