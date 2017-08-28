import Block from '../block'
import './styles'

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
  let iconType = 'font'

  if (!src || typeof src !== 'string') {
    return
  }

  if (src.split('.').pop() === 'svg') {
    iconType = 'svg'
  }

  if ((src.indexOf('/') === 0) || (src.indexOf('http') === 0)) {
    iconType = 'external'
  }

  return iconType
}

class Icon extends Block {
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
        this.innerHTML = `<b-icon--src style="background-image: url('${this.src}')"></b-icon--src>`
        break
      case 'font':
        this.innerHTML = `<i class="material-icons">${this.src.split(' ').join('_')}</i>`
        break
      default:
        this.innerHTML = `<slot>${this.content}</slot>`
    }
  }
}

window && window.customElements.define(Icon.tagName, Icon)

export default Icon
