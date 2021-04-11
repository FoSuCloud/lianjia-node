const jwt = require('jsonwebtoken');
const Token = {
    //  生成
    encrypt:function(data,time){ //data加密数据 ，time过期时间  60 * 120  （60分）
        return jwt.sign(data, 'token', {expiresIn: time || 3600 })
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
