/**
 * WEBPACK DLL GENERATOR
 *
 * This profile is used to cache webpack's module
 * contexts for external library and framework type
 * dependencies which will usually not change often enough
 * to warrant building them from scratch every time we use
 * the webpack process.
 */

const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const exists = fs.existsSync;
const writeFile = fs.writeFileSync;
const defaults = require('lodash/defaultsDeep');
const chalk = require('chalk');
const webpack = require('webpack');

console.log(chalk.bold('\n👾  Building the Webpack DLL...\n'));

const buildDll = appName => {
  const pkg = require(path.resolve(process.cwd(), 'apps', appName, 'package.json'));
  const outputPath = pkg.dll.path;
  const dllManifestPath = path.join(outputPath, 'package.json')

  shelljs.mkdir('-p', outputPath)


  if (!exists(dllManifestPath)) {
    writeFile(
      dllManifestPath,
      JSON.stringify(defaults({
        name: `app-${appName}-dll`, // Your app name
        private: true,
        author: pkg.author,
        repository: pkg.repository,
        version: pkg.version
      }), null, 2),
      'utf8'
    );
  }

  return {
    context: process.cwd(),
    entry: {
      uscreenDeps: Object.keys(pkg.dependencies)
    },
    devtool: 'eval',
    output: {
      filename: '[name].dll.js',
      path: outputPath,
      library: '[name]',
    },
    node: {
      fs: 'empty'
    },
    module: {
      noParse: [
        /node_modules\/quill\/dist/,
        /node_modules\/video.js\/dist/
      ],
      loaders: [
        {
          // Transform our own .css files with PostCSS and CSS-modules
          test: /\.json/,
          loader: 'json-loader'
        }
      ]
    },
    plugins: [
      new webpack.DllPlugin({
        name: '[name]',
        path: path.join(outputPath, '[name].json')
      }), // eslint-disable-line no-new
    ]
  };
};

export default [/* app names */].map(buildDll);
