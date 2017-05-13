import Block from '../block'
import template from './template'
import keycode from 'keycode'
import './styles'

class Dialog extends Block {
  static get tagName () {
    return 'b-dialog'
  }

  static get reflectedProperties () {
    return {
      opened: false
    }
  }

  get template () {
    return template(this)
  }

  open () {
    this.opened = true
  }

  close () {
    this.opened = false
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('click', e => {
      if (e.target === this) {
        this.close()
      }
    })
  }
}

if (document) {
  document.addEventListener('keyup', e => {
    const dialog = document.querySelector('b-dialog[opened]')

    if (keycode(e) === 'esc' && dialog) {
      dialog.close()
    }
  })
}

window && window.customElements.define(Dialog.tagName, Dialog)

export default Dialog
