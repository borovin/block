import Block from '../block'
import template from './template'
import autosize from 'autosize'
import './styles'

class Input extends Block {
  static get tagName () {
    return 'b-textarea'
  }

  static get reflectedProperties () {
    return {
      label: false,
      placeholder: false,
      error: false,
      name: false,
      rows: 1
    }
  }

  get template () {
    return template(this)
  }

  get value () {
    const textarea = this.querySelector('textarea')

    return textarea ? textarea.value : this._value
  }

  set value (value) {
    this._value = value

    const textarea = this.querySelector('textarea')

    textarea && (textarea.value = value)

    if (value) {
      this.setAttribute('value', '')
    } else {
      this.removeAttribute('value')
    }
  }

  set content (value) {
    this.value = value
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('keyup', e => {
      const input = e.target

      this.removeAttribute('error')

      this.value = input.value
    })
  }

  renderedCallback () {
    super.renderedCallback()

    autosize(this.querySelector('textarea'))
  }
}

window && window.customElements.define(Input.tagName, Input)

export default Input
