const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const logger = require('../../server/logger');

module.exports = (options) => {

  // Don't do anything during the DLL Build step
  if (process.env.BUILDING_DLL) { return []; }

  // If the package.json does not have a dllPlugin property, use the CommonsChunkPlugin
  if (!options.pkg.dll) {
    return [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 2,
        async: true
      })
    ];
  }

  const dllPath = path.resolve(process.cwd(), `node_modules/uscreen-${options.appName}-dll`);

  /**
   * If DLLs aren't explicitly defined, we assume all production dependencies listed in package.json
   * Reminder: You need to exclude any server side dependencies by listing them in dllConfig.exclude
   *
   * @see https://github.com/mxstbr/react-boilerplate/tree/master/docs/general/webpack.md
   */
  if (options.pkg.dll) {
    const manifestPath = path.resolve(dllPath, 'uscreenDeps.json');
    if (!fs.existsSync(manifestPath)) {
      logger.error('The DLL manifest is missing. Please run `npm run build:dll`');
      process.exit(0);
    }

    return [
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require(manifestPath) // eslint-disable-line global-require
      })
    ];
  }

  // If DLLs are explicitly defined, we automatically create a DLLReferencePlugin for each of them.
  // const dllManifests = path.join(dllPath, `/uscreenDeps.json`));
  //
  // return dllManifests.map(manifestPath => {
  //   if (!fs.existsSync(path)) {
  //     if (!fs.existsSync(manifestPath)) {
  //       logger.error(`The following Webpack DLL manifest is missing: ${path.basename(manifestPath)}`);
  //       logger.error(`Expected to find it in ${dllPath}`);
  //       logger.error('Please run: npm run build:dll');
  //
  //       process.exit(0);
  //     }
  //   }
  //
  //   return new webpack.DllReferencePlugin({
  //     context: process.cwd(),
  //     manifest: require(manifestPath), // eslint-disable-line global-require
  //   });
  // });
};
