const fs = require('fs');
const _template = require('lodash/template');
const glob = require('globule');
const babel = require('babel-core');
const packageJson = require('../package.json');

function compile(paths) {
    return new Promise(resolve => {
        glob.find(paths).forEach(path => {
            fs.readFile(path, 'utf-8', (error, content) => {
                const temp = _template(content, {variable: 'obj'});
                const template = babel.transform(`
                    const _ = {escape: require('lodash/escape')};
                    module.exports = ${temp}
                `, packageJson.babel).code;

                const templatePath = path.replace('.ejs', '.js');

                fs.writeFile(templatePath, template, 'utf-8', resolve);
            })
        });
    });
}

module.exports = compile;