const inquirer = require('inquirer');
const shell = require('shelljs');
require('babel-register');

inquirer.prompt([
  {
    type: 'list',
    name: 'build',
    message: 'What we need to build?',
    choices: ['app', 'packages', 'dlls']
  }
]).then(function(answers){
  try{
    if(answers.build === 'packages') require('./scripts/packages').build();
    if(answers.build === 'dlls') {
      shell.exec(`cross-env BUILDING_DLL=true webpack --display-chunks --color --config .bin/webpack/webpack.dll.babel.js`);
    }
    if(answers.build === 'app') {
      inquirer.prompt([
        {
          type: 'list',
          name: 'app',
          message: 'Which appplication?',
          choices: [/* app names */]
        }, {
          type: 'list',
          name: 'env',
          message: 'For which environment we gonna build it?',
          choices: ['staging', 'production']
        }
      ]).then(function(answers){
        require('./scripts/apps.js').build(answers.app, answers.env);
      })
    }
  } catch (e){
    console.error(e)
  }
});
