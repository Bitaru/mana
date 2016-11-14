import path from 'path';
import portastic from 'portastic';
import webpack from 'webpack';
import dotenv from 'dotenv';
import chalk from 'chalk';
import inquirer from 'inquirer';
import shell from 'shelljs';
import webpackStats from '../helpers/webpackStats';
import getConfig from '../helpers/getConfig';

const clearDist = appName => shell.rm('-rf', `build/${appName}/*`);

const getPort = (port, cb) => {
  portastic.test(port).then(open => open ? cb(port) : getPort(port + 1, cb))
};

const askForDeploy = (appName, env) => {
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'deploy',
      message: `Deploy build to ${env}?`,
      default: false
    }
  ]).then(answer => {
    if (!answer.deploy) return;
    console.log(chalk.bold(`\n📥  Ok, deploying ${chalk.green(appName)} to ${chalk.green(env)} ... \n`));
    shell.exec(`bundle exec cap ${env} deploy:${appName}`);
  })
}

export function watch(appName) {
  getPort(3000, port => require('../server')(getConfig(appName, null, port)))
}

export function build(appName, env) {
  clearDist(appName);
  console.log(chalk.bold(`\n🚀  Start building ${chalk.green(appName)} for ${chalk.green(env)} ... \n`));
  const config = getConfig(appName, env);
  webpack(require('../webpack/production')(config))
  .run((err, stats) => {
    if (err) return console.error(err);
    console.log(stats.toString(webpackStats));
    if (stats.hasErrors()) return;
    console.log(chalk.bold(`🎉  ${chalk.green(appName)} is builded for ${chalk.green(env)}!`));
    askForDeploy(appName, env);
  });
}
