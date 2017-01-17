const Block = require('../index');
const template = require('./template');

require('./styles');

class Button extends Block {
    static get attributes() {
        return {
            color: 'green'
        }
    }

    get template() {
        return template.call(this);
    }
}

window.customElements.define('b-button', Button);

module.exports = Button;