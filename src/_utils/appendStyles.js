const cache = [];

module.exports = function (stylesTemplate) {
    if (!document){
        return;
    }

    if (typeof stylesTemplate === 'string' && cache.indexOf(stylesTemplate) < 0) {
        const container = document.createElement('div');
        container.innerHTML = stylesTemplate;
        document.head.appendChild(container.querySelector('style'));
        cache.push(stylesTemplate);
    }
};
