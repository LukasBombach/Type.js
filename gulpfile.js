'use strict';

/********************
 *
 * Dependencies
 *
 ********************/

// Basic Dependencies
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

/********************
 *
 * Paths & files
 *
 ********************/

// Sources
//var allSrcFiles = ['./src/**/*.js'];
var allSrcFiles = [
  './src/core.js',
//  './src/events.js',
//  './src/oop.js',
  './src/settings.js',
  './src/dom_utilities.js',
  './src/utilities.js',
];

// Dist
var distFolder  = './dist/';
var distFile    = 'type.js';
var distMin     = 'type.min.js';

/********************
 *
 * Code Quality
 *
 ********************/

/********************
 *
 * Build
 *
 ********************/

gulp.task('concat-src', function() {
  return gulp.src(allSrcFiles)
    .pipe(concat(distFile))
    .pipe(gulp.dest(distFolder));
});

gulp.task('uglify', ['concat-src'], function() {
  return gulp
    .src(distFolder + distFile)
    .pipe(uglify())
    .pipe(rename(distMin))
    .pipe(gulp.dest(distFolder));
});

/********************
 *
 * Tests
 *
 ********************/

/********************
 *
 * Development
 *
 ********************/

gulp.task('dev', ['concat-src'], function() {
  gulp.watch(allSrcFiles, ['concat-src']);
});

/********************
 *
 * High level tasks
 * Intended for cli usage
 *
 ********************/
gulp.task('build', ['concat-src']);
gulp.task('default', ['build']);

