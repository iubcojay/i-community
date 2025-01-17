const fs = require('fs')
const path = require('path')
const facilityDataPath = path.resolve(__dirname, '../../dataset/facility/data.json')
const facilityTypeDataPath = path.resolve(__dirname, '../../dataset/facility_type/data.json')
const commonUtils = require(path.resolve(__dirname, '../utils/CommonUtils.js'))

function selFacilityList(){
    let facilityList = JSON.parse(fs.readFileSync(facilityDataPath, 'UTF-8'))
    return facilityList
}

function selFacilityTypeList(){
    let facilityTypeList = JSON.parse(fs.readFileSync(facilityTypeDataPath, 'UTF-8'))
    return facilityTypeList
}

module.exports = {selFacilityList,selFacilityTypeList}
