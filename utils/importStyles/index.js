const imports = [];

module.exports = function importStyles(stylesTemplate) {
    if (typeof stylesTemplate === 'function' && imports.indexOf(stylesTemplate) < 0) {
        const container = document.createElement('div');
        container.innerHTML = stylesTemplate();
        document.head.appendChild(container.querySelector('style'));
        imports.push(stylesTemplate);
    }
};
