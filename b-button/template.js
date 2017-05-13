import stringifyAttributes from '../utils/stringifyAttributes'

export default block => {
  const tagName = block.href ? 'a' : 'button'

  const buttonAttributes = stringifyAttributes({
    href: block.href
  })

  return `
        <${tagName} ${buttonAttributes}>
            ${block.content}
        </${tagName}>
    `
}
