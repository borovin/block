import morphdom from 'morphdom'
import './styles'
import './styles/initial'

function onBeforeElChildrenUpdated (fromEl, toEl) {
  if (fromEl instanceof Block && (fromEl.tagName === toEl.tagName)) {
    fromEl.content = toEl.innerHTML
    return false
  }

  if (fromEl.tagName === 'SLOT' && (fromEl.tagName === toEl.tagName)) {
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
  }

  static get reflectedProperties () {
    return {}
  }

  static get observedAttributes () {
    return Object.keys(this.reflectedProperties).map(propName => propName.toLowerCase())
  }

  render () {
    this._renderTimeout && clearTimeout(this._renderTimeout)

    if (this._connected) {
      this._renderTimeout = setTimeout(() => morphdom(this, `<div>${this.template}</div>`, morphOptions), 0)
    } else {
      morphdom(this, `<div>${this.template}</div>`, morphOptions)
      const slot = this.querySelector('slot')
      slot && (slot.innerHTML = this.content)
      this.renderedCallback()
    }
  }

  get template () {
    return `<div>Block</div>`
  }

  connectedCallback () {
    for (let propName in this.constructor.reflectedProperties) {
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), propName) || {}
      const defaultValue = this.constructor.reflectedProperties[propName]
      let defaultAttribute

      if (typeof defaultValue !== 'string') {
        defaultAttribute = JSON.stringify(defaultValue)
      }

      if (this.getAttribute(propName) === null && defaultAttribute !== 'null' && defaultAttribute !== 'false') {
        this.setAttribute(propName, defaultAttribute === 'true' ? '' : defaultValue)
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

  set content (newContent) {
    const oldContent = this._content
    const slot = this.querySelector('slot')

    this._content = newContent

    if (this._connected && slot && (oldContent !== newContent)) {
      morphdom(slot, `<div>${newContent}</div>`, morphOptions)
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
