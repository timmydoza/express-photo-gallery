var gulp = require('gulp');
var resize = require('gulp-image-resize');
var parallel = require('concurrent-transform');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
var CORES = require('os').cpus().length;
var path = require('path');
var photoLocation = path.resolve(process.argv[4]);
console.log('Preparing: ' + photoLocation);

gulp.task('previews', function() {
  return gulp.src(photoLocation + '/*.jpg')
    .pipe(parallel(resize({width:1500, quality: 0.5}), CORES))
    //.pipe(rename(function(path) {path.basename += '_preview'}))
    .pipe(gulp.dest(photoLocation + '/previews'))
    .pipe(debug({title: 'Created'}));
});

gulp.task('thumbnails', ['previews'], function() {
  return gulp.src(photoLocation + '/previews/*.jpg')
    .pipe(parallel(resize({width:200}), CORES))
    //.pipe(rename(function(path) {path.basename += '_thumb'}))
    .pipe(gulp.dest(photoLocation + '/thumbs'))
    .pipe(debug({title: 'Created'}));
});

gulp.task('prep', ['previews', 'thumbnails']);
