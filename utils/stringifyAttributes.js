export default (attributesMap = {}) => {
  return Object.keys(attributesMap).map(key => {
    let value = attributesMap[key]
    let result = ''

    switch (typeof value) {
      case 'string':
        result = `${key}="${value}"`
        break
      case 'boolean':
        result = value ? key : ''
        break
      default:
        result = `${key}="${JSON.stringify(value)}"`
    }

    if (!value) {
      result = ''
    }

    return result
  }).join(' ')
}
