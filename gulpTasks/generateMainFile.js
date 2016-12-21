const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const gulp = require('gulp');
const getPackages = require('./utils/getPackages');
const getDepCache = require('./utils/getDepCache');

function generateMainFile() {
    fs.copySync('gulpTasks/utils/mainTemplate.js', 'main.js');

    return getPackages()
        .then(packages => {
            const packagesConfig = `System.config(${JSON.stringify(packages)});`;
            fs.appendFileSync('main.js', packagesConfig, {encoding: 'utf-8'});
            return getDepCache();
        })
        .then(depCache => {
            const depCacheConfig = `System.config({"depCache": ${JSON.stringify(depCache)}});`;
            fs.appendFileSync('main.js', depCacheConfig, {encoding: 'utf-8'});
        })
}

gulp.task('generateMainFile', generateMainFile);

