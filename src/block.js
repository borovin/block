import morphdom from 'morphdom';
import './styles';

function onBeforeElChildrenUpdated(fromEl, toEl) {
    if (fromEl.content) {
        fromEl.content = toEl.innerHTML;
        return false;
    }
}

class Block extends window.HTMLElement {
    constructor(props = {}) {
        super();

        Object.assign(this, props);
    }

    static get reflectedProperties() {
        return {};
    }

    static get observedAttributes() {
        return Object.keys(this.reflectedProperties);
    }

    render() {
        this._renderTimeout && clearTimeout(this._renderTimeout);

        const morphOptions = {
            childrenOnly: true,
            onBeforeElChildrenUpdated
        };

        if (this._connected){
            this._renderTimeout = setTimeout(() => morphdom(this, `<div>${this.template}</div>`, morphOptions), 0);
        } else {
            morphdom(this, `<div>${this.template}</div>`, morphOptions);
            this.renderedCallback();
        }
    }

    get template() {
        return `<div>Block</div>`
    }

    connectedCallback() {
        for (let attr in this.constructor.reflectedProperties) {
            const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), attr) || {};
            const defaultValue = this[attr] || this.constructor.reflectedProperties[attr];

            if (!this.getAttribute(attr) && defaultValue) {
                this.setAttribute(attr, defaultValue);
            }

            Object.defineProperty(this, attr, {
                configurable: true,
                enumerable: false,
                set: descriptor.set || function(value) {
                    this.setAttribute(attr, value);
                },
                get: descriptor.get || function() {
                    return this.getAttribute(attr) || defaultValue;
                }
            });
        }

        setTimeout(() => {
            this.content = this.innerHTML;
            this.innerHTML = '';
            this.render();
            this._connected = true;
        }, 0);
    }

    renderedCallback() {

    }

    set content(value) {
        const newContent = value;
        const oldContent = this._content;

        this._content = newContent;

        if (this._connected && (oldContent !== newContent)) {
            this.render();
        }
    }

    get content() {
        return this._content;
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (this._connected && (oldVal !== newVal)) {
            this.render();
        }
    }
}

export default Block;