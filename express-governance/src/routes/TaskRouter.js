const express = require('express');
const router = express.Router()
const fs = require('fs')
const path = require('path')
const taskDataPath = path.resolve(__dirname, '../../dataset/task/data.json')
const taskService = require('../service/TaskService.js');
const factoryService = require("../service/FactoryService");
const _ = require("lodash");

// 查询与用户相关的任务
router.post('/getRelatedTaskListByUserId', function (req, res) {
    const userId = Number(req.body.userId)
    const relatedTaskList = taskService.getRelatedTaskListByUserId(userId)
    res.json(relatedTaskList)
})

// ===================================================火灾处理==============================================================
// 更新数据时间戳
router.post('/street/updateAccidentTimeStamp', async (req, res) => {
    const { timeStamp } = req.body;
    console.log(timeStamp)
    try {
        // 调用 taskService 的方法来更新数据库中的时间戳
        await taskService.updateAccidentTime(timeStamp);
        res.send('success');
    } catch (error) {
        console.error('更新失败:', error);
        res.status(500).send('更新失败');
    }
});
// 获取新的数据时间戳
router.get('/street/getNewTimeStamp', function (req, res) {
    res.json(taskService.getNewTimeStamp())
})
// 一键发布任务
router.post('/street/sendFireTask', function (req, res) {
    let { title, description, status, createTime, scheduledTime, finishTime, participantInfo } = req.body;

    participantInfo = JSON.parse(participantInfo)
    status = Number(status)
    console.log(participantInfo)
    status = Number(status)
    taskService.addFireTask( title, description, status, createTime, scheduledTime, finishTime, participantInfo );
    let taskList = JSON.parse(fs.readFileSync(taskDataPath, 'UTF-8'))
    console.log(_.maxBy(taskList, task => task.id).id)
    let id = _.maxBy(taskList, task => task.id).id
    console.log("id",id)
    res.json({ status: 'success',  id });
})

// ===================================================街道==============================================================
// 创建任务
router.post('/street/postTask', function (req, res) {
    let {title,description,scheduledTime,streetIdList,streetUserIdList,committeeIdList,committeeUserIdList} = req.body
    streetIdList = JSON.parse(streetIdList)
    streetUserIdList = JSON.parse(streetUserIdList)
    committeeIdList = JSON.parse(committeeIdList)
    committeeUserIdList = JSON.parse(committeeUserIdList)
    taskService.addTask(title,description,scheduledTime,streetIdList,streetUserIdList,committeeIdList,committeeUserIdList)
    res.send('success')
})


// ===================================================居委会==============================================================
// 接受任务
router.post('/committee/accept',function(req, res) {
    const taskId = Number(req.body.taskId)
    const userId = Number(req.body.userId)
    taskService.acceptTask(taskId,userId)
    res.send('success')
})

// 委派任务
router.post('/committee/appoint',function(req, res) {
    const taskId = Number(req.body.taskId)
    console.log("userId",req.body.userId)
    console.log("taskId",req.body.taskId)
    const userId = Number(req.body.userId)
    console.log("居委会委派的信息",req.body.participantList)
    const participantList = JSON.parse(req.body.participantList)
    taskService.appointTask(taskId,userId,participantList)
    res.send('success')
})


// ===================================================网格管理员==============================================================
// 接受任务
router.post('/cell/accept',function(req, res) {
    const taskId = Number(req.body.taskId)
    console.log("============================================")
    console.log("接收userId",req.body.userId)
    console.log("接收taskId",req.body.taskId)
    const userId = Number(req.body.userId)
    taskService.acceptTask(taskId,userId)
    res.send('success')
})


// 委派任务
router.post('/cell/appoint',function(req, res) {
    const taskId = Number(req.body.taskId)
    const userId = Number(req.body.userId)
    console.log("委派userId",req.body.userId)
    console.log("委派taskId",req.body.taskId)
    console.log("网格管理员委派的信息",req.body.participantList)
    const participantList = JSON.parse(req.body.participantList)
    taskService.appointTaskToGrid(taskId,userId,participantList)
    res.send('success')
})



// ===================================================网格员==============================================================
// 接受任务
router.post('/grid/accept',function(req, res) {
    const taskId = Number(req.body.taskId)
    const userId = Number(req.body.userId)
    const plan = req.body.plan
    taskService.gridAcceptTask(taskId,userId,plan)
    res.send('success')
})


// 提交任务
router.post('/grid/finish',function(req, res) {
    const taskId = Number(req.body.taskId)
    const userId = Number(req.body.userId)
    const result = req.body.result
    taskService.gridFinishTask(taskId,userId,result)
    res.send('success')
})




module.exports = router
