import Block from '../block'
import template from './template'
import './styles'

class Input extends Block {
  static get tagName () {
    return 'b-input-radio'
  }

  static get reflectedProperties () {
    return {
      value: false,
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

      const radios = document.querySelectorAll(`input[name="${input.name}"]`)

      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          radios[i].setAttribute('checked', '')
        } else {
          radios[i].removeAttribute('checked')
        }
      }
    })
  }
}

window && window.customElements.define(Input.tagName, Input)

export default Input
