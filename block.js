import morphdom from 'morphdom'
import './styles'
import './styles/initial'

function onBeforeElChildrenUpdated (fromEl, toEl) {
  if (fromEl.content) {
    fromEl.content = toEl.innerHTML
    return false
  }
}

class Block extends window.HTMLElement {
  constructor (props = {}) {
    super()

    Object.assign(this, props)
  }

  static get reflectedProperties () {
    return {}
  }

  static get observedAttributes () {
    return Object.keys(this.reflectedProperties)
  }

  render () {
    this._renderTimeout && clearTimeout(this._renderTimeout)

    const morphOptions = {
      childrenOnly: true,
      onBeforeElChildrenUpdated
    }

    if (this._connected) {
      this._renderTimeout = setTimeout(() => morphdom(this, `<div>${this.template}</div>`, morphOptions), 0)
    } else {
      morphdom(this, `<div>${this.template}</div>`, morphOptions)
      this.renderedCallback()
    }
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

    setTimeout(() => {
      this.content = this.innerHTML
      this.innerHTML = ''
      this.render()
      this._connected = true
    }, 0)
  }

  renderedCallback () {

  }

  set content (value) {
    const newContent = value
    const oldContent = this._content

    this._content = newContent

    if (this._connected && (oldContent !== newContent)) {
      this.render()
    }
  }

  get content () {
    return this._content
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (this._connected && (oldVal !== newVal)) {
      this.render()
    }
  }
}

export default Block
