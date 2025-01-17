const fs = require('fs')
const path = require('path')
const areaModel = require('../model/AreaModel')
const transportAccidentModel = require('../model/TransportAccidentModel')
const taskModel = require('../model/TaskModel')
const _ = require('lodash');
const moment = require('moment');

function getNewTimeStamp(){
    return transportAccidentModel.getNewTimeStamp();
}
function updateAccidentTime(newFireTimeStamp){
    transportAccidentModel.updateAccidentList(newFireTimeStamp);
}
function addFireTask(title, description, status, createTime, scheduledTime, finishTime, participantInfo) {
    // 解析 participantInfo 中的数据
    participantInfo = participantInfo.map(participant => ({
        areaId: participant.areaId,
        userId: participant.userId,
        acceptTime: participant.acceptTime,
        finishTime: participant.finishTime,
        status: participant.status
    }));
    const task = {
        id: -1,
        title,
        description,
        status, // 默认状态为进行中 (1)
        createTime,
        scheduledTime,
        finishTime,
        participantInfo
    };

    taskModel.insertTask(task);
}

function addTask(title, description, scheduledTime, streetIdList, streetUserIdList, committeeIdList, committeeUserIdList) {
    const task = {
        id: -1,
        title,
        description,
        // 1进行中，-1已结束
        status: 1,
        createTime: new Date(),
        scheduledTime,
        finishTime: null,
        participantInfo: []
    }

    task.participantInfo.push(
        ...streetIdList.map((streetId, index) => {
            return {
                areaId: streetId,
                userId: streetUserIdList[index],
                acceptTime: task.createTime,
                finishTime: task.createTime,
                status: 2
            }
        }),
        ...committeeIdList.map((committeeId, index) => {
            return {
                areaId: committeeId,
                userId: committeeUserIdList[index],
                acceptTime: null,
                finishTime: null,
                status: 0
            }
        })
    )
    taskModel.insertTask(task)
}

function getRelatedTaskListByUserId(userId) {
    let taskList = taskModel.selTaskList()
    taskList = taskList.filter(task => {
        return task.participantInfo.findIndex(participant => participant.userId === userId) !== -1
    })
    return taskList
}

function acceptTask(taskId, userId) {
    const task = taskModel.selTaskById(taskId)
    const participant = task.participantInfo.find(item => item.userId === userId)
    participant.status = 1
    participant.acceptTime = new Date()
    taskModel.updateTask(task)
}


function appointTask(taskId, userId, participantList) {
    const task = taskModel.selTaskById(taskId)
    const participant = task.participantInfo.find(item => item.userId === userId)
    participant.finishTime = new Date()
    participant.status = 2
    participantList.forEach(p => {
        task.participantInfo.push({
            areaId: p.areaId,
            userId: p.userId,
            acceptTime: null,
            finishTime: null,
            status: 0
        })
    });
    taskModel.updateTask(task)
}

function appointTaskToGrid(taskId, userId, participantList) {
    const task = taskModel.selTaskById(taskId)
    const participant = task.participantInfo.find(item => item.userId === userId)
    participant.finishTime = new Date()
    participant.status = 2
    participantList.forEach(p => {
        task.participantInfo.push({
            areaId: p.areaId,
            userId: p.userId,
            acceptTime: new Date(),
            finishTime: null,
            status: 0,
            plan: "",
            result: "",
            interviewPath: "",
            interviewInfo: ""
        })
    });
    taskModel.updateTask(task)
}

function gridAcceptTask(taskId, userId, plan) {
    const task = taskModel.selTaskById(taskId)
    const participant = task.participantInfo.find(item => item.userId === userId)
    participant.status = 1
    participant.acceptTime = new Date()
    participant.plan = plan

    // 添加假的巡访轨迹
    participant.interviewPath = getFakeInterviewPath()

    // 添加假的信息采集情况
    participant.interviewInfo = getFakeInterviewInformation()

    taskModel.updateTask(task)
}

function gridFinishTask(taskId, userId, result) {
    const task = taskModel.selTaskById(taskId)
    const participant = task.participantInfo.find(item => item.userId === userId)
    participant.status = 2
    participant.result = result
    participant.finishTime = new Date()

    // 判断任务是否全部完成
    const ifTaskFinish = _.every(task.participantInfo, participant => participant.status === 2)
    if (ifTaskFinish) {
        task.finishTime = new Date()
        task.status = 2
    }
    taskModel.updateTask(task)
}


// 获取假的巡访轨迹
function getFakeInterviewPath() {

    //伪造路径信息

    let pathInfo = [
        {
            currentBuilding: {
                "id": 1,
                "name": "一号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": "{\r\n\t\"xbsjType\": \"ClassificationPolygon\",\r\n\t\"name\": \"一号楼\",\r\n\t\"positions\": [\r\n\t\t2.042804317855282,\r\n\t\t0.6398840436683026,\r\n\t\t2.0428046034982046,\r\n\t\t0.6398816518944798,\r\n\t\t2.0428134636956674,\r\n\t\t0.6398823070947697,\r\n\t\t2.0428132095547076,\r\n\t\t0.6398845390625975\r\n\t],\r\n\t\"height\": 29.103914916475517,\r\n\t\"color\": [\r\n\t\t0.3176470588235294,\r\n\t\t0.42745098039215684,\r\n\t\t0.9058823529411765,\r\n\t\t0.51\r\n\t],\r\n\t\"outline\": {}\r\n}",
            },
            currentFloor: {
                id: 1,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "1-1",
                    "positions": [
                        2.04280484309749,
                        0.639881669957266,
                        2.0428133275673135,
                        0.6398822168013933,
                        2.0428130775346722,
                        0.6398845192237631,
                        2.042804632411323,
                        0.6398839677074695
                    ],
                    "height": 11.562078136009863,
                    "outline": {}
                })
            }
        },

        {
            currentBuilding: {
                "id": 1,
                "name": "一号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": "{\r\n\t\"xbsjType\": \"ClassificationPolygon\",\r\n\t\"name\": \"一号楼\",\r\n\t\"positions\": [\r\n\t\t2.042804317855282,\r\n\t\t0.6398840436683026,\r\n\t\t2.0428046034982046,\r\n\t\t0.6398816518944798,\r\n\t\t2.0428134636956674,\r\n\t\t0.6398823070947697,\r\n\t\t2.0428132095547076,\r\n\t\t0.6398845390625975\r\n\t],\r\n\t\"height\": 29.103914916475517,\r\n\t\"color\": [\r\n\t\t0.3176470588235294,\r\n\t\t0.42745098039215684,\r\n\t\t0.9058823529411765,\r\n\t\t0.51\r\n\t],\r\n\t\"outline\": {}\r\n}",
            },
            currentFloor: {
                id: 2,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "1-2",
                    "positions": [
                        2.04280484309749,
                        0.639881669957266,
                        2.0428133275673135,
                        0.6398822168013933,
                        2.0428130775346722,
                        0.6398845192237631,
                        2.0428043650417296,
                        0.6398839677074695
                    ],
                    "height": 11.423305830581272,
                    "extrudedHeight": 14.112638097403593,
                    "outline": {}
                })
            }
        },

        {
            currentBuilding: {
                "id": 1,
                "name": "一号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": "{\r\n\t\"xbsjType\": \"ClassificationPolygon\",\r\n\t\"name\": \"一号楼\",\r\n\t\"positions\": [\r\n\t\t2.042804317855282,\r\n\t\t0.6398840436683026,\r\n\t\t2.0428046034982046,\r\n\t\t0.6398816518944798,\r\n\t\t2.0428134636956674,\r\n\t\t0.6398823070947697,\r\n\t\t2.0428132095547076,\r\n\t\t0.6398845390625975\r\n\t],\r\n\t\"height\": 29.103914916475517,\r\n\t\"color\": [\r\n\t\t0.3176470588235294,\r\n\t\t0.42745098039215684,\r\n\t\t0.9058823529411765,\r\n\t\t0.51\r\n\t],\r\n\t\"outline\": {}\r\n}",
            },
            currentFloor: {
                id: 3,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "1-3",
                    "positions": [
                        2.04280484309749,
                        0.639881669957266,
                        2.0428133275673135,
                        0.6398822168013933,
                        2.0428130775346722,
                        0.6398845192237631,
                        2.0428043650417296,
                        0.6398839677074695
                    ],
                    "height": 13.542656623473917,
                    "extrudedHeight": 16.84114740048696,
                    "outline": {}
                })
            }
        },

        {
            currentBuilding: {
                "id": 1,
                "name": "一号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": "{\r\n\t\"xbsjType\": \"ClassificationPolygon\",\r\n\t\"name\": \"一号楼\",\r\n\t\"positions\": [\r\n\t\t2.042804317855282,\r\n\t\t0.6398840436683026,\r\n\t\t2.0428046034982046,\r\n\t\t0.6398816518944798,\r\n\t\t2.0428134636956674,\r\n\t\t0.6398823070947697,\r\n\t\t2.0428132095547076,\r\n\t\t0.6398845390625975\r\n\t],\r\n\t\"height\": 29.103914916475517,\r\n\t\"color\": [\r\n\t\t0.3176470588235294,\r\n\t\t0.42745098039215684,\r\n\t\t0.9058823529411765,\r\n\t\t0.51\r\n\t],\r\n\t\"outline\": {}\r\n}",
            },
            currentFloor: {
                id: 4,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "1-4",
                    "positions": [
                        2.04280484309749,
                        0.639881669957266,
                        2.0428133275673135,
                        0.6398822168013933,
                        2.0428130775346722,
                        0.6398845192237631,
                        2.0428043650417296,
                        0.6398839677074695
                    ],
                    "height": 16.596522051144294,
                    "extrudedHeight": 19.627039508448593,
                    "outline": {}
                })
            }
        },

        {

            currentBuilding: {
                "id": 1,
                "name": "一号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": "{\r\n\t\"xbsjType\": \"ClassificationPolygon\",\r\n\t\"name\": \"一号楼\",\r\n\t\"positions\": [\r\n\t\t2.042804317855282,\r\n\t\t0.6398840436683026,\r\n\t\t2.0428046034982046,\r\n\t\t0.6398816518944798,\r\n\t\t2.0428134636956674,\r\n\t\t0.6398823070947697,\r\n\t\t2.0428132095547076,\r\n\t\t0.6398845390625975\r\n\t],\r\n\t\"height\": 29.103914916475517,\r\n\t\"color\": [\r\n\t\t0.3176470588235294,\r\n\t\t0.42745098039215684,\r\n\t\t0.9058823529411765,\r\n\t\t0.51\r\n\t],\r\n\t\"outline\": {}\r\n}",
            },
            currentFloor: {
                id: 5,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "1-5",
                    "positions": [
                        2.04280484309749,
                        0.639881669957266,
                        2.0428133275673135,
                        0.6398822168013933,
                        2.0428130775346722,
                        0.6398845192237631,
                        2.0428043650417296,
                        0.6398839677074695
                    ],
                    "height": 19.396756001004334,
                    "extrudedHeight": 26.608883983529168,
                    "outline": {}
                })
            }
        },

        {

            currentBuilding: {
                "id": 2,
                "name": "二号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "二号楼",
                    "positions": [
                        2.0428135448093485,
                        0.6398845207670465,
                        2.0428137992125808,
                        0.6398823204068219,
                        2.042820664908539,
                        0.6398827650554295,
                        2.0428204141684,
                        0.6398849787949912
                    ],
                    "height": 28.89447698112241,
                    "color": [
                        0.11764705882352941,
                        0.6196078431372549,
                        0.6627450980392157,
                        0.46
                    ],
                    "outline": {}
                })
            },
            currentFloor: {
                id: 6,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "2-1",
                    "positions": [
                        2.042814181776436,
                        0.6398823535977225,
                        2.042820629119561,
                        0.6398828722076362,
                        2.0428204073043927,
                        0.6398850022781899,
                        2.0428139080206047,
                        0.6398845247313752
                    ],
                    "height": 10.55232924491058,
                    "outline": {}
                })
            }
        },

        {

            currentBuilding: {
                "id": 2,
                "name": "二号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "二号楼",
                    "positions": [
                        2.0428135448093485,
                        0.6398845207670465,
                        2.0428137992125808,
                        0.6398823204068219,
                        2.042820664908539,
                        0.6398827650554295,
                        2.0428204141684,
                        0.6398849787949912
                    ],
                    "height": 28.89447698112241,
                    "color": [
                        0.11764705882352941,
                        0.6196078431372549,
                        0.6627450980392157,
                        0.46
                    ],
                    "outline": {}
                })
            },
            currentFloor: {
                id: 7,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "2-2",
                    "positions": [
                        2.042814181776436,
                        0.6398823535977225,
                        2.042820629119561,
                        0.6398828722076362,
                        2.0428204073043927,
                        0.6398850022781899,
                        2.0428139080206047,
                        0.6398845247313752
                    ],
                    "height": 10.55232924491058,
                    "extrudedHeight": 14.09384363945299,
                    "outline": {}
                })
            }
        },

        {

            currentBuilding: {
                "id": 2,
                "name": "二号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "二号楼",
                    "positions": [
                        2.0428135448093485,
                        0.6398845207670465,
                        2.0428137992125808,
                        0.6398823204068219,
                        2.042820664908539,
                        0.6398827650554295,
                        2.0428204141684,
                        0.6398849787949912
                    ],
                    "height": 28.89447698112241,
                    "color": [
                        0.11764705882352941,
                        0.6196078431372549,
                        0.6627450980392157,
                        0.46
                    ],
                    "outline": {}
                })
            },
            currentFloor: {
                id: 8,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "2-3",

                    "positions": [
                        2.042814181776436,
                        0.6398823535977225,
                        2.042820629119561,
                        0.6398828722076362,
                        2.0428204073043927,
                        0.6398850022781899,
                        2.0428139080206047,
                        0.6398845247313752
                    ],
                    "height": 14.032600257881015,
                    "extrudedHeight": 16.9106795060295,
                    "outline": {}
                })
            }
        },

        {

            currentBuilding: {
                "id": 2,
                "name": "二号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "二号楼",
                    "positions": [
                        2.0428135448093485,
                        0.6398845207670465,
                        2.0428137992125808,
                        0.6398823204068219,
                        2.042820664908539,
                        0.6398827650554295,
                        2.0428204141684,
                        0.6398849787949912
                    ],
                    "height": 28.89447698112241,
                    "color": [
                        0.11764705882352941,
                        0.6196078431372549,
                        0.6627450980392157,
                        0.46
                    ],
                    "outline": {}
                })
            },
            currentFloor: {
                id: 9,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "2-4",
                    "positions": [
                        2.042814181776436,
                        0.6398823535977225,
                        2.042820629119561,
                        0.6398828722076362,
                        2.0428204073043927,
                        0.6398850022781899,
                        2.0428139080206047,
                        0.6398845247313752
                    ],
                    "height": 16.863063343283216,
                    "extrudedHeight": 20.152692535650576,
                    "outline": {}
                })
            }
        },

        {

            currentBuilding: {
                "id": 2,
                "name": "二号楼",
                "createTime": "2022-09-20 10:18:06",
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "二号楼",
                    "positions": [
                        2.0428135448093485,
                        0.6398845207670465,
                        2.0428137992125808,
                        0.6398823204068219,
                        2.042820664908539,
                        0.6398827650554295,
                        2.0428204141684,
                        0.6398849787949912
                    ],
                    "height": 28.89447698112241,
                    "color": [
                        0.11764705882352941,
                        0.6196078431372549,
                        0.6627450980392157,
                        0.46
                    ],
                    "outline": {}
                })
            },
            currentFloor: {
                id: 10,
                "cesiumCode": JSON.stringify({
                    "xbsjType": "ClassificationPolygon",
                    "name": "2-5",
                    "positions": [
                        2.042814181776436,
                        0.6398823535977225,
                        2.042820629119561,
                        0.6398828722076362,
                        2.0428204073043927,
                        0.6398850022781899,
                        2.0428139080206047,
                        0.6398845247313752
                    ],
                    "height": 20.106478153162268,
                    "extrudedHeight": 25.340349449697474,
                    "outline": {}
                })
            }
        },


    ]
    let id = 1
    let startDate = moment().year(2023).month(5).date(3).hours(8).minutes(30).seconds(0).milliseconds(0)
    let spaceMinutes = 30

    pathInfo.forEach(item => {
        item.id = id++
        item.date = startDate.add(spaceMinutes, "minutes").format('MM/DD HH:mm')

    }
    )
    return pathInfo
}

function getFakeInterviewInformation() {
    let result = [{
        "id": 1,
        "name": "一号楼",

        "progress": []
    }, {
        "id": 2,
        "name": "二号楼",

        "progress": []
    }]

    const unit = []
    //3单元 14 层 2户
    for (let floor = 1; floor <= 14; floor++) {
        unit.push([{
            "houseNumber": `${floor}01`,
            "status": -1,
            "remark": ""
        },
        {
            "houseNumber": `${floor}02`,
            "status": -1,
            "remark": ""
        }])
    }

    const progress = [_.cloneDeep(unit), _.cloneDeep(unit), _.cloneDeep(unit)]


    // 第一个单元全部走访完成
    _.flattenDeep(progress[0]).forEach(item => {
        item.status = 2
        item.remark = "住户积极配合网格员的走访，如实回答了相关问题"
    })

    // 第二个单元走访完1-7层，中途随机添加走访失败住户（status=1）
    _.flattenDeep(progress[1]).forEach((item, index) => {
        if ([3,5,10].includes(index)) {
            item.status = 1
            item.remark = "走访时住户不在家"
        }else if (index < 14) {
            item.status = 2
            item.remark = "住户积极配合网格员的走访，如实回答了相关问题"
        } else {
            item.status = 0
            item.remark = ""
        }
    })

    // 第三个单元全部没走访
    _.flattenDeep(progress[2]).forEach((item) => {
        item.status = 0
        item.remark = ""
    })

    result[0].progress = result[1].progress = progress
    return result
}


module.exports = { getNewTimeStamp, updateAccidentTime, addFireTask, addTask, getRelatedTaskListByUserId, acceptTask, appointTask, gridAcceptTask, gridFinishTask, appointTaskToGrid, getFakeInterviewInformation }
