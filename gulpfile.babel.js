/* eslint no-unused-vars: 0, indent: 0 */

import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import babelify from 'babelify';
import browserify from 'gulp-browserify';
import browsersync from 'browser-sync';
import combinemq from 'gulp-combine-mq';
import connect from 'gulp-connect';
import critical from 'critical';
import del from 'del';
import eslint from 'gulp-eslint';
import gulpif from 'gulp-if';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import minifycss from 'gulp-clean-css';
import notify from 'gulp-notify';
import path from 'gulp-path';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sequence from 'gulp-sequence';
import sourcemaps from 'gulp-sourcemaps';
import sassLint from 'gulp-sass-lint';
import uglify from 'gulp-uglify';
import swPrecache from 'sw-precache';
import gutil from 'gulp-util';
import uncss from 'gulp-uncss';

gutil.log = gutil.noop;

const APP_DIR = './src';
const DIST_DIR = './dist';

const imagePath = {
  src: `${APP_DIR}/images/**/*`,
  photo: [`${APP_DIR}/images/*.jpg`, `${APP_DIR}/images/**/*.png`, `${APP_DIR}/images/**/*.svg`],
  dist: `${DIST_DIR}/images/`,
};

const sassPath = {
  src: `${APP_DIR}/scss/**/*.scss`,
  dist: `${DIST_DIR}/css/`,
};

const jsPath = {
  src: `${APP_DIR}/js/**/*.js`,
  dist: `${DIST_DIR}/js`,
};

const htmlPath = {
  dist: `${DIST_DIR}/*.html`,
  prod: `${DIST_DIR}`,
};

// const twigPath = './src/AppBundle/Resources/views/**/*';

// -------------------------------------------------------------------------
// [Clean]
// - Delete all the files in the dist folder
// -------------------------------------------------------------------------

gulp.task('clean', () => {
  del([sassPath.dist, jsPath.dist, imagePath.dist], {
    dryRun: true
  });
});

// ------------------------------------------------------------------------
// [Styles]
// - Run sass
// - Run sass-lint task (*optional)
//   Eg => gulp.task('styles', sequence('sass-lint', 'sass'));
// ------------------------------------------------------------------------
gulp.task('styles', ['sass']);

// ------------------------------------------------------------------------
// [Sass-lint]
// - Run sass-lint
// ------------------------------------------------------------------------
gulp.task('sass-lint', () => {
  gulp.src(sassPath.src)
    .pipe(plumber({
      errorHandler: (err) => {
        notify.onError({
          title: 'Sass-lint error',
          message: '<%= error.message %>',
          sound: 'Sosumi',
          onLast: true,
        })(err);
        this.emit('end');
      },
    }))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(notify({
      message: 'Sass lint task complete',
      onLast: true,
    }));
});

// ------------------------------------------------------------------------
// [Sass]
// - Compile sass
// - Add prefixes
// - Create minified/uglified version
// - Combine media queries
// - Generate sourcemaps
// ------------------------------------------------------------------------

gulp.task('sass', () => {
  gulp.src([sassPath.src])
    .pipe(plumber({
      errorHandler: (err) => {
        notify.onError({
          title: 'Sass error',
          message: '<%= error.message %>',
          sound: 'Sosumi',
          onLast: true,
        })(err);
        this.emit('end');
      },
    }))

    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compact',
      sourceMap: true,
      includePaths: ['node_modules/susy/sass'],
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(sassPath.dist))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(sassPath.dist))
    .pipe(notify({
      message: 'Sass task complete',
      onLast: true,
    }));
});

// ------------------------------------------------------------------------
// [Critical]
// - Generate critical css
// - Generate minified critical css
//
// NOTE: Requires [clean] to run first. Please do not change the order
//       as critical had a problem when working with gulp del method
// ------------------------------------------------------------------------

gulp.task('critical', ['clean'], () => {
  critical.generate({
    base: 'dist/',
    inline: false,
    extract: true,
    minify: true,
    src: 'index.html',
    dest: 'css/critical.min.css',
  }).then(
    console.debug('=> Critical Path generated <='),
  );
});

// ------------------------------------------------------------------------
// [Htmlmin]
// - Minify html
// ------------------------------------------------------------------------
gulp.task('htmlmin', () => {
  gulp.src(htmlPath.dist)
    .pipe(plumber({
      errorHandler: (err) => {
        notify.onError({
          title: 'Html task error',
          message: '<%= error.message %>',
          sound: 'Sosumi',
          onLast: true,
        })(err);
        this.emit('end');
      },
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(htmlPath.prod))
    .pipe(notify({
      message: 'Html task complete',
      onLast: true,
    }));
});

// ------------------------------------------------------------------------
// [Images]
// - Minify Images
// ------------------------------------------------------------------------
gulp.task('images', () => {
  gulp.src(imagePath.src)
    .pipe(plumber({
      errorHandler: (err) => {
        notify.onError({
          title: 'Image Task error',
          message: '<%= error.message %>',
          sound: 'Sosumi',
          onLast: true,
        })(err);
        this.emit('end');
      },
    }))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(imagePath.dist));
  // .pipe(notify({
  //     message: 'Images task complete',
  //     onLast: true,
  // }));
});

// ------------------------------------------------------------------------
// [Eslint]
// - Run eslint on on all javascript files
// ------------------------------------------------------------------------
gulp.task('eslint', () => {
  gulp.src([
      `${APP_DIR}/js/ui/*.js`,
      `${APP_DIR}/js/utility/*.js`,
      `${APP_DIR}/js/utility/font-loading.js`,
      `${APP_DIR}/js/main.js`,
    ])
    .pipe(plumber({
      errorHandler: function plumberScripts(err) {
        notify.onError({
          title: 'ESLint',
          message: '<%= error.message %> In <%= error.fileName %> - Line <%= error.lineNumber %>',
          sound: 'Sosumi',
        })(err);
        this.emit('end');
      },
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(notify({
      message: 'ESLint task complete',
      onLast: true,
    }));
});

const jsTask = (url, dist, message) => {
  gulp.src([url])
    .pipe(plumber({
      errorHandler: function plumberScripts(err) {
        notify.onError({
          title: 'Script Compile Error',
          message: '<%= error %>',
          sound: 'Sosumi',
          onLast: true,
        })(err);
        this.emit('end');
      },
    }))
    .pipe(browserify({
      insertGlobals: true,
      transform: [babelify],
    }))
    .pipe(gulp.dest(dist))
    .pipe(sourcemaps.init())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
    .pipe(notify({
      message,
      onLast: true,
    }));
};

// ------------------------------------------------------------------------
// [JS]
// - Compile ES6 down to ES5
// - Minify js
// - Uglify js
// - Generate sourcemaps
// ------------------------------------------------------------------------
gulp.task('js', ['eslint'], () => {
  // jsTask(`${APP_DIR}/js/polyfills.js`, jsPath.dist, 'Polyfills generated');
  jsTask(`${APP_DIR}/js/main.js`, jsPath.dist, 'Main js generated');
  jsTask(`${APP_DIR}/js/font-loading.js`, jsPath.dist, 'Font-loading generated');

  gulp.src(`${APP_DIR}/js/vendor/*.js`)
    .pipe(plumber({
      errorHandler: function plumberScripts(err) {
        notify.onError({
          title: 'Script Compile Error',
          message: '<%= error.message %>',
          sound: 'Sosumi',
          onLast: true,
        })(err);
        this.emit('end');
      },
    }))
    .pipe(gulp.dest(jsPath.dist))
    .pipe(sourcemaps.init())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsPath.dist))
    .pipe(notify({
      message: 'Vendor files minified',
      onLast: true,
    }));
});

gulp.task('uncss', ['clean'], () => {
  gulp.src(`${sassPath.dist}/main.css`)
    .pipe(uncss({
      html: ['http://localhost:3000/'],
      ignore: [
        /.is?-[\w\d]+/,
        /.has?-[\w\d]+/,
        /.no?-[js]+/,
        '.u-prevent-events',
        '.u-no-scroll',
        /.fonts-loaded/,
      ],
    }))
    .pipe(gulp.dest(sassPath.dist));
});

gulp.task('connect', () => {
  // connect.server({
  //     root: DIST_DIR,
  //     livereload: true,
  //     debug: false,
  // });
  //
  //  console.log('[ Connected at http://localhost:8080/ ]');

  browsersync.init({
    open: false,
    server: DIST_DIR,
    notify: false,
  });

  console.log('browsersync');
});

gulp.task('watch', () => {
  // Do Sass related tasks
  gulp.watch(sassPath.src, ['styles']);

  // Do JS related tasks
  gulp.watch(jsPath.src, ['js']);

  // Watch image files
  gulp.watch(imagePath.src, ['images']);

  // Watch any files in dist/, reload on change
  gulp.watch([`${DIST_DIR}/css/main.min.css`], browsersync.reload);
  gulp.watch([`${DIST_DIR}/js/main.min.js`], browsersync.reload);

  gulp.watch([htmlPath.dist], browsersync.reload);
  gulp.watch([imagePath.dist], browsersync.reload);
});

gulp.task('reload', () => {
  gulp.src(htmlPath.dist)
    .pipe(plumber({
      errorHandler: function plumberScripts(err) {
        notify.onError({
          title: 'Script Compile Error',
          message: '<%= error.message %>',
          sound: 'Sosumi',
          onLast: true,
        })(err);
        this.emit('end');
      },
    }))
    .pipe(connect.reload())
    .pipe(notify({
      message: 'Page reloaded',
      onLast: true,
    }));
});

const writeServiceWorkerFile = (rootDir, handleFetch, callback) => {
  const config = {
    cacheId: 'static-files',

    /**
     *  If handleFetch is false (i.e. because this is called from swPrecache:dev), then
     *  the service worker will precache resources but won't actually serve them.
     *  This allows you to test precaching behavior without worry about the cache preventing your
     *  local changes from being picked up during the development cycle.
     */
    handleFetch,
    /**
     *  Cache:
     *  1. All HTML files,
     *  2. The main JS file. No need to cache the polyfills script,
     *  since browsers that require polyfills do not support servive workers
     *  3. All images
     */
    staticFileGlobs: [
      `${rootDir}/*.html`,
      `${rootDir}/js/main.min.js`,
      `${rootDir}/images/**/*.{webp,jpg,jpeg,png,ico}`,
    ],

    stripPrefix: rootDir,
  };

  swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
};

//  Default Task
gulp.task('default', sequence('clean', ['styles', 'images', 'eslint'], 'js', 'connect', 'watch'));

//  Production/Deployment task
gulp.task('deploy', sequence('clean', ['sass', 'images', 'eslint', 'htmlmin'], 'js', 'critical'));

gulp.task('deploy-prod', sequence('clean', ['styles', 'images'], 'js'));