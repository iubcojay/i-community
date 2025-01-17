const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const {selAllTruckPath} = require('../model/TruckPathModel.js')
const {selAccidentList, selFactoryAccidentList} = require('../model/TransportAccidentModel.js')
const uuid = require('uuid')


function getTruckPathList() {
    return selAllTruckPath()
}

function getAccidentList() {
    return selAccidentList()
}

function getFactoryAccidentList() {
    return selFactoryAccidentList()
}


module.exports = {getTruckPathList, getAccidentList, getFactoryAccidentList}
