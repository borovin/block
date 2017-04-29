import Block from '../block';
import template from './template';
import InputText from '../input-text';

const types = {
    text: InputText
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
}

window && window.customElements.define(Input.tagName, Input);

export default Input;