import morphdom from 'morphdom'
import styles from './styles'
import appendStyles from './utils/appendStyles'

appendStyles(styles, 'b-styles')

function onBeforeElChildrenUpdated(fromEl, toEl) {
  if (fromEl.tagName === 'SLOT' && toEl.tagName === 'SLOT') {
    return false
  }
}

const morphOptions = {
  childrenOnly: true,
  onBeforeElChildrenUpdated
}

class Block extends window.HTMLElement {
  constructor (props = {}) {
    super()

    Object.assign(this, props)

    this._shadowRoot = this.attachShadow({mode: 'open'})
  }

  static get reflectedProperties () {
    return {}
  }

  static get observedAttributes () {
    return Object.keys(this.reflectedProperties)
  }

  render () {
    this._renderTimeout && clearTimeout(this._renderTimeout)
    this._renderTimeout = setTimeout(() => morphdom(this._shadowRoot, `<div>${this.template}</div>`, morphOptions), 0)
  }

  get template () {
    return `<div>Block</div>`
  }

  connectedCallback () {
    for (let propName in this.constructor.reflectedProperties) {
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), propName) || {}
      const defaultValue = this[propName] || this.constructor.reflectedProperties[propName]

      if (this.getAttribute(propName) === null && defaultValue !== null && defaultValue !== false) {
        this.setAttribute(propName, defaultValue === true ? '' : defaultValue)
      }

      Object.defineProperty(this, propName, {
        configurable: true,
        enumerable: false,
        set: descriptor.set || function (value) {
          if (value === false) {
            this.removeAttribute(propName)
          } else if (typeof value === 'string') {
            this.setAttribute(propName, value)
          } else {
            this.setAttribute(propName, JSON.stringify(value))
          }
        },
        get: descriptor.get || function () {
          const attrValue = this.getAttribute(propName)
          let attrJson = null

          if (attrValue === '') {
            return true
          }

          if (attrValue === null) {
            return defaultValue
          }

          try {
            attrJson = JSON.parse(attrValue)
          } catch (err) {
            attrJson = attrValue
          }

          return attrJson
        }
      })
    }

    this.render()

    this._connected = true
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (this._connected && (oldVal !== newVal)) {
      this.render()
    }
  }
}

export default Block
