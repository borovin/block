import Block from '../block'
import './styles'

class Progress extends Block {
  static get tagName () {
    return 'b-progress-linear'
  }

  static get reflectedProperties () {
    return {
      type: 'indeterminate',
      color: 'primary'
    }
  }

  render () {
    this.innerHTML = `<b-progress-linear--bar></b-progress-linear--bar>`
  }
}

window && window.customElements.define(Progress.tagName, Progress)

export default Progress
