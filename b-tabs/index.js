import Block from '../block'
import './styles'

function navigate (targetTab) {
  const targetHref = targetTab.getAttribute('href')
  const parentNode = targetTab.parentNode

  if (targetHref && targetHref.indexOf('#') === 0) {
    const targetElement = document.getElementById(targetHref.substr(1))
    targetElement && targetElement.setAttribute('active', '')
  }

  for (let i = 0; i < parentNode.children.length; ++i) {
    const siblingTab = parentNode.children[i]
    const siblingHref = siblingTab.getAttribute('href')

    if (siblingTab !== targetTab) {
      siblingTab.removeAttribute('active')
    }

    if (siblingTab !== targetTab && siblingHref && siblingHref.indexOf('#') === 0) {
      const siblingElement = document.getElementById(siblingHref.substr(1))
      siblingElement && siblingElement.removeAttribute('active')
    }
  }

  targetTab.setAttribute('active', '')
}

class Tabs extends Block {
  static get tagName () {
    return 'b-tabs'
  }

  get template () {
    return '<slot></slot>'
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('click', e => {
      if (e.target.tagName === 'B-TABS--ITEM') {
        navigate.call(this, e.target)
      }
    })
  }
}

window && window.customElements.define(Tabs.tagName, Tabs)

export default Tabs
