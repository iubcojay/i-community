const fs = require('fs')
const path = require('path')
const truckPathDataPath = path.resolve(__dirname, '../../dataset/truck_path/data.json')
const commonUtils = require(path.resolve(__dirname, '../utils/CommonUtils.js'))

function selAllTruckPath() {
    let truckPathList = JSON.parse(fs.readFileSync(truckPathDataPath, 'UTF-8'))
    return truckPathList
}



module.exports = { selAllTruckPath }
