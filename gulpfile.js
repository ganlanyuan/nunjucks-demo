const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require("gulp-rename");
const nunjucks = require('gulp-nunjucks');
const htmltidy = require('gulp-htmltidy');

function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

gulp.task('nunjucks', function() {
  let data = requireUncached('./templates/data.json');
  data.year = new Date().getFullYear();

  let imageCount = 0;
  data.getImageCount = function () { return imageCount += 1; };

  return gulp.src("templates/**/*.njk")
    .pipe(nunjucks.compile(data), {
      watch: true,
      noCache: true,
    })
    .pipe(rename(function (path) { path.extname = ".html"; }))
    .pipe(htmltidy({
      doctype: 'html5',
      wrap: 0,
      hideComments: true,
      indent: true,
      'indent-attributes': false,
      'drop-empty-elements': false,
      'force-output': true
    }))
    .pipe(gulp.dest('.'))
});

// Server
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    open: false,
    notify: false
  });
});

// watch
gulp.task('watch', function () {
  gulp.watch(['templates/**/*.njk', 'templates/**/*.json'], ['nunjucks']);
  gulp.watch("**/*.html").on('change', browserSync.reload);
})

// Default Task
gulp.task('default', [
  'server', 
  'watch',
]);  