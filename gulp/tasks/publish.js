var gulp = require('gulp');
var gutil = require('gulp-util');
var execSync = require('child_process').execSync;
var p = require('../../package.json');

gulp.task('publish', ['dist'], function() {
    gutil.log('Cloning repository from:', gutil.colors.magenta(p.publishUrl));

    execSync('git clone ' + p.publishUrl + ' tmp-pub && mv tmp-pub/.git dist/.git && mv tmp-pub/.gitignore dist/ && rm -rf tmp-pub');

    execSync('sleep 2');

    gutil.log('Publishing project to:', gutil.colors.green(p.publishUrl));
    
    execSync('git add -A && git commit -m "Automated publish" && git push', {cwd: 'dist/'});

    gutil.log('Project published');

});
