import Block from '../block'
import template from './template'
import keycode from 'keycode'
import './styles'

class Input extends Block {
  static get tagName () {
    return 'b-input-text'
  }

  static get reflectedProperties () {
    return {
      label: false,
      value: false,
      type: 'text',
      placeholder: false,
      error: false,
      name: false
    }
  }

  get template () {
    return template(this)
  }

  get value () {
    return this.getAttribute('value') || false
  }

  set value (value) {
    if (!value) {
      this.removeAttribute('value')
    } else {
      this.setAttribute('value', value)
    }
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('keyup', e => {
      if (keycode(e.keyCode) === 'enter') {
        return
      }

      const input = e.target

      this.removeAttribute('error')

      if (input.value) {
        this.setAttribute('value', input.value)
      } else {
        this.removeAttribute('value')
      }
    })
  }
}

window && window.customElements.define(Input.tagName, Input)

export default Input
