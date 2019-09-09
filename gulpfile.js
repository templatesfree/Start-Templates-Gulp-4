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
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const postcss = require('gulp-postcss');
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
    images: {
      src: [
        "gulp/**/**/*.{jpg,jpeg,png,gif,tiff,svg}"
      ],
      dist: "local/templates/kdteam/",
      watch: "gulp/**/**/*.{jpg,jpeg,png,gif,tiff,svg}"
    },
    fonts: {
      src: [
        "gulp/kdteam/fonts/*.{woff,woff2}"
      ],
      dist: "local/templates/kdteam/fonts/",
      watch: "gulp/kdteam/fonts/*.{woff,woff2}"
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
    .pipe(plumber())
    .pipe(rigger())
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
          quality: 60
      }),

      imageminPngquant({
          speed: 5,
          quality: [0.6, 0.8]
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
      quality: 60,
      alphaQuality: 60
    })
  ))
  .pipe(dest(path.images.dist))
}

function fonts() {
  return src(path.fonts.src)
  .pipe(dest(path.fonts.dist))
}


// DELETE FOLDER

function cleanAll() {
  return del(['local/templates/kdteam/**', '!local/templates/kdteam/components']);
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
  watch(path.styles.watch, parallel(cleanStyle, style));
  watch(path.scripts.watch, parallel(cleanScript, script));
  watch(path.images.watch, parallel(cleanImages, images, imageToWebp));
  watch(path.fonts.watch, parallel(fonts));
}
  
// export tasks
exports.default = series(cleanAll, parallel(style, script, images, imageToWebp, fonts, watchFiles));