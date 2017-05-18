import Block from '../block'
import template from './template'
import './styles'
import '../b-icon'

class Button extends Block {
  static get tagName () {
    return 'b-action-button'
  }

  static get reflectedProperties () {
    return {
      color: 'primary',
      small: false,
      icon: false
    }
  }

  get template () {
    return template(this)
  }
}

window && window.customElements.define(Button.tagName, Button)

export default Button
