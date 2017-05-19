import Block from '../block'
import './styles'

function navigate (targetTab) {
  const targetHref = targetTab.getAttribute('href')
  const parentNode = targetTab.parentNode

  if (targetHref && targetHref.indexOf('#') === 0) {
    document.getElementById(targetHref.substr(1)).setAttribute('active', '')
  }

  for (let i = 0; i < parentNode.children.length; ++i) {
    const siblingTab = parentNode.children[i]
    const siblingHref = siblingTab.getAttribute('href')

    if (siblingTab !== targetTab) {
      siblingTab.removeAttribute('active')
    }

    if (siblingTab !== targetTab && siblingHref && siblingHref.indexOf('#') === 0) {
      document.getElementById(siblingHref.substr(1)).removeAttribute('active')
    }
  }

  targetTab.setAttribute('active', '')
}

class Tabs extends Block {
  static get tagName () {
    return 'b-tabs'
  }

  render () {
    this.innerHTML = `<slot>${this.content}</slot>`
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
