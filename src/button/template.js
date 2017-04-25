module.exports = block => {
    const tagName = block.href ? 'a' : 'button';
    const href = block.href ? `href="${block.href}"` : '';
    const type = block.href ? `href="${block.href}"` : '';

    return `
        <${tagName} ${href}>
            ${block.content}
        </${tagName}>
    `;
};