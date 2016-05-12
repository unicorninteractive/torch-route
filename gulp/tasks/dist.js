var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var RevAll = require('gulp-rev-all');
var p = require('../../package.json');
var execSync = require('child_process').execSync;

gulp.task('clean', ['build'], function() {
    return execSync('rm -rf ./dist/');
});

gulp.task('copy', ['clean'], function() {
    var revAll = new RevAll({
        dontRenameFile: ['.html', /^\/favicon.png$/g, /^\/favicon.ico$/g, /^\/boot.js/g, /map/, /share-image/, /share-video/],
        dontSearchFile: [/container.html/, 'embed/map/index.html', 'embed/questions/index.html'],
        prefix: global.previewUrl || p.previewUrl
    });

    return gulp.src('./build/**')
            .pipe(revAll.revision())
            .pipe(gulp.dest('dist'));
});

gulp.task('process-css', ['copy'], function() {
    return gulp.src('./dist/*.css')
        .pipe(minifycss({processImport: false}))
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['process-css'], function() {
    return gulp.src('./dist/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});