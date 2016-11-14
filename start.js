const inquirer = require('inquirer');
require('dotenv').load();
require('babel-register');

inquirer.prompt([
  {
    type: 'list',
    name: 'app',
    message: 'Which application you will develop?',
    choices: ['publisher', 'platform']
  }
]).then(function (answers) {
  try{
    require('./scripts/apps').watch(answers.app);
  } catch (e) {
    console.error(e);
  }
});
