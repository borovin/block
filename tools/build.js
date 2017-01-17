const fs = require('fs-extra');
const trace = require('./trace');
const compileStyles = require('./compileStyles');
const compileTemplate = require('./compileTemplate');
const ignoreFiles = ['!node_modules/**', '!tools/**'];
const srcFiles = ['examples/**/*.js'];
const templateFiles = ['**/template.ejs'].concat(ignoreFiles);
const styleFiles = ['**/styles.ejs'].concat(ignoreFiles);
const glob = require('globule');
let start;

fs.copySync('tools/mainTemplate.js', 'main.js');

start = Date.now();

Promise.all([compileStyles(styleFiles), compileTemplate(templateFiles)])
    .then(() => glob.find(srcFiles).forEach(trace))
    .then(() => {
        const {packages, depCache} = require('./trace.json');

        fs.appendFileSync('main.js', `System.config({"packages": ${JSON.stringify(packages)}});`, {encoding: 'utf-8'});
        fs.appendFileSync('main.js', `System.config({"depCache": ${JSON.stringify(depCache)}});`, {encoding: 'utf-8'});

        console.log(`Done (${Date.now() - start}ms)`);
    });