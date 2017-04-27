const stringifyAttributes = require('../utils/stringifyAttributes');

module.exports = block => {
    const tagName = block.href ? 'a' : 'button';
    const href = block.href ? `href="${block.href}"` : '';

    const buttonAttributes = stringifyAttributes({
        href: block.href
    });

    return `
        <${tagName} ${buttonAttributes}>
            ${block.content}
        </${tagName}>
    `;
};