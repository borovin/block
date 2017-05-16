import morphdom from 'morphdom'
import './styles'
import './styles/initial'

function onBeforeElChildrenUpdated (fromEl, toEl) {
  if (fromEl instanceof Block && (fromEl.tagName === toEl.tagName)) {
    fromEl._slot = toEl.innerHTML
    return false
  }

  if (fromEl.tagName === 'SLOT' && (fromEl.tagName === toEl.tagName)) {
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
      const slot = this.querySelector('slot')
      slot && (slot.innerHTML = this._slot);
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
      this._slot = this.innerHTML
      this.innerHTML = ''
      this.render()
      this._connected = true
    }, 0)
  }

  renderedCallback () {

  }

  set _slot (value) {
    const newContent = value
    const oldContent = this._slot

    this.__slot = newContent

    if (this._connected && (oldContent !== newContent)) {
      const slot = this.querySelector('slot');
      slot && (slot.innerHTML = this.__slot);
    }
  }

  get _slot () {
    return this.__slot
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (this._connected && (oldVal !== newVal)) {
      this.render()
    }
  }
}

export default Block
