var gulp = require('gulp');
var gzip = require('gulp-gzip');

const compress = () => {
    return gulp
        .src('./dist/*.js')
        .pipe(gzip())
        .pipe(gulp.dest('./dist'));
};

const build = gulp.series(compress);

exports.default = build;
