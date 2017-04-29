import Block from '../block';
import template from './template';
import './styles';

class Input extends Block {
    static get tagName() {
        return 'b-input-text';
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

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('change', e => {
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

window && window.customElements.define(Input.tagName, Input);

export default Input;