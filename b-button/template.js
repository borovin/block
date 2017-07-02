import stringifyAttributes from '../utils/stringifyAttributes'
import styles from './styles'

export default block => {
  const tagName = block.href ? 'a' : 'button'

  const buttonAttributes = stringifyAttributes({
    href: block.href
  })

  return `${styles}
        <${tagName} ${buttonAttributes}>
            <slot></slot>
        </${tagName}>
    `
}
