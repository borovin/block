import stringifyAttributes from '../utils/stringifyAttributes'

export default block => {
  const label = block.label ? `<b-textarea--label>${block.label}</b-textarea--label>` : ''

  const inputAttributes = stringifyAttributes({
    rows: block.rows,
    type: block.type,
    placeholder: block.placeholder,
    name: block.name,
    autofocus: block.autofocus
  })

  return `
        <textarea ${inputAttributes}>${block.value}</textarea>
        
        <b-textarea--border></b-textarea--border>
        
        ${label}
    `
}
