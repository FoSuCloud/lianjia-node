var express = require("express");
var router = express.Router();
const token = require('../util/jwt.js')

// 刷新token
router.get('/refresh', function (req,res,next){
    res.json({code:0,data:{token:token.encrypt( {data:'123456' })}})
})

module.exports = router;
