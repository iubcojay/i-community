const express = require('express');
const expressWs = require('express-ws');
const router = express.Router()
expressWs(router);

const { GarageTable } = require('../sand_table/garage/GarageTable');


const sandTable = new GarageTable();

router
    .ws('/status', function (ws, req) {
        ws.onmessage = ({ data: msg }) => {
            const { tag } = JSON.parse(msg)
            if (tag === "begin") {
                sandTable.addWs(ws)
                console.log("begin");
            }
        }

        ws.onclose = () => {
            sandTable.removeWs(ws)
            console.log("close");
        }
    })


router.get("/area", function (req, res) {
    res.send({ code: 200, data: sandTable.areaData })
})

router.get("/monitor", function (req, res) {
    res.send({ code: 200, data: sandTable.gateMonitorList })
})

router.post("/lifter/status/set", function (req, res) {
    let { id, status } = req.body
    sandTable.changeLifterStatus(id, status)
    sandTable.sendGarageMessage()
    res.send({ code: 200 })
})

router.get("/lifter/up/:id", function (req, res) {
    let id = req.params.id
    sandTable.upLifter(id)
    sandTable.sendGarageMessage()
    res.send({ code: 200 })
})

router.get("/lifter/down/:id", function (req, res) {
    let id = req.params.id
    sandTable.downLifter(id)
    sandTable.sendGarageMessage()
    res.send({ code: 200 })
})

router.get("/light/open/:id", function (req, res) {
    let id = req.params.id
    sandTable.openLight(id)
    sandTable.sendGarageMessage()
    res.send({ code: 200 })
})

router.get("/light/close/:id", function (req, res) {
    let id = req.params.id
    sandTable.closeLight(id)
    sandTable.sendGarageMessage()
    res.send({ code: 200 })
})

router.get("/conflict/end/:id", function (req, res) {
    let id = req.params.id
    sandTable.endConflict(id)
    sandTable.sendGarageMessage()
    res.send({ code: 200 })
})

router.get("/story/reset", function (req, res) {
    sandTable.resetStory()
    sandTable.sendGarageMessage()
    res.send({ code: 200 })
})



module.exports = router
