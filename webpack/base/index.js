/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const postcss = require('./postcss');
const getLoaders = require('./loaders');
const getPlugins = require('./plugins');

module.exports = (options) => ({
  entry: options.entry,

  output: ({
    ...options.output,
    path: path.resolve(process.cwd(), 'build', options.appName),
    publicPath: options.publicPath
  }),

  node: {
    fs: 'empty'
  },

  module: { loaders: getLoaders(options) },
  plugins: getPlugins(options),

  resolve: {
    unsafeCache: true,

    modules: [
      path.resolve(process.cwd(), `apps/${options.appName}/scripts`),
      path.resolve(process.cwd(), 'shared/scripts'),
      path.resolve(process.cwd(), 'packages'),
      path.resolve(process.cwd(), 'node_modules')
    ],
    extensions: [
      '',
      '.js',
      '.css'
    ],
    packageMains: [
      'jsnext:main',
      'main'
    ],
    alias: {
      variables: path.resolve(process.cwd(), 'shared/styles/variables.css'),
      styles: path.resolve(process.cwd(), 'shared/styles'),
      assets: path.resolve(process.cwd(), `apps/${options.appName}/assets`),
      '@player': path.resolve(process.cwd(), `packages/player/src`)
    }
  },

  sassLoader: {
    data: `@import '${path.resolve(process.cwd(), 'shared/styles/toolbox.scss')}';`
  },

  postcss,
  devtool: options.devtool,
  target: 'web',
  stats: false, // Don't show stats in the console
  progress: true
});
