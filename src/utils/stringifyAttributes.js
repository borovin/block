module.exports = (attributesMap = {}) => {
    return Object.keys(attributesMap).map(key => {
        let value = attributesMap[key];

        if (value === null || typeof value === 'undefined' || value === false){
            return '';
        }

        if (value === true || value === ''){
            return key;
        }

        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        return `${key}="${value}"`;
    }).join(' ');
}