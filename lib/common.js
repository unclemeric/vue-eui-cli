const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const inquirer = require('inquirer')
const QueueCmd = require('node.cmd').QueueCmd
const ins = new QueueCmd()

const copyTemplate = function (from, to, projectName) {
  write(to, fs.readFileSync(path.resolve(from), 'utf-8'), projectName)
}

const write = function (path, str, projectName) {
  str = str.replace(/element-ui-admin-template/g, projectName)
  str = str.replace(/element-ui-admin-auth-template/g, projectName)
  fs.writeFileSync(path, str)
}

const mkdir = function (path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}

const generate = function (cachePath, toPath, projectName) {
  var files = fs.readdirSync(cachePath) // 读取模板文件
  files.forEach(function (file) {
    if (['.history', 'node_modules', 'dist', '.lock', '.log', '.git'].indexOf(file) !== -1) {
      return false
    }
    if (fs.statSync(cachePath + '/' + file).isFile()) {
      mkdir(toPath)
      copyTemplate(cachePath + '/' + file, toPath + '/' + file, projectName)
      console.log(chalk.green(`创建文件${toPath + '/' + file}`))
    } else if (fs.statSync(cachePath + '/' + file).isDirectory()) {
      var filePath = toPath + '/' + file
      mkdir(filePath)
      console.log(chalk.green(`创建目录${filePath}`))
      generate(cachePath + '/' + file, filePath, projectName)
    }
  })
}

const pullTemplate = function (projectName, tempPath, isAuth) {
  const createProject = require('./create')
  console.log(chalk.green('正在下载模板'))
  ins.queue(
    `git clone ${
      isAuth
        ? 'http://10.0.82.113/hwagain-FE/element-ui-admin-auth-template.git'
        : 'https://github.com/unclemeric/element-ui-admin-template.git'
    } ${tempPath}`,
    function (data) {
      if (data.err.error) {
        console.log(chalk.red(data.err.error))
        inquirer
          .prompt([
            {
              type: 'confirm',
              message: '拉取模板失败，是否再次拉取?',
              name: 'continue'
            }
          ])
          .then(answers => {
            if (answers.continue) {
              pullTemplate(projectName, tempPath, isAuth)
            } else {
              process.exit(6)
            }
          })
          .catch(function (err) {
            console.error(chalk.red(err))
          })
      } else {
        console.log(chalk.green('模板下载完成，正在创建项目...'))
        createProject(projectName, tempPath)
      }
    }
  )
}

module.exports = { mkdir, generate, pullTemplate }
