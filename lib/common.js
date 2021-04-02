const fs = require('fs')
const path = require('path')

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
    } else if (fs.statSync(cachePath + '/' + file).isDirectory()) {
      var filePath = toPath + '/' + file
      mkdir(filePath)
      generate(cachePath + '/' + file, filePath, projectName)
    }
  })
}

module.exports = { mkdir, generate }
