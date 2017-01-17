const fs = require('fs');
const template = require('lodash/template');
const glob = require('globule');
const babel = require('babel-core');
const packageJson = require('../package.json');

function compile(paths) {
    return new Promise(resolve => {
        glob.find(paths).forEach(path => {
            fs.readFile(path, 'utf-8', (error, content) => {
                const temp = template(content, {variable: 'obj'});
                const styles = babel.transform(`
                    const importStyles = require('@basket/block/utils/importStyles/index');
                    const _ = {escape: require('lodash/escape')};
                    importStyles(${temp});
                `, packageJson.babel).code;

                const stylesPath = path.replace('.ejs', '.js');

                fs.writeFile(stylesPath, styles, 'utf-8', resolve);
            })
        });
    });
}

module.exports = compile;