const stringifyAttributes = require('../utils/stringifyAttributes');

module.exports = block => {
    const attributes = {};

    for (let i = 0; i < block.attributes.length; i++) {
        const attribute = block.attributes[i];
        attributes[attribute.nodeName] = attribute.nodeValue;
    }

    return `
        <${block.constructor.types[block.type].tagName} ${stringifyAttributes(attributes)} />
    `;
};