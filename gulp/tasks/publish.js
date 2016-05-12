var gulp = require('gulp');
var gutil = require('gulp-util');
var execSync = require('child_process').exec;
var Q = require('q');
var p = require('../../package.json');

gulp.task('publish', ['dist'], function() {

    var deferred = Q.defer();

    gutil.log('Cloning repository from:', gutil.colors.magenta(p.publishUrl));
    execSync('git clone ' + p.publishUrl + ' tmp-pub && mv tmp-pub/.git dist/.git && mv tmp-pub/.gitignore dist/ && rm -rf tmp-pub', {}, function() {
        execSync('git add -A && git commit -m "Automated publish" && git push --dry-run', {cwd: 'dist/'}, function() {
            deferred.resolve;
        });
    });

    return deferred.promise;
});