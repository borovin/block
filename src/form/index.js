const Block = require('../block');
const template = require('./template');
const isEmpty = require('lodash/isEmpty');
const forEach = require('lodash/forEach');
const trim = require('lodash/trim');
const set = require('lodash/set');

class Form extends Block {
    static get tagName() {
        return 'b-form';
    }

    static get properties() {
    }

    get template() {
        return template(this);
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {
        this._errors = value;
        this.render();
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('click', e => {
            if (e.target.matches('[type="submit"]')) {
                this.submit();
            }
        });
    }

    serialize() {
        const formElement = this;
        const data = {};

        forEach(formElement.querySelectorAll('[name]'), inputElement => {
            const inputName = trim(inputElement.name);
            let inputValue = trim(inputElement.value);

            if (isFinite(inputValue) && inputValue.length) {
                inputValue = Number(inputValue);
            }

            switch (inputElement.type) {
                case 'radio': {
                    const property = get(data, inputName);
                    if (typeof property === 'undefined' || property === false) {
                        set(data, inputName, inputElement.checked ? inputValue : false);
                    }
                    break;
                }
                case 'checkbox': {
                    set(data, inputName, inputElement.checked);
                    break;
                }
                default: {
                    set(data, inputName, inputValue);
                }
            }
        });

        return data;
    }

    submit() {
        const data = this.serialize();
        const errors = this.validate(data);

        if (isEmpty(errors)) {
            return this.save();
        } else {
            this.errors = errors;
            return errors;
        }
    }

    validate() {
    }

    save() {
    }
}

window.customElements.define(Form.tagName, Form);

module.exports = Form;