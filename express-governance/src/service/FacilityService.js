const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const facilityModel = require('../model/FacilityModel.js')
const uuid = require('uuid')

function getFacilityList(){
   return facilityModel.selFacilityList()
}

function getFacilityTypeList(){
   return facilityModel.selFacilityTypeList()
}


function searchFacilityListByPage(keywords,type,pageNum,pageSize){
   let facilityList = facilityModel.selFacilityList().filter(facility=>(type === -1 || facility.type === type) && facility.id.includes(keywords))
   return {totalNum: facilityList.length, list:facilityList.slice((pageNum-1)*pageSize, pageNum * pageSize)}
}



module.exports = {getFacilityList,getFacilityTypeList,searchFacilityListByPage,searchFacilityListByPage}