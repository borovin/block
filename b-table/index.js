import Block from '../block'
import './styles'

class Table extends Block {
  static get tagName () {
    return 'b-table'
  }

  get template () {
    return '<slot></slot>'
  }
}

window && window.customElements.define(Table.tagName, Table)

export default Table
