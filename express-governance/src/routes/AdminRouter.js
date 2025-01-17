const express = require('express');
const router = express.Router()
const fs = require('fs')
const path = require('path')
const facilityService = require('../service/FacilityService.js');
const imageryService = require('../service/ImageryService.js');

router.post('/facility/list', function (req, res) {
    res.json(facilityService.getFacilityList())
})

router.post('/facilityType/list', function (req, res) {
    res.json(facilityService.getFacilityTypeList())
})


router.post("/facility/search/page", function (req, res) {
    const pageNum = Number(req.body.pageNum)
    const pageSize = Number(req.body.pageSize)
    const keywords = String(req.body.keywords)
    const type = Number(req.body.type)
    res.json(facilityService.searchFacilityListByPage(keywords, type, pageNum, pageSize))
})

router.post("/imagery/search/page", function (req, res) {
    const pageNum = Number(req.body.pageNum)
    const pageSize = Number(req.body.pageSize)
    const keywords = String(req.body.keywords)
    res.json(imageryService.searchImageryListByPage(keywords, pageNum, pageSize))
})

router.post("/imagery/sub/list", function (req, res) {
    const url = String(req.body.url)
    res.json({ list:  imageryService.getSubStaticResource(url) })
})


module.exports = router

