;(function () {
  'use strict'

  /* imports */
  var gulp = require('gulp')
  var stylus = require('gulp-stylus')
  var pug = require('gulp-pug')
  var browserify = require('browserify')
  var source = require('vinyl-source-stream')
  // var copy = require('gulp-copy')
  var del = require('del')

  var TASK = {
    MAKE_CLEAN: {
      NAME: 'clean',
      SOURCE: 'public',
      FUNCTION: makeClean,
      DEFAULT: false,
      WATCH: false
    },
    MAKE_JS: {
      NAME: 'js',
      SOURCE: 'src/js/index.js',
      OUTPUT: 'public/js',
      FUNCTION: makeJs,
      DEFAULT: true,
      WATCH: true
    },
    MAKE_CSS: {
      NAME: 'css',
      SOURCE: 'src/styles/*.styl',
      OUTPUT: 'public/css',
      FUNCTION: makeCss,
      DEFAULT: true,
      WATCH: true
    },
    MAKE_HTML: {
      NAME: 'html',
      SOURCE: 'src/views/*.pug',
      OUTPUT: 'public',
      FUNCTION: makeHtml,
      DEFAULT: true,
      WATCH: true
    }
  }

  var WATCH_TASKS = []
  var DEFAULT_TASKS = []

  // make an array of the above tasks
  var TASKS = Object.keys(TASK).map(function (taskKey) {
    return TASK[taskKey]
  })

  // create each gulp task
  TASKS.forEach(function (task) {
    if (task.DEFAULT) {
      DEFAULT_TASKS.push(task.NAME)
    }

    if (task.WATCH) {
      WATCH_TASKS.push(task)
    }

    gulp.task(task.NAME, task.FUNCTION)
  })

  gulp.task('default', DEFAULT_TASKS)

  gulp.task('watch', function watch () {
    WATCH_TASKS.forEach(function (task) {
      gulp.watch(task.SOURCE, [task.NAME])
    })
  })

  function makeCss () {
    gulp.src(TASK.MAKE_CSS.SOURCE)
      .pipe(stylus({
        compress: false,
        paths: [
          'src/styles'
        ],
        compile: function (str, path) {
          return stylus(str)
            .set('filename', path)
        }
      }))
      .pipe(gulp.dest(TASK.MAKE_CSS.OUTPUT))
  }

  function makeHtml () {
    gulp.src(TASK.MAKE_HTML.SOURCE)
      .pipe(pug())
      .pipe(gulp.dest(TASK.MAKE_HTML.OUTPUT))
  }

  function makeJs () {
    return browserify(TASK.MAKE_JS.SOURCE)
      .bundle()
      .on('error', function (error) {
        console.error(error)
      })
      .pipe(source('index.js'))
      .pipe(gulp.dest(TASK.MAKE_JS.OUTPUT))
  }

  function makeClean () {
    return del([
      TASK.MAKE_CLEAN.SOURCE
    ])
  }
})()

