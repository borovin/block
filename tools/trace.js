const precinct = require('precinct').paperwork;
const cwd = process.cwd();
const path = require('path');
const fs = require('fs-extra');
const babel = require('babel-core');
const packageJson = require('../package.json');

function trace(file) {
    const start = Date.now();
    const {packages, depCache, traced} = require('./trace.json');

    // if (traced[file] > new Date(fs.statSync(file).mtime).getTime()) {
    //     console.log(`${file} was not modified since last tracing`);
    //     return {packages, depCache, traced};
    // }

    const dependencies = precinct(file);

    if (file.indexOf('node_modules') === 0){
        fs.outputFileSync(file.replace('node_modules', 'browser_modules'), babel.transformFileSync(file, packageJson.babel).code);
        file = file.replace('node_modules', 'browser_modules');
    }

    if (dependencies.length) {
        const module = packages[file.replace('.js', '')] = {
            map: {}
        };

        depCache[file] = [];

        dependencies.forEach(depId => {
            let moduleId = depId;

            if (depId.indexOf('.') === 0) {
                moduleId = path.resolve(path.dirname(file.replace('browser_modules', 'node_modules')), depId);
            }

            const depPath = require.resolve(moduleId).replace(`${cwd}/`, '');

            depCache[file].push(depPath.replace('node_modules', 'browser_modules'));

            module['map'][depId] = depPath.replace('.js', '').replace('node_modules', 'browser_modules');

            trace(depPath);
        });
    }

    traced[file] = Date.now();

    fs.writeJSONSync('tools/trace.json', {packages, depCache, traced});

    console.log(`Traced ${file} in ${Date.now() - start}ms`);

    return {packages, depCache, traced};
}

module.exports = trace;