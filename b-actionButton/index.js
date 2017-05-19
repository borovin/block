import Block from '../block'
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

  render () {
    const icon = `${this.icon ? `<b-icon size="24" src="${this.icon}"></b-icon>` : `<slot>${this.content}</slot>`}`

    if (this.href) {
      this.innerHTML = `<a href="${this.href}">${icon}</a>`
    } else {
      this.innerHTML = `<button>${icon}</button>`
    }
  }
}

window && window.customElements.define(Button.tagName, Button)

export default Button
