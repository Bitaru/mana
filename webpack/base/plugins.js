const webpack = require('webpack');

module.exports = options => [
  new webpack.ProvidePlugin({
    React: 'react',
    Helmet: 'react-helmet'
  }),

  new webpack.DefinePlugin({
    ...options.globals,
    settings: options.settings,
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),

  ...options.plugins
];
