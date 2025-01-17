const express = require('express');
const expressWs = require('express-ws');
const router = express.Router()
expressWs(router);
const { FactoryTable } = require('../sand_table/FactoryTable.js');
const sandTable = new FactoryTable();
const factoryService = require('../service/FactoryService.js');

router
    .ws('/sand_table', function (ws, req) {
        ws.onmessage = ({ data: msg }) => {
            const { tag } = JSON.parse(msg)
            if (tag === "begin") {
                sandTable.addWs(ws)
            }
        }

        ws.onclose = () => {
            sandTable.removeWs(ws)
        }
    })

router.get('/sand_table/interval', function (req, res) {
    res.json({ interval: sandTable.interval })
})

router.get('/vehicle/stop/:id', function (req, res) {
    const vehicleId = req.params.id;
    sandTable.stopVehicle(vehicleId);
    res.json({})
})

router.get('/vehicle/active/:id', function (req, res) {
    const vehicleId = req.params.id;
    sandTable.activeVehicle(vehicleId);
    res.json({})
})

router.get('/vehicle/broke/:id', function (req, res) {
    const vehicleId = req.params.id;
    sandTable.brokeVehicle(vehicleId);
    res.json({})
})

router.get('/truck/path/list', function (req, res) {
    res.json(factoryService.getTruckPathList())
})

router.get('/transport/accident/list', function (req, res) {
    res.json(factoryService.getAccidentList())
})

router.get('/transport/accident_factory/list', function (req, res) {
    res.json(factoryService.getFactoryAccidentList())
})

module.exports = router
