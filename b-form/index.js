import Block from '../block'
import template from './template'
import qs from 'query-string'

class Form extends Block {
  static get tagName () {
    return 'b-form'
  }

  static get reflectedProperties () {
    return {
      action: document.location.pathname
    }
  }

  get template () {
    return template(this)
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('submit', (e) => {
      e.preventDefault()
      this.submit()
    })
  }

  serialize () {
    const formElement = this
    const data = {}

    formElement.querySelectorAll('input[name], textarea[name]').forEach(inputElement => {
      const inputName = inputElement.name
      let inputValue = inputElement.value

      switch (inputElement.type) {
        case 'radio': {
          const property = data[inputName]
          if (typeof property === 'undefined' || property === false) {
            data[inputName] = inputElement.checked ? inputValue : false
          }
          break
        }
        case 'checkbox': {
          data[inputName] = inputElement.checked
          break
        }
        default: {
          data[inputName] = inputValue
        }
      }
    })

    return data
  }

  submit () {
    const data = this.serialize()
    const errors = this.validate(data)

    if (!errors) {
      return this.save(data)
    } else {
      this.errors = errors
      return errors
    }
  }

  validate () {
  }

  save (data) {
    document.location.href = `${this.action}?${qs.stringify(data)}`
  }
}

window && window.customElements.define(Form.tagName, Form)

export default Form
