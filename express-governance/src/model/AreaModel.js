const fs = require('fs')
const path = require('path')
const areaDataPath = path.resolve(__dirname, '../../dataset/area/data.json')
const commonUtils = require(path.resolve(__dirname, '../utils/CommonUtils.js'))

function selAllAreas(){
    let areaList = JSON.parse(fs.readFileSync(areaDataPath, 'UTF-8'))
    return areaList
}

function selAreaById(id){
    let areaList = JSON.parse(fs.readFileSync(areaDataPath, 'UTF-8'))
    return areaList.find(area=>area.id === id)
}

function selAreaBySubAreaId(id){
    let areaList = JSON.parse(fs.readFileSync(areaDataPath, 'UTF-8'))
    const subArea = areaList.find(area=>area.id === id)
    const supArea = areaList.find(area=>area.id ===subArea.superAreaId)
    return supArea
}

function selAreaByAdminUserId(userId){
    let areaList = JSON.parse(fs.readFileSync(areaDataPath, 'UTF-8'))
    return areaList.find(area=>area.adminUserId.includes(userId))
}

function selAreaListBySuperAreaId(superAreaId){
    let areaList = JSON.parse(fs.readFileSync(areaDataPath, 'UTF-8'))
    return areaList.filter(area=>area.superAreaId === superAreaId)
}


module.exports = {selAllAreas,selAreaById,selAreaByAdminUserId,selAreaListBySuperAreaId,selAreaBySubAreaId}
