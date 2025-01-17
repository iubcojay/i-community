const jsonwebtoken = require("jsonwebtoken")
const secret = "my-community-key"
const expire_time=5*24*60*60;

function createToken(value){
    return jsonwebtoken.sign(
        value,
        secret,
        {expiresIn:expire_time+'s'}
    )
}

function verify(token){
    try{
        return jsonwebtoken.verify(token,secret)
    }catch(e){
        return null
    }
}

module.exports = {createToken,verify}
