import stringifyAttributes from '../utils/stringifyAttributes'

export default block => {
  const inputAttributes = stringifyAttributes({
    name: block.name,
    disabled: block.disabled,
    type: 'checkbox',
    checked: block.checked
  })

  return `
        <label>
            <input ${inputAttributes} />
    
            <b-input-checkbox--icon>
                <svg viewBox="0 0 24 24">
                    <path d="M9 16.17l-4.17-4.17-1.415 1.415 5.585 5.585 12-12-1.415-1.415z"/>
                </svg>
            </b-input-checkbox--icon>
    
            <slot></slot>
        </label>
    `
}
