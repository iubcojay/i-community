const fs = require('fs')
const path = require('path')
const imageryDataPath = path.resolve(__dirname, '../../dataset/imagery/data.json')
const commonUtils = require(path.resolve(__dirname, '../utils/CommonUtils.js'))

function selImageryList(){
    let imageryList = JSON.parse(fs.readFileSync(imageryDataPath, 'UTF-8'))
    return imageryList
}


module.exports = {selImageryList}
