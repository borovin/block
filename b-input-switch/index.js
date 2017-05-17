import Block from '../block'
import template from './template'
import './styles'

class Input extends Block {
  static get tagName () {
    return 'b-input-switch'
  }

  static get reflectedProperties () {
    return {
      label: null,
      error: null,
      name: null
    }
  }

  get checked () {
    return this.querySelector('input').checked
  }

  set checked (value) {
    this.querySelector('input').checked = Boolean(value)
  }

  get template () {
    return template(this)
  }
}

window && window.customElements.define(Input.tagName, Input)

export default Input
