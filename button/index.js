const Block = require('../index');

class Button extends Block {
    static get attributes() {
        return {
            color: 'green'
        }
    }

    get template() {
        return `test button`;
    }
}

window.customElements.define('b-button', Button);

module.exports = Button;