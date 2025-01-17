const express = require('express');
const router = express.Router()
const fs = require('fs')
const path = require('path')
const userService = require('../service/UserService.js');


router.post('/getTokenByUser', function (req, res) {
    const username = req.body.username
    const password = req.body.password
    res.send(userService.getTokenByUser({username,password}))
})


router.post('/getTokenByAdminUser', function (req, res) {
    const username = req.body.username
    const password = req.body.password
    res.send(userService.getTokenByAdminUser({username,password}))
})


router.post('/getUserByToken', function (req, res) {
    const token = req.body.token
    let user = userService.getUserByToken(token)
    res.json(user)
})




router.post('/getUserById', function (req, res) {
    const id = Number(req.body.id)
    let user = userService.getUserById(id)
    res.json(user)
})


module.exports = router