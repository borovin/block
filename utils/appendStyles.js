const cache = []

export default (stylesTemplate, stylesId) => {
  if (!document) {
    return
  }

  const container = document.createElement('div')
  container.innerHTML = stylesTemplate

  const styles = container.querySelector('style')
  const id = document.getElementById(styles.id) || stylesId

  if (typeof stylesTemplate === 'string' && !cache.includes(id)) {
    document.head.appendChild(styles)
    cache.push(id)
  }
}
