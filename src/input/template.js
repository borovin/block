import stringifyAttributes from '../utils/stringifyAttributes';

export default block => {
    const attributes = {};
    const exclude = ['id', 'name'];

    for (let i = 0; i < block.attributes.length; i++) {
        const attribute = block.attributes[i];

        if (exclude.indexOf(attribute.nodeName) < 0) {
            attributes[attribute.nodeName] = attribute.nodeValue;
        }
    }

    return `
        <${block._innerInputTagName} ${stringifyAttributes(attributes)} />
    `;
};