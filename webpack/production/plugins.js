const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const cssnano = require('cssnano');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = [

  // Show progress bar
  new ProgressBarPlugin(),

  // Import just english locale for moment.js
  new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en-gb)$/),

  // OccurrenceOrderPlugin is needed for long-term caching to work properly.
  new webpack.optimize.OccurrenceOrderPlugin(true),

  // Merge all duplicate modules
  new webpack.optimize.DedupePlugin(),

  // Minify and optimize the JavaScript
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    minimize: true,
    output: {
      comments: false
    },
    compress: {
      warnings: false,
      screw_ie8: true,
      sequences: true,
      dead_code: true,
      drop_debugger: true,
      comparisons: true,
      conditionals: true,
      evaluate: true,
      booleans: true,
      loops: true,
      unused: true,
      hoist_funs: true,
      if_return: true,
      join_vars: true,
      cascade: true,
      drop_console: true
    }
  }),

  // Create favicon for project
  new FaviconsWebpackPlugin({
    logo: path.resolve(process.cwd(), 'shared/statics/logo.png'),
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      opengraph: false,
      twitter: false,
      yandex: false,
      windows: false
    }
  }),

  // Minify and optimize the index.html
  new HtmlWebpackPlugin({
    template: path.resolve(process.cwd(), 'shared/templates/index.html'),
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    },
    inject: true
  }),

  // Extract the CSS into a seperate file
  new ExtractTextPlugin('styles.[contenthash].css'),

  // After styles are extracted we ninify them with cssnano
  new OptimizeCssAssetsPlugin({
    cssProcessor: cssnano,
    cssProcessorOptions: {
      autoprefixer: false,
      discardDuplicates: true,
      discardUnused: true,
      mergeRules: true,
      mergeLonghand: true,
      minifyFontValues: true,
      minifyGradients: true,
      discardComments: {
        removeAll: true
      }
    },
    canPrint: true
  }),

  // Prepare gziped js and css for nginx
  new CompressionPlugin({
    asset: '[file].gz',
    algorithm: 'gzip',
    regExp: /\.(js|css|html)$/,
    threshold: 10240,
    minRatio: 0.8
  }),

];
