const fs = require('fs')
const path = require('path')
const accidentDataPath = path.resolve(__dirname, '../../dataset/accident/data.json')
const accidentDataPath2 = path.resolve(__dirname, '../../dataset/accident/data_factory.json')
const commonUtils = require(path.resolve(__dirname, '../utils/CommonUtils.js'))
const _ = require('lodash')

// 增
function selAccidentList() {
    let accidentList = JSON.parse(fs.readFileSync(accidentDataPath, 'UTF-8'))
    return accidentList;
}

function selFactoryAccidentList() {
    let accidentList = JSON.parse(fs.readFileSync(accidentDataPath2, 'UTF-8'))
    return accidentList;
}

// 获取新的时间节点
function getNewTimeStamp() {
    let accidentList = JSON.parse(fs.readFileSync(accidentDataPath, 'UTF-8'));
    let result = [];

    accidentList.forEach(accident => {
        if (accident.process && Array.isArray(accident.process)) {
            // 获取 process 列表中的最后一个元素的时间戳
            const lastProcessTimestamp = accident.process[accident.process.length - 1].timestamp;

            // 获取 process 列表中第一个 fireTruck 状态变成 back 的时间戳
            const fireTruckBackTimestamp = accident.process.find(processItem =>
                processItem.entities &&
                Array.isArray(processItem.entities) &&
                processItem.entities.some(entity => entity.type === 'fireTruck' && entity.status === 'back')
            )?.timestamp;

            result.push({
                lastProcessTimestamp,
                fireTruckBackTimestamp
            });
        } else {
            console.error('Process list is empty or not an array');
        }
    });
    console.log(result)
    return result;
}

// 根据前端事故发生的时刻更新事故列表时间戳
function updateAccidentList(newFireTimeStamp) {
    let accidentList = JSON.parse(fs.readFileSync(accidentDataPath, 'UTF-8'));

    accidentList.forEach(accident => {
        // 获取原本的时间戳
        let oldTimeStamp = accident.interval[0] - 6000;
        console.log(oldTimeStamp)

        // 更新 process 部分的每个元素的 timestamp
        if (accident.process && Array.isArray(accident.process)) {
            accident.process.forEach((processItem, index) => {
                let temp = processItem.timestamp
                processItem.timestamp = newFireTimeStamp - oldTimeStamp + temp; // 假设每个 process 的时间间隔是 3000 毫秒
            });
        }

        // 更新 interval 数组
        if (accident.interval && Array.isArray(accident.interval)) {
            const intervalDuration = accident.interval[1] - accident.interval[0];
            accident.interval[0] = newFireTimeStamp + 6000;
            accident.interval[1] = accident.interval[0] + intervalDuration;
        }
    });

    fs.writeFileSync(accidentDataPath, JSON.stringify(accidentList, null, 2), 'UTF-8');
    console.log('事故列表时间戳更新成功');
    getNewTimeStamp();
}


module.exports = {getNewTimeStamp, updateAccidentList, selAccidentList, selFactoryAccidentList}
