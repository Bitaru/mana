/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const ngrok = (process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();

function init(config) {
  setup(app, {
    ...config,
    outputPath: resolve(process.cwd(), 'build', config.pkg.name)
  });

  // get the intended port number, use port 3000 if not provided
  const port = config.port || process.env.PORT || 3000;

  // Start your app.
  const server = app.listen(port, (err) => {
    if (err) {
      return logger.error(err.message);
    }

    // Connect to ngrok in dev mode
    if (ngrok) {
      ngrok.connect(port, (innerErr, url) => {
        if (innerErr) {
          return logger.error(innerErr);
        }

        logger.appStarted(port, url);
      });
    } else {
      logger.appStarted(port);
    }
  });

  process.on('exit', () => {
    console.log('About to exit, waiting for remaining connections to complete');
    server.close(() => {
      console.log(`Ok, port ${port} is free now!`);
      return false;
    });
  });
}

export default init;
