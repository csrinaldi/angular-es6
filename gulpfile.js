/*jshint camelcase: false */
'use strict';

//=============================================
//               DEPENDENCIES
//=============================================

/**
 * Load required dependencies.
 */
var gulp           = require('gulp');
var browserSync    = require('browser-sync');
var reload      = browserSync.reload;

/**
 * Load Gulp plugins listed in 'package.json' and attaches
 * them to the `$` variable.
 */
/*jshint -W079 */
var $ = require('gulp-load-plugins')();


//=============================================
//   !!!FEEL FREE TO EDIT THESE VARIABLES!!!
//=============================================

var PRODUCTION_URL       = 'http://your-production-url.com';
var DEVELOPMENT_URL      = 'http://127.0.0.1:3000';
var PRODUCTION_CDN_URL   = 'http://martinmicunda.github.io/employee-scheduling-ui/dist/';

//=============================================
//            DECLARE VARIABLES
//=============================================

/**
 * Declare variables that are use in gulpfile.js or angular app
 */
var log                  = $.util.log;
var argv                 = $.util.env;
var ENV                  = !!argv.env ? argv.env : 'dev';
var COLORS               = $.util.colors;
var BROWSERS             = !!argv.browsers ? argv.browsers : 'PhantomJS';
var CDN_BASE             = !!argv.cdn ? PRODUCTION_CDN_URL : DEVELOPMENT_URL;
var APPLICATION_BASE_URL = ENV ? PRODUCTION_URL : DEVELOPMENT_URL;


//=============================================
//            PRINT INFO MESSAGE
//=============================================
log(COLORS.blue('********** RUNNING IN ' + ENV + ' ENVIROMENT **********'));

gulp.task('serve', [], function() {

    browserSync({
        server: "./"
    });

    gulp.watch("src/**/*.js").on('change', reload);
    gulp.watch("src/**/*.html").on('change', reload);
});