export default (attributesMap = {}) => {
    return Object.keys(attributesMap).map(key => {
        let value = attributesMap[key];

        if (value === null || typeof value === 'undefined'){
            return '';
        }

        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        return `${key}="${value}"`;
    }).join(' ');
}