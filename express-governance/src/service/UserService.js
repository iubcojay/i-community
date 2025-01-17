const fs = require('fs')
const path = require('path')
const userDataPath = path.resolve(__dirname, '../../dataset/user/data.json')
const jwtUtils = require('../utils/JwtUtils.js')
const userModel = require('../model/UserModel')
const areaModel = require('../model/AreaModel')

function getTokenByUser(user) {
    const username = user.username
    const password = user.password
    const realUser = userModel.selUserByUserNameAndPassword(username, password)
    let result

    if (!realUser) {
        result = null;
    } else if (realUser.power === 0) {
        result = null;
    } else {
        result = jwtUtils.createToken({ username: realUser.username, power: realUser.power });
    }

    return result
}

function getTokenByAdminUser(user) {
    const username = user.username
    const password = user.password
    const realUser = userModel.selUserByUserNameAndPassword(username, password)
   
    let result = null
    if (!realUser) {
        result = null;
    } else if (realUser.power !== 0) {
        result = null;
    } else {
        result = jwtUtils.createToken({ username: realUser.username, power: realUser.power });
    }

    return result
}


function getUserByToken(token) {
    let user = jwtUtils.verify(token);
    if (user) {
        user = userModel.selUserByUserName(user.username)
        if (user) {
            user.password = ""
            return fillUser(user)
        }
    }

    return null
}

function getUserById(id) {
    const user = userModel.selUserById(id)
    user.password = ""
    return fillUser(user)
}

function fillUser(user) {
    area = areaModel.selAreaByAdminUserId(user.id)
    user.area = area
    return user
}

module.exports = { getTokenByUser, getUserByToken, getUserById, getTokenByAdminUser }
