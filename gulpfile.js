const gulp = require('gulp')
const wrap = require('gulp-wrap')
const rename = require('gulp-rename')
const rollup = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const imagemin = require('gulp-imagemin')
const csso = require('gulp-csso')
const gulpif = require('gulp-if')
const babel = require('rollup-plugin-babel')
const fs = require('fs-extra')

const isProduction = process.env.NODE_ENV === 'production'

function getBlocks () {
  return fs.readdirSync(__dirname).filter(fileName => (fileName.indexOf('b-') === 0))
}

gulp.task('default', ['rollup'])

gulp.task('styles', ['resetStyles'], () => {
  return gulp.src(['./b-**/*.css', './styles/**/*.css'], {base: './'})
        .pipe(gulpif(isProduction, csso()))
        .pipe(wrap((data) => {
          return `//this file was generated automatically. Do not edit it manually.
export default \`<style>${data.contents}</style>\``
        }))
        .pipe(rename({
          extname: '.js'
        }))
        .pipe(gulp.dest('./'))
})

gulp.task('resetStyles', () => {
  const blocks = getBlocks()

  fs.outputFileSync('styles/initial.css', `/*this file was generated automatically. Do not edit it manually.*/
${blocks.join(', ')} {all: initial; display: block}
  `)
})

gulp.task('icons', () => {
  return gulp.src('icons/**/*.svg')
        .pipe(gulpif(isProduction, imagemin()))
        .pipe(wrap('export default `<%= contents %>`'))
        .pipe(rename({
          extname: '.js'
        }))
        .pipe(gulp.dest('icons'))
})

gulp.task('kit', () => {
  const blocks = getBlocks()
  const list = blocks.map(blockName => `Block['${blockName}'] = require('./${blockName}');`).join('\n')

  fs.outputFileSync('kit.js', `//this file was generated automatically. Do not edit it manually.
const Block = require('./block');
${list}
module.exports = Block;`)
})

gulp.task('rollup', ['icons', 'styles', 'kit'], () => {
  fs.removeSync('./dist')

  const blocks = getBlocks()
  const rootFiles = ['kit', 'block']

  const rollupBlocks = blocks.concat(rootFiles).map(name => rollup.rollup({
    entry: rootFiles.includes(name) ? `./${name}.js` : `./${name}/index.js`,
    plugins: [
      nodeResolve(),
      commonjs(),
      babel()
    ]
  }).then(bundle => bundle.write({
    format: 'umd',
    moduleName: rootFiles.includes(name) ? 'Block' : `Block.${name}`,
    sourceMap: true,
    dest: `./dist/${name}.js`
  })))

  return Promise.all(rollupBlocks)
})
