const gulp = require('gulp');
const watch = require('gulp-watch');

require('./tools/generateMainFile');

gulp.task('default', ['generateMainFile']);

gulp.task('watch', () => {
    gulp.watch([
        '**/*.ejs',
        '!node_modules'
    ], (event) => {
        console.log('Event type: ' + event.type); // added, changed, or deleted
        console.log('Event path: ' + event.path); // The path of the modified file
    });
});

