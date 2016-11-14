// Important modules this config uses
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const base = require('../base/');
const plugins = require('./plugins');

const hash = 'localIdentName=[hash:base64:5]';

module.exports = options => base({
  ...options,

  entry: [
    path.join(process.cwd(), `apps/${options.appName}/scripts/app.js`)
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: `${options.appName}.[chunkhash].js`,
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  // We use ExtractTextPlugin so we get a seperate CSS file instead
  // of the CSS being in the JS and injected as a style tag

  localCssLoaders: ExtractTextPlugin.extract(
    'style-loader',
    `css-loader?modules&importLoaders=1&minimize&${hash}&importLoaders=1!postcss-loader`
  ),
  globalCssLoaders: ExtractTextPlugin.extract(
    'style-loader',
    `css-loader?`
  ),
  sassLoaders: ExtractTextPlugin.extract(
    'style-loader',
    `css-loader?modules&importLoaders=1&minimize&${hash}!sass-loader?includePath[]=node_modules/react-toolbox/lib/`
  ),

  babelQery: {
    plugins: [
      'transform-react-remove-prop-types',
      'transform-react-constant-elements',
      'transform-react-inline-elements'
    ]
  },

  plugins,
  stats: {
    hash: false,
    cached: false,
    cachedAssets: false,
    colors: true
  }
});
