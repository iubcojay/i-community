const express = require('express');
const router = express.Router()
const fs = require('fs')
const path = require('path')
const areaService = require('../service/AreaService.js');

router.post('/getSubAreaListById', function (req, res) {
    const id = Number(req.body.id)
    res.json(areaService.getSubAreaListByArea({id}))
})

router.post('/getSupAreaById', function (req, res) {
    const id = Number(req.body.id)
    res.json(areaService.getSupAreaByArea({id}))
})

router.post('/getFamilyAreaListByArea', function (req, res) {
    const id = Number(req.body.id)
    res.json(areaService.getFamilyAreaListByArea({id}))
})


router.post('/getAreaById', function (req, res) {
    const id = Number(req.body.id)
    res.json(areaService.getAreaById(id))
})



module.exports = router