module.exports = (options) => [
  {
    test: /\.js$/, // Transform all .js files required somewhere with Babel
    loader: 'babel',
    exclude: /node_modules/,
    query: options.babelQuery,
  },
  {
    // Transform our own .css files with PostCSS and CSS-modules
    test: /^((?!global).)*\.css/,
    loader: options.localCssLoaders,
    exclude: /node_modules/
  },
  {
    test: /\.global\.css/,
    loaders: options.globalCssLoaders,
    exclude: /node_modules/
  },
  {
    test: /\.css$/,
    include: /node_modules/,
    loaders: options.globalCssLoaders,
  },
  {
    test: /\.scss$/,
    loader: options.sassLoaders,
    include: /node_modules\/react-toolbox\/lib/
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader?name=[hash:base64:5].[ext]'
  },
  {
    test: /\.(jpg|png|gif)$/,
    loaders: [
      'file-loader?name=[hash:base64:5].[ext]',
      'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
    ]
  },
  {
    test: /\.html$/,
    loader: 'html-loader'
  },
  {
    test: /\.json$/,
    loader: 'json-loader'
  },
  {
    test: /\.(mp4|webm)$/,
    loader: 'url-loader?limit=10000'
  }
];
