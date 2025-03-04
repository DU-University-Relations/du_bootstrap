let gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  sourcemaps = require('gulp-sourcemaps'),
  $ = require('gulp-load-plugins')(),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  postcssInlineSvg = require('postcss-inline-svg'),
  pxtorem = require('postcss-pxtorem'),
  postcssProcessors = [
    postcssInlineSvg({
      removeFill: true,
      paths: ['./node_modules/bootstrap-icons/icons'],
    }),
    pxtorem({
      propList: [
        'font',
        'font-size',
        'line-height',
        'letter-spacing',
        '*margin*',
        '*padding*',
      ],
      mediaQuery: true,
    }),
  ];

const paths = {
  scss: {
    src: './scss/style.scss',
    dest: './css',
    watch: './scss/**/*.scss',
    bootstrap: './node_modules/bootstrap/scss/bootstrap.scss',
  },
  js: {
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
    popper: './node_modules/@popperjs/core/dist/umd/popper.min.js',
    foundation: './node_modules/foundation-sites/dist/js/foundation.min.js',
    isotope: './node_modules/isotope-layout/dist/isotope.pkgd.min.js',
    slick: './node_modules/slick-carousel/slick/slick.min.js',
    motionui: './node_modules/motion-ui/dist/motion-ui.min.js',
    dest: './js/vendor',
  },
};

// Compile sass into CSS & auto-inject into browsers
function styles() {
  return gulp
    .src([paths.scss.bootstrap, paths.scss.src])
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: [
          './node_modules/bootstrap/scss',
          './scss'
        ],
      }).on('error', sass.logError)
    )
    .pipe($.postcss(postcssProcessors))
    .pipe(
      postcss([
        autoprefixer({
          browsers: [
            'Chrome >= 35',
            'Firefox >= 38',
            'Edge >= 12',
            'Explorer >= 10',
            'iOS >= 8',
            'Safari >= 8',
            'Android 2.3',
            'Android >= 4',
            'Opera >= 12',
          ],
        }),
      ])
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest));
}

// Move the javascript files into our js folder
function js() {
  return gulp
    .src([
      paths.js.bootstrap,
      paths.js.popper,
      paths.js.foundation,
      paths.js.isotope,
      paths.js.slick,
      paths.js.motionui
    ])
    .pipe(gulp.dest(paths.js.dest));
}

// Watch scss/js files
function watch() {
  gulp.watch([paths.scss.watch, paths.scss.bootstrap], styles);
  gulp.watch([paths.js.bootstrap, paths.js.popper, paths.js.foundation], js);
}

const build = gulp.series(styles, gulp.parallel(js, watch));

exports.styles = styles;
exports.js = js;
exports.watch = watch;
exports.default = build;
