import path from 'path';
import dotenv from 'dotenv';

const packageJson = require(path.resolve(process.cwd(), 'package.json'));

module.exports = (appName, env, port) => {
  if (env) dotenv.config(packageJson.environment[env]);
  dotenv.load();

  const pkg = require(path.resolve(process.cwd(), 'apps', appName, 'package.json'));

  return {
    pkg,
    appName,
    publicPath: env ? pkg.publicPath[env] : `http://localhost:${port}/`,
    port,
    globals: {
      __PRODUCTION__: !!env,
      __DEVELOPMENT__: !env,
      __PROFILE__: false
    },
    settings: {
      root: JSON.stringify(process.env.ROOT),
      apiRoot: JSON.stringify(process.env.API_ROOT),
      analyticsApiRoot: JSON.stringify(process.env.ANALYTICS_API_ROOT),
      playerRoot: JSON.stringify(process.env.PLAYER_ROOT)
    }
  };
}
