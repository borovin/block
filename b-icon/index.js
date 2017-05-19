import Block from '../block'
import './styles'

const iconsCache = {}

function isExternal (src) {
  return (src.indexOf('/') === 0) || (src.indexOf('http') === 0) || (src.indexOf('.') === 0)
}

function loadIcon (src) {
  if (iconsCache[src]) {
    return iconsCache[src]
  }

  iconsCache[src] = window.fetch(src)
    .then(res => res.text())
    .catch(e => console.warn(`Can't load icon ${src}`, e))

  return iconsCache[src]
}

class Icon extends Block {
  static get tagName () {
    return 'b-icon'
  }

  static get reflectedProperties () {
    return {
      src: false,
      size: false
    }
  }

  get isSvg () {
    return this.src && this.src.split('.').pop() === 'svg'
  }

  get src () {
    const src = this.getAttribute('src')

    if (src && !isExternal(src)) {
      const nameParts = src.split('/')
      const iconGroup = nameParts[0].toLowerCase()
      const iconName = nameParts[1].split(' ').join('_')

      return `https://unpkg.com/material-design-icons/${iconGroup}/svg/production/ic_${iconName}_24px.svg`
    }

    return src
  }

  render () {
    if (this.src && !this.isSvg) {
      this.innerHTML = `<b-icon-src style="background-image: url('${this.src}')"></b-icon-src>`
    } else if (this.src && this.isSvg) {
      loadIcon(this.src).then(svg => {
        this.innerHTML = svg
      })
    } else {
      this.innerHTML = `<slot>${this.content}</slot>`
    }
  }
}

window && window.customElements.define(Icon.tagName, Icon)

export default Icon
