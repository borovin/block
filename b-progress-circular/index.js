import Block from '../block'
import './styles'

class Progress extends Block {
  static get tagName () {
    return 'b-progress-circular'
  }

  static get reflectedProperties () {
    return {
      type: 'indeterminate',
      color: 'primary'
    }
  }

  render () {
    this.innerHTML = `
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>
      </svg>`
  }
}

window && window.customElements.define(Progress.tagName, Progress)

export default Progress
