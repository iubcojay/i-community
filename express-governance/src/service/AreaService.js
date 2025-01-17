const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const jwtUtils = require( '../utils/JwtUtils.js')
const areaModel = require('../model/AreaModel.js')
const userModel = require('../model/UserModel.js')



function getFamilyAreaListByArea(area){
    const result = []
    const queue = []
    area = areaModel.selAreaById(area.id)
    // queue.push(area)
    let temp = area
    while(temp){
        result.push(temp)
        queue.push(...areaModel.selAreaListBySuperAreaId(temp.id))
        temp = queue.shift()
    }
    return fillArea(result)
}

function getSubAreaListByArea(area){
    const areaList = areaModel.selAreaListBySuperAreaId(area.id)
    return fillArea(areaList)
}

function getSupAreaByArea(area){
    const areaList = areaModel.selAreaBySubAreaId(area.id)
    return fillArea(areaList)
}

function getAreaById(id){
    return fillArea(areaModel.selAreaById(id))
}


function fillArea(value){
    if (_.isArray(value)) {
        value.forEach(area=>fillArea(area))
    }else{
        value.superArea = areaModel.selAreaById(value.superAreaId)
        value.adminUser = value.adminUserId.map(id=>userModel.selUserById(id))
    }
    return value
}

module.exports = {getSubAreaListByArea,getFamilyAreaListByArea,getAreaById,getSupAreaByArea}