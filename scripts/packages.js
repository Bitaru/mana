import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';

function dunBuilder(configPath, name) {
  console.log(chalk.bold(`\n👾  Building the '${chalk.green(name)}' package...\n`))
  shell.exec(`webpack --config ${configPath} -p --color`);
}

export function build(){
  const ROOT = path.resolve(process.cwd(), 'packages');
  const packageInnerFolders = fs.readdirSync(ROOT);
  const packagesConfigs =
    packageInnerFolders
    .map(dir => ({ path: path.join(ROOT, dir, 'webpack.config.babel.js'), name: dir }))
    .filter(pack => fs.existsSync(pack.path))
  if (packagesConfigs.length > 1) {
    inquirer.prompt([{
        type: 'list',
        name: 'packages',
        message: 'Whitch package we should build?',
        choices: ['Build all', ...packagesConfigs.map(pack => pack.name)]
    }]).then(function(answer){
      if (answer.packages === 'Build all') {
        packagesConfigs.forEach(config => dunBuilder(config.path))
      } else {
        dunBuilder(packagesConfigs.find(({ name }) => name === answer.packages));
      }
    })
  } else {
    dunBuilder(packagesConfigs[0].path, packagesConfigs[0].name)
  }
}
