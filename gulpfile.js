/*jshint camelcase: false */
'use strict';

//=============================================
//               DEPENDENCIES
//=============================================

/**
 * Load required dependencies.
 */
var gulp = require('gulp');
var inject = require("gulp-inject");
var series = require('stream-series');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

/**
 * Load Gulp plugins listed in 'package.json' and attaches
 * them to the `$` variable.
 */
/*jshint -W079 */
var $ = require('gulp-load-plugins')();


//=============================================
//   !!!FEEL FREE TO EDIT THESE VARIABLES!!!
//=============================================

var PRODUCTION_URL = 'http://your-production-url.com';
var DEVELOPMENT_URL = 'http://127.0.0.1:3000';
var PRODUCTION_CDN_URL = 'http://martinmicunda.github.io/employee-scheduling-ui/dist/';

//=============================================
//            DECLARE VARIABLES
//=============================================

/**
 * Declare variables that are use in gulpfile.js or angular app
 */
var log = $.util.log;
var argv = $.util.env;
var ENV = !!argv.env ? argv.env : 'dev';
var COLORS = $.util.colors;
var BROWSERS = !!argv.browsers ? argv.browsers : 'PhantomJS';
var CDN_BASE = !!argv.cdn ? PRODUCTION_CDN_URL : DEVELOPMENT_URL;
var APPLICATION_BASE_URL = ENV ? PRODUCTION_URL : DEVELOPMENT_URL;


//=============================================
//            PRINT INFO MESSAGE
//=============================================
log(COLORS.blue('********** RUNNING IN ' + ENV + ' ENVIROMENT **********'));

var main = gulp.src([ "./public/assets/main.css" ], {read: false});
var custom = gulp.src([ "./public/assets/custom.css" ], {read: false});


var twb = gulp.src([ "./public/libs/bootstrap/**/*.js" ], {read: false});
var jquery = gulp.src([ "./public/libs/jquery/**/*.js" ], {read: false});
var jqueryui = gulp.src([ "./public/libs/jquery-ui/**/*.js" ], {read: false});
var datatables = gulp.src([ "./public/assets/global/plugins/datatables/all.min.js" ], {read: false});

var metronic = gulp.src([ "./public/assets/global/scripts/metronic.js" ], {read: false});
var layout = gulp.src([ "./public/assets/admin/layout3/scripts/layout.js" ], {read: false});

gulp.task('index', [], function () {
  gulp.src("./index.html")
    //.pipe(inject(series(main, custom), {addRootSlash: false}))
    /*.pipe(inject(series(jquery, jqueryui, twb, datatables), {
     addRootSlash: false,
     name: 'twb'
     }));*/
    //.pipe(inject(series(metronic, layout), {addRootSlash: false, ignorePath: 'build', name: 'metronic'}))
    .pipe(gulp.dest('./'));
});


gulp.task('serve', [ 'index' ], function () {

  browserSync({
    server: {
      baseDir: "./",
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        next();
      }
    },
    port: 8000,
    ui: {
      port: 8000
    }
  });

  gulp.watch("./public/routes/**/*.js").on('change', reload);
  gulp.watch("./public/routes/**/*.html").on('change', reload);
  gulp.watch("./public/services/**/*.js").on('change', reload);
  gulp.watch("./public/layout/**/*.js").on('change', reload);
  gulp.watch("./public/core/**/*.js").on('change', reload);
  gulp.watch("./public/components/**/*.js").on('change', reload);
  gulp.watch("./public/main.js").on('change', reload);
  gulp.watch("./public/bootstrap.js").on('change', reload);
  gulp.watch("./public/vendors.js").on('change', reload);
});
