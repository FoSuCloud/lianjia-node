var express = require('express');
const pagination = require('mongoose-sex-page')
var router = express.Router();
const shenzhen = require('../models/shenzhen');
const shanghai = require('../models/shanghai');
const beijing = require('../models/beijing');
const guangzhou = require('../models/guangzhou');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/list', async function(req, res, next) {
    let city = req.query.city;
    let page = req.query.page;
    let size = req.query.size;
    let model;
    switch (city) {
        case 'sz':
            model = shenzhen;
            city = "深圳"
            break;
    }
    let data = await pagination(model).page(page || 1).size(size || 20).display(5).find({ city: city }).exec();
    res.json({ code: 0, data: data, msg: '成功' })
});

router.get('/rent', async function(req, res, next) {
    let arr = [];
    let nameList = ['深圳', '广州', '北京', '上海']
    let modelList = [shenzhen, guangzhou, beijing, shanghai]
    for (let i = 0; i < modelList.length; i++) {
        let numArr = await modelList[i].find({}, '_id rent_price_listing')
        let num = 0; // 总数
        let valid = 0; // 有效数
        for (let j = 0; j < numArr.length; j++) {
            const price = parseInt(numArr[j]['rent_price_listing'])
            if (price) {
                valid++;
                num += price;
            }
        }
        arr.push(Math.round(num / valid))
    }
    res.json({
        code: 0,
        data: {
            nameList: nameList,
            values: arr,
        }
    })
});

module.exports = router;