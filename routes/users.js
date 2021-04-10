var express = require('express');
var router = express.Router();
const user = require("../models/user");
const pagination = require("mongoose-sex-page");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('users 根节点');
});

router.get('/add', async function(req, res, next) {
    let username = req.query.username;
    let email = req.query.email;
    let password = req.query.password;
    let role = req.query.role;
    let data =await user.findOne({username,email,password,role})
    if(data){
        res.json({
            code: 1,
            data:{},
            msg:'用户已存在'
        })
    }
    await user.insertMany([{username,email,password,role}])
    res.json({
        code: 0,
        data:{},
        msg:'注册成功'
    })
});

router.get('/login', async function(req, res, next) {
    let email = req.query.email;
    let password = req.query.password;
    let data =await user.findOne({email,password}, '_id role')
    res.json({
            code: data?0:1,
            data:{role:data&&data.role || 1},
            msg:data?'登陆成功':'用户不存在'
    })
});

router.get('/list', async function(req, res, next) {
    let value = req.query.value;
    let page = req.query.page;
    let size = req.query.size;
    let reg = new RegExp(value,'gi')
    let data = await pagination(user)
        .page(page || 1)
        .size(size || 20)
        .display(5)
        .find({ username: {
            $regex:reg
            } })
        .exec();
    res.json({
        code: 0,
        data:data,
        msg:'成功'
    })
});

module.exports = router;