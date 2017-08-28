import stringifyAttributes from '../utils/stringifyAttributes'

export default block => {
  const tagName = block.href ? 'a' : 'button'

  const buttonAttributes = stringifyAttributes({
    href: block.href,
    type: block.href || block.type
  })

  return `
        <${tagName} ${buttonAttributes}>
            <slot></slot>
        </${tagName}>
    `
}
