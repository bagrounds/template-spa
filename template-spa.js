/**
 * Main file for this single page application (SPA).
 *
 * @module template-spa
 */
(function () {

  var express = require('express')
  var serveStatic = require('serve-static')
  var pkg = require('./package')

  var isProductionMode = (process.env.NODE_ENV === 'production')

  var PORT = (isProductionMode) ? 8000 : 8001

  console.log('Running on port ' + PORT)

  var app = express()

  setupEnvironment(app)

  var serveOptions = {
    index: ['index.html'],
    extensions: ['html']
  }

  if (!isProductionMode) {
    serveOptions.index = ['index-dev.html']
  }

  // Serve public folder
  var serve = serveStatic('public', serveOptions)

  app.use(serve)

  app.listen(PORT)


  /**
   * If not in production mode, use browser sync for rapid development
   *
   * @param {Object} app the Express app to use
   */
  function setupEnvironment(app) {
    if (!isProductionMode) {
      /* imports for dev mode */
      var browserSync = require('browser-sync')
      var connectBrowserSync = require('connect-browser-sync')

      var WATCH_FILES = [
        'public/*.html',
        'public/css/*.css',
        'public/js/*.js',
        'lib/*.js',
        pkg.main
      ]

      var browserSyncOptions = {
        logSnippet: false,
        files: WATCH_FILES
      }

      browserSync(browserSyncOptions)

      var connectBrowserSyncMiddleware = connectBrowserSync(browserSync)

      app.use(connectBrowserSyncMiddleware)
    }
  }
})()


