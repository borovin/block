import Block from '../block'
import './styles'

class Toolbar extends Block {
  static get tagName () {
    return 'b-toolbar'
  }

  get template () {
    return '<slot></slot>'
  }
}

window && window.customElements.define(Toolbar.tagName, Toolbar)

export default Toolbar
