const AppConfig = require('../../config/AppConfig');
const fs = require('fs')
const path = require('path')

function camel(data) {
  if (typeof data != 'object' || !data) return data
  if (Array.isArray(data)) {
    return data.map(item => camel(item))
  }

  const newData = {}
  for (let key in data) {
    let newKey = key.replace(/_([a-z])/g, (p, m) => m.toUpperCase())
    newData[newKey] = camel(data[key])
  }
  return newData
}

function getSubStaticResource(staticUrl) {
  const staticResourcePath = AppConfig.staticResourcePath;
  const directoryPath = path.join(staticResourcePath, staticUrl)
  const files = fs.readdirSync(directoryPath);
  const subFileList = [];
  for (let file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    subFileList.push({
      name: file,
      path: filePath,
      type: stats.isDirectory() ? 'directory' : 'file'
    })
  }
  subFileList.sort((a, b) => {
    if (a === b) {
      return 0
    } else if (a === "directory") {
      return -1
    } else {
      return 1
    }

  })
  return subFileList;
}

module.exports = { camel, getSubStaticResource }
