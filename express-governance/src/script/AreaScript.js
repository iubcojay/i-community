const fs = require('fs')
const path = require('path')
const areaDataPath = path.resolve(__dirname, '../../dataset/area/data.json')
const userDataPath = path.resolve(__dirname, '../../dataset/user/data.json')
const commonUtils = require(path.resolve(__dirname, '../utils/CommonUtils.js'))
const _ = require('lodash');


let userList = JSON.parse(fs.readFileSync(userDataPath, 'UTF-8'))
userList = commonUtils.camel(userList)

userList.forEach(user => {
    let age = _.sample([45,25,41,35,39,34,33,36,54,50,46,41])
    user.age = age
    if (user.sex === 0) {
        user.profile = "/img/profile/user_woman.png"
    }else if (user.sex === 1) {
        user.profile = "/img/profile/user_man.png"
    }
    
});
console.log(userList);
fs.writeFileSync(userDataPath,JSON.stringify(userList))
