const Block = require('../block')
const template = require('./template')
require('./styles')

class Button extends Block {
  static get tagName () {
    return 'b-button'
  }

  static get reflectedProperties () {
    return {
      color: 'primary'
    }
  }

  get template () {
    return template(this)
  }
}

window && window.customElements.define(Button.tagName, Button)

module.exports = Button
