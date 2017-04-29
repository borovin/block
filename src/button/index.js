import Block from '../block';
import template from './template';
import './styles';

class Button extends Block {
    static get tagName() {
        return 'b-button';
    }

    static get reflectedProperties() {
        return {
            color: 'primary'
        }
    }

    get template() {
        return template(this);
    }
}

window && window.customElements.define(Button.tagName, Button);

export default Button;