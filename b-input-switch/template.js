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
    
            <b-input-switch--icon></b-input-switch--icon>
    
            <slot></slot>
    
        </label>
    `
}
