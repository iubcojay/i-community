const express = require('express');
const router = express.Router()
const fs = require('fs')
const path = require('path')
const taskService = require('../service/TaskService.js');

// 查询与用户相关的任务
// router.get('/testDetail', function (req, res) {
//     res.json(taskService.getFakeInterviewInformation())

// })
router.get('/hello', function (req, res) {
    res.json("hello world!")
})


module.exports = router
