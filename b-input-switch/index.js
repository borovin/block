import Block from '../block'
import template from './template'
import './styles'

class Input extends Block {
  static get tagName () {
    return 'b-input-switch'
  }

  static get reflectedProperties () {
    return {
      error: false,
      name: false,
      checked: false
    }
  }

  get template () {
    return template(this)
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('change', e => {
      const input = e.target

      this.removeAttribute('error')

      if (input.checked) {
        this.setAttribute('checked', '')
      } else {
        this.removeAttribute('checked')
      }
    })
  }
}

window && window.customElements.define(Input.tagName, Input)

export default Input
