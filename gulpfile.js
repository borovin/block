const gulp = require('gulp');

require('./gulpTasks/generateMainFile');

gulp.task('default', ['generateMainFile']);

