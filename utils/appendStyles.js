export default stylesTemplate => {
  if (!document) {
    return
  }

  const container = document.createElement('div')
  container.innerHTML = stylesTemplate

  const styles = container.querySelector('style')

  if (typeof stylesTemplate === 'string' && !document.getElementById(styles.id)) {
    document.head.appendChild(styles)
  }
}
