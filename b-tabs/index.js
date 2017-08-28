import Block from '../block'
import './styles'

function navigate () {
  const targetHref = this.getAttribute('href')
  const parentNode = this.parentNode

  if (targetHref && targetHref.indexOf('#') === 0) {
    const targetElement = document.getElementById(targetHref.substr(1))
    targetElement && targetElement.setAttribute('active', '')
  }

  for (let i = 0; i < parentNode.children.length; ++i) {
    const siblingTab = parentNode.children[i]
    const siblingHref = siblingTab.getAttribute('href')

    if (siblingTab !== this) {
      siblingTab.removeAttribute('active')
    }

    if (siblingTab !== this && siblingHref && siblingHref.indexOf('#') === 0) {
      const siblingElement = document.getElementById(siblingHref.substr(1))
      siblingElement && siblingElement.removeAttribute('active')
    }
  }

  this.setAttribute('active', '')
}

class Tabs extends Block {
  static get tagName () {
    return 'b-tabs'
  }

  get template () {
    return '<slot></slot>'
  }
}

class TabItem extends Block {
  static get tagName () {
    return 'b-tabs--item'
  }

  static get reflectedProperties () {
    return {
      href: false
    }
  }

  get isExternal () {
    return this.href && this.href.indexOf('#') !== 0
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('click', e => {
      if (!this.isExternal) {
        navigate.call(this)
      }
    })
  }

  get template () {
    return this.isExternal ? `<a href="${this.href}"><slot></slot></a>` : '<slot></slot>'
  }
}

window && window.customElements.define(Tabs.tagName, Tabs)
window && window.customElements.define(TabItem.tagName, TabItem)

export default Tabs
