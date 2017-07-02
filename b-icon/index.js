import Block from '../block'
import styles from './styles'

const iconsCache = {}

function loadSvg (src) {
  if (iconsCache[src]) {
    return iconsCache[src]
  }

  iconsCache[src] = window.fetch(src)
    .then(res => res.text())
    .catch(e => console.warn(`Can't load svg icon ${src}`, e))

  return iconsCache[src]
}

function iconType (src) {
  if (!src) {
    return 'markup'
  }

  if (src && src.split('.').pop() === 'svg') {
    return 'svg'
  }

  if ((src.indexOf('/') === 0) || (src.indexOf('http') === 0)) {
    return 'external'
  }

  if (src) {
    return 'font'
  }
}

class Icon extends Block {
  constructor () {
    super()
    this._shadowRoot.innerHTML = `${styles}<slot></slot>`
  }

  static get tagName () {
    return 'b-icon'
  }

  static get reflectedProperties () {
    return {
      src: false,
      size: 48
    }
  }

  render () {
    switch (iconType(this.src)) {
      case 'svg':
        loadSvg(this.src).then(svg => {
          this.innerHTML = svg
        })
        break
      case 'external':
        this.innerHTML = `<b-icon__src style="background-image: url('${this.src}')"></b-icon__src>`
        break
      case 'font':
        this.innerHTML = `<i style="font-size: ${this.size}px" class="material-icons">${this.src.split(' ').join('_')}</i>`
        break
      case 'markup':
        break;
      default:
        this.innerHTML = this.src
    }
  }
}

window && window.customElements.define(Icon.tagName, Icon)

export default Icon
