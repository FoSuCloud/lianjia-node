const jwt = require('jsonwebtoken');
const Token = {
    //  生成
    encrypt:function(data,time){ //data加密数据 ，time过期时间  60 * 30  （30分）
        return jwt.sign(data, 'token', {expiresIn: time || 1800 })
    },
    // 解析
    decrypt:function(token){
        try {
            jwt.verify(token, 'token');
            return true
        } catch (e) {
            return false
        }
    }
}
module.exports = Token;
