var gulp = require('gulp');
var gutil = require('gulp-util');
var execSync = require('child_process').exec;
var p = require('../../package.json');

gulp.task('publish', ['dist'], function() {
    gutil.log('Cloning repository from:', gutil.colors.magenta(p.publishUrl));
    return execSync('git clone ' + p.publishUrl + ' tmp-pub && mv tmp-pub/.git dist/.git && mv tmp-pub/.gitignore dist/ && rm -rf tmp-pub', {}, function() {
        execSync('git add -A && git commit -m "Automated publish" && git push --dry-run', {cwd: 'dist/'}, function() {
            gutil('Published to:', gutil.colors.green(p.publishUrl));
        });
    });
});