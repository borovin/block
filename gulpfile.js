const gulp = require('gulp');
const wrap = require('gulp-wrap');
const rename = require('gulp-rename');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babili = require('rollup-plugin-babili');
const imagemin = require('gulp-imagemin');
const capitalize = require('lodash/capitalize');
const csso = require('gulp-csso');
const path = require('path');
const packageJSON = require('./package.json');
const gulpif = require('gulp-if');
const {argv} = require('yargs');
const babel = require('rollup-plugin-babel');

gulp.task('default', ['rollup']);

gulp.task('styles', () => {
    return gulp.src('src/**/*.css')
        .pipe(gulpif(argv.production, csso()))
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
        .pipe(gulpif(argv.production, imagemin()))
        .pipe(wrap('module.exports = `<%= contents %>`'))
        .pipe(rename({
            extname: '.js'
        }))
        .pipe(gulp.dest('src/icons'));
});

gulp.task('cover', function() {
    return gulp.src(['src/**/*.js'])
    // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('rollup', ['icons', 'styles'], () => {
    const blocks = [
        'button',
        'input',
        'form'
    ];

    function getPlugins() {
        const plugins = [
            nodeResolve(),
            commonjs()
        ];

        if (argv.production) {
            plugins.push(babili({
                comments: false
            }));
        }

        if (argv.coverage) {
            plugins.push(babel({
                plugins: ["istanbul"]
            }));
        }

        return plugins;
    }

    return Promise.all(blocks.map(blockName => rollup.rollup({
        entry: `./src/${blockName}/index.js`,
        plugins: getPlugins()
    }).then(bundle => bundle.write({
        format: 'umd',
        moduleName: `Block.${capitalize(blockName)}`,
        sourceMap: true,
        dest: `./dist/${blockName}.js`
    }))));
});