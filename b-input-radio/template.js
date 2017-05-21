import stringifyAttributes from '../utils/stringifyAttributes'

export default block => {
  const inputAttributes = stringifyAttributes({
    value: block.value,
    name: block.name,
    disabled: block.disabled,
    type: 'radio',
    checked: block.checked
  })

  return `
        <label>
            <input ${inputAttributes}/>
    
            <b-input-radio--icon></b-input-radio--icon>
    
            <slot></slot>
        </label>
    `
}
