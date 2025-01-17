const fs = require('fs')
const path = require('path')
const taskDataPath = path.resolve(__dirname, '../../dataset/task/data.json')
const commonUtils = require(path.resolve(__dirname, '../utils/CommonUtils.js'))
const _ = require('lodash')

// 增
function insertTask(task) {
    let taskList = JSON.parse(fs.readFileSync(taskDataPath, 'UTF-8'))
    if (taskList.length === 0) {
        task.id = 1
    } else {
        task.id = _.maxBy(taskList, task => task.id).id + 1
    }
    taskList.push(task)
    fs.writeFileSync(taskDataPath, JSON.stringify(taskList))
    return "insert 1 task"
}


// 改
function updateTask(task) {
    let taskList = JSON.parse(fs.readFileSync(taskDataPath, 'UTF-8'))
    const index = taskList.findIndex(item => item.id === task.id)
    taskList.splice(index, 1, task)
    fs.writeFileSync(taskDataPath, JSON.stringify(taskList))
    return "update 1 task"
}

// 查
function selTaskList() {
    let taskList = JSON.parse(fs.readFileSync(taskDataPath, 'UTF-8'))
    return taskList
}

function selTaskById(id){
    let taskList = JSON.parse(fs.readFileSync(taskDataPath, 'UTF-8'))
    return taskList.find(task=>task.id === id)
}



module.exports = { insertTask, selTaskList, updateTask,selTaskById}
