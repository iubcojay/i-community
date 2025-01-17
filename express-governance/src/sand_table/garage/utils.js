const _ = require("lodash")
const uuid = require("uuid");



function generateCarLicenseTag() {

    const cityList = ["鲁"];
    //车牌号所在地区
    const areaList = ["A", "S", "B", "U", "C", "D", "E", "F", "Y", "G", "V", "H", "J", "K", "L", "M", "N", "P", "Q", "R"]
    //车牌号后5位
    const numberList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    const letterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "J", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

    const letterNum = Math.floor((Math.random() * 3));
    //区域生成
    const city = _.sample(cityList)
    const area = _.sample(areaList)
    let numList = []

    for (let index = 0; index < letterNum; index++) {
        numList.push(_.sample(letterList))
    }

    for (let index = 0; index < 5 - letterNum; index++) {
        numList.push(_.sample(numberList))
    }
    numList = _.shuffle(numList)
    return city + area + '·' + numList.join('')
}


module.exports = {
    generateCarLicenseTag,
}  