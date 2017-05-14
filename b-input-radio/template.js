import stringifyAttributes from '../utils/stringifyAttributes'

export default block => {
  const inputAttributes = stringifyAttributes({
    value: block.value,
    name: block.name,
    disabled: block.disabled,
    type: 'radio',
    checked: block.getAttribute('checked')
  })

  return `
        <label>

            <input ${inputAttributes}/>
    
            <b-input-radio--icon></b-input-radio--icon>
    
            ${block.label ? `<b-input-radio--text>${block.label}</b-input-radio--text>` : ''}
        
        </label>
    `
}