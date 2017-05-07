const gulp = require('gulp');
const wrap = require('gulp-wrap');
const rename = require('gulp-rename');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const imagemin = require('gulp-imagemin');
const capitalize = require('lodash/capitalize');
const csso = require('gulp-csso');
const path = require('path');
const packageJSON = require('./package.json');
const gulpif = require('gulp-if');
const babel = require('rollup-plugin-babel');
const fs = require('fs-extra');

const isProduction = process.env.NODE_ENV === 'production';

function getBlocks(srcpath = path.join(__dirname, 'src')) {
    const exclude = ['utils', 'styles'];

    return fs.readdirSync(srcpath)
        .filter(file => (fs.statSync(path.join(srcpath, file)).isDirectory() && !exclude.includes(file)))
}

gulp.task('default', ['rollup']);

gulp.task('styles', () => {
    return gulp.src('src/**/*.css')
        .pipe(gulpif(isProduction, csso()))
        .pipe(wrap((data) => {
            const appendStylesPath = path.relative(path.dirname(data.file.path), path.join(__dirname, '/src/utils/appendStyles.js'));
            const stylesPath = path.relative(__dirname, data.file.path);
            const stylesID = path.join(packageJSON.name, stylesPath);

            return `//this file was generated automatically. Do not edit it manually.
const appendStyles = require('${appendStylesPath}');
appendStyles(\`<style id="${stylesID}">${data.contents}</style>\`);`;
        }))
        .pipe(rename({
            extname: '.js'
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('icons', () => {
    return gulp.src('src/icons/**/*.svg')
        .pipe(gulpif(isProduction, imagemin()))
        .pipe(wrap('module.exports = `<%= contents %>`'))
        .pipe(rename({
            extname: '.js'
        }))
        .pipe(gulp.dest('src/icons'));
});

gulp.task('generateIndex', () => {
    const blocks = getBlocks();
    const list = blocks.map(blockName => `'${blockName}': require('./${blockName}'),`).join('\n');

    fs.outputFileSync('src/index.js', `//this file was generated automatically. Do not edit it manually.
module.exports = {\n${list}\n};`)
});

gulp.task('rollup', ['icons', 'styles', 'generateIndex'], () => {
    fs.removeSync('./dist');

    const blocks = getBlocks().concat('index');

    return Promise.all(blocks.map(blockName => rollup.rollup({
        entry: blockName === 'index' ? './src/index.js' : `./src/${blockName}/index.js`,
        plugins: [
            nodeResolve(),
            commonjs(),
            babel()
        ]
    }).then(bundle => bundle.write({
        format: 'umd',
        moduleName: blockName === 'index' ? 'Block' : `Block.${blockName}`,
        sourceMap: true,
        dest: `./dist/${blockName}.js`
    }))));
});