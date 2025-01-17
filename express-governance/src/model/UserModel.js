const fs = require('fs')
const path = require('path')
const userDataPath = path.resolve(__dirname, '../../dataset/user/data.json')
const commonUtils = require(path.resolve(__dirname, '../utils/CommonUtils.js'))

function selAllUsers(){
    let userList = JSON.parse(fs.readFileSync(userDataPath, 'UTF-8'))
    userList = userList
    return userList
}

function selUserByUserNameAndPassword(username,password){
    let userList = JSON.parse(fs.readFileSync(userDataPath, 'UTF-8'))
    userList = userList
    return userList.find(user=>(user.username === username&&user.password === password))
}

function selUserByUserName(username){
    let userList = JSON.parse(fs.readFileSync(userDataPath, 'UTF-8'))
    userList = userList
    return userList.find(user=>(user.username === username))
}
function selUserById(id){
    let userList = JSON.parse(fs.readFileSync(userDataPath, 'UTF-8'))
    userList = userList
    return userList.find(user=>(user.id === id))
}


module.exports = {selAllUsers,selUserByUserNameAndPassword,selUserByUserName,selUserById}
