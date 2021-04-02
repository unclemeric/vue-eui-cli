const fs = require('fs')
const rm = require('rimraf').sync
const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')
const home = require('user-home')
const fileUtil = require('./common')

module.exports = async function (rawName, dirTemplates) {
  const isCurrentDir = !rawName || rawName === '.' || rawName === './'
  const projectName = isCurrentDir ? path.relative('../', process.cwd()) : rawName
  const to = path.resolve(projectName || '.')

  if (fs.existsSync(to)) {
    inquirer
      .prompt([
        {
          type: 'confirm',
          message: isCurrentDir ? 'Generate project in current directory?' : 'Target directory exists, Continue?',
          name: 'continue'
        }
      ])
      .then(answers => {
        if (answers.continue) {
          fileUtil.generate(dirTemplates, to, projectName)
          console.log(chalk.green('项目新建成功！'))
        }
      })
      .catch(function (err) {
        console.error(chalk.red(err))
      })
    // cmd.run(`mkdir ${home}/vue-eui-template`, function(err, data) {
  } else {
    fileUtil.generate(dirTemplates, to, projectName)
    console.log(chalk.green('项目新建成功！'))
  }
}
