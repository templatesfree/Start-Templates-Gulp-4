const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const imageminWebp = require('imagemin-webp');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const plumber = require('gulp-plumber');
const autoprefixer = require("autoprefixer");
const webp = require('gulp-webp');
const rigger = require('gulp-rigger');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const jshint = require('gulp-jshint');
const postcss = require('gulp-postcss');
const mixins = require('postcss-mixins');
const rename = require("gulp-rename");
const del = require('del');
const changed = require('gulp-changed');

const path = {
    styles: {
        src: "gulp/**/**/*.scss",
        dist: "local/templates/kdteam/",
        watch: "gulp/**/**/*.scss"
    },
    scripts: {
        src: "gulp/**/**/*.js",
        dist: "local/templates/kdteam/",
        watch: "gulp/**/**/*.js"
    },
    html: {
      src: "gulp/**/**/*.html",
      dist: "./",
      watch: "gulp/html/**/*.html"
    },
    images: {
      src: [
        "gulp/**/**/*.{jpg,jpeg,png,gif,tiff,svg}"
      ],
      dist: "local/templates/kdteam/",
      watch: "gulp/**/**/*.{jpg,jpeg,png,gif,tiff,svg}"
    },
    fonts: {
      src: [
        "gulp/fonts/**/*.{woff,woff2,eot,ttf,eot?#iefix}"
      ],
      dist: "local/templates/kdteam/fonts/",
      watch: "gulp/fonts/**/*.{woff,woff2,eot,ttf,eot?#iefix}"
    }
  };

function style() {
  return src(path.styles.src)
    .pipe(changed(path.styles.dist))
    .pipe(rigger())
    .pipe(plumber())
    .pipe(jshint())
    .pipe(sass())
    .pipe(postcss([ autoprefixer()]))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(plumber.stop())
    .pipe(dest(path.styles.dist))
}

function script() {
  return src(path.scripts.src)
    .pipe(changed(path.scripts.dist))
    .pipe(rigger())
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(jshint())
    .pipe(plumber.stop())
    .pipe(dest(path.scripts.dist))
}

function images() {
  return src(path.images.src)
    .pipe(imagemin([
      imageminMozjpeg({
          progressive: true,
          quality: 90
      }),

      imageminPngquant({
          speed: 5,
          quality: [0.8, 0.9]
      }),
      
      imagemin.svgo({
        plugins: [
            { removeViewBox: false },
            { removeUnusedNS: false },
            { removeUselessStrokeAndFill: false },
            { cleanupIDs: false },
            { removeComments: true },
            { removeEmptyAttrs: true },
            { removeEmptyText: true },
            { collapseGroups: true }
        ]
      })
  ]))
  .pipe(dest(path.images.dist))
}

function imageToWebp() {
  return src(path.images.src)
  .pipe(webp(
    imageminWebp({
      lossless: true,
      quality: 80,
      alphaQuality: 80
    })
  ))
  .pipe(dest(path.images.dist))
}

function fonts() {
  return src(path.fonts.src)
  .pipe(dest(path.fonts.dist))
}

// function fontawesomeIcon() {
//   return src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
//     .pipe(dest('local/templates/kdteam/webfonts/'));
// }


// DELETE FOLDER

function cleanAll() {
  return del([
    'local/templates/kdteam/**/*',
    '!local/templates/kdteam/components',
    '!local/templates/kdteam/includes',
    '!local/templates/kdteam/**/*.php'
  ]);
}

function cleanStyle() {
  return del('local/templates/kdteam/**/*.css');
}

function cleanScript() {
  return del('local/templates/kdteam/**/*.js');
}

function cleanImages() {
  return del('local/templates/kdteam/**/*.{jpg,jpeg,png,gif,tiff,svg,webp}');
}

// Watch files
function watchFiles() {
  watch(path.styles.watch, series(cleanStyle, style));
  watch(path.scripts.watch, series(cleanScript, script));
  watch(path.images.watch, series(cleanImages, images, imageToWebp));
  watch(path.fonts.watch, series(fonts));
}
  
// export tasks
exports.default = series(cleanAll, parallel(fonts, style, script, images, imageToWebp, watchFiles));