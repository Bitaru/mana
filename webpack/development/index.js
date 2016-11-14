/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const base = require('../base/');
const plugins = require('./plugins');
const dependencyHandlers = require('./dll');

const hash = 'localIdentName=[local]_[hash:base64:5]';

module.exports = (options) => base({
  ...options,
  entry: [
    'webpack-hot-middleware/client',
    path.join(process.cwd(), `apps/${options.appName}/scripts/app.js`)
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: `${options.appName}.js`,
    chunkFilename: '[name].chunk.js',
  },

  // Add development plugins
  plugins: dependencyHandlers(options).concat(plugins(options)),

  // Load the CSS in a style tag in development
  localCssLoaders: `style-loader!css-loader?${hash}&modules&importLoaders=1!postcss-loader`,
  globalCssLoaders: `style-loader!css-loader!postcss-loader`,
  sassLoaders: `style-loader!css-loader?${hash}&modules&importLoaders=1!sass-loader?includePath[]=node_modules/react-toolbox/lib/`,

  // Tell babel that we want to hot-reload
  babelQuery: {
    cacheDirectory: true,
    presets: ['react-hmre']
  },

  // Emit a source map for easier debugging
  devtool: 'eval'
});
