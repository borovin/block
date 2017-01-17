const Builder = require('systemjs-builder');

function getDepCache(){
    const builder = new Builder('.', 'main.js');

    return builder.trace('examples/**/*.js').then(moduleTree => builder.getDepCache(moduleTree));
}

module.exports = getDepCache;