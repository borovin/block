const chokidar = require('chokidar');
const _ = require('lodash');
const fs = require('fs');
const babel = require('babel-core');
const packageJson = require('../package.json');

// One-liner for current directory, ignores .dotfiles
chokidar.watch('**/*styles.ejs', {
    ignored: ['node_modules', 'src'],
}).on('all', (event, path) => {
    switch (event) {
        case 'unlink':
            break;
        default:
            fs.readFile(path, 'utf-8', (error, content) => {
                const temp = _.template(content, {variable: 'obj'});
                const styles = babel.transform(`
                    const importStyles = require('@basket/block/utils/importStyles/index');
                    
                    importStyles(${temp});
                `, packageJson.babel);

                const stylesPath = path.replace('.ejs', '.js');

                fs.writeFile(stylesPath, styles.code, 'utf-8', (err) => {
                    console.log(`${stylesPath} updated`);
                });
            });
    }
});

chokidar.watch('**/*template.ejs', {
    ignored: ['node_modules', 'src'],
}).on('all', (event, path) => {
    switch (event) {
        case 'unlink':
            break;
        default:
            fs.readFile(path, 'utf-8', (error, content) => {
                const temp = _.template(content, {variable: 'obj'});
                const template = babel.transform(`
                    const _ = {escape: require('lodash/escape')};
                    module.exports = ${temp}
                `, packageJson.babel);
                const templatePath = path.replace('.ejs', '.js');

                fs.writeFile(templatePath, template.code, 'utf-8', (err) => {
                    console.log(`${templatePath} updated`);
                });
            });
    }
});
