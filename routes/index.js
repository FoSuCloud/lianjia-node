var express = require("express");
const pagination = require("mongoose-sex-page");
var router = express.Router();
const shenzhen = require("../models/shenzhen");
const shanghai = require("../models/shanghai");
const beijing = require("../models/beijing");
const guangzhou = require("../models/guangzhou");

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
});

router.get("/list", async function(req, res, next) {
    let city = req.query.city;
    let page = req.query.page;
    let size = req.query.size;
    let model;
    switch (city) {
        case "sz":
            model = shenzhen;
            city = "深圳";
            break;
        case "sh":
            model = shanghai;
            city = "上海";
            break;
        case "bj":
            model = beijing;
            city = "北京";
            break;
        case "gz":
            model = guangzhou;
            city = "广州";
            break;
    }
    let data = await pagination(model)
        .page(page || 1)
        .size(size || 20)
        .display(5)
        .find({ city: city })
        .exec();
    res.json({ code: 0, data: data, msg: "成功" });
});

router.get("/rent", async function(req, res, next) {
    let arr = [];
    let nameList = ["深圳", "广州", "北京", "上海"];
    let modelList = [shenzhen, guangzhou, beijing, shanghai];
    for (let i = 0; i < modelList.length; i++) {
        let numArr = await modelList[i].find({}, "_id rent_price_listing");
        let num = 0; // 总数
        let valid = 0; // 有效数
        for (let j = 0; j < numArr.length; j++) {
            const price = parseInt(numArr[j]["rent_price_listing"]);
            if (price) {
                valid++;
                num += price;
            }
        }
        arr.push(Math.round(num / valid));
    }
    res.json({
        code: 0,
        data: {
            nameList: nameList,
            values: arr,
        },
    });
});

router.get("/house/type", async function(req, res, next) {
    let modelList = [shenzhen, guangzhou, beijing, shanghai];
    let cityList = ["深圳", "广州", "北京", "上海"];
    let values = [
        { name: "整租", values: [] },
        { name: "合租", values: [] },
    ];
    for (let i = 0; i < modelList.length; i++) {
        let types = await modelList[i].find({}, "_id type");
        let all = 0;
        let part = 0;
        for (let j = 0; j < types.length; j++) {
            if (types[j].type === "整租") {
                all++;
            } else if (types[j].type === "合租") {
                part++;
            }
        }
        values[0].values.push(all);
        values[1].values.push(part);
    }
    res.json({
        code: 0,
        data: { legendList: ["整租", "合租"], cityList: cityList, values: values },
        msg: "成功",
    });
});

router.get('/city/zone', async function(req,res,next){
    let city = req.query.city;
    let model = getModel(city);
    const arr = await model.find({}, "_id dist");
    let distList = [];
    for(let i=0;i<arr.length;i++){
        let index = -1;
        distList.some((item, j) => {
            if (item.name === arr[i]["dist"]) {
                index = j;
                return true;
            }
            return false;
        })
        if (index > -1) {
            distList[index].num++
        } else if (arr[i]["dist"]) {
            distList.push({
                name: arr[i]["dist"],
                num: 1
            });
        }
    }

    distList = distList.map((item) => {
        if (item.name.indexOf('区') === -1) {
            item.name = item.name + '区'
        }
        return {
            value:item.num,
            name: item.name
        };
    });
    res.json({ code: 0, data: distList, msg: "成功" });
})

router.get("/city/heat", async function(req, res, next) {
    let city = req.query.city;
    let model = getModel(city);
    const arr = await model.find({}, "_id rent_area rent_price_listing dist");
    let distList = [];
    for (let i = 0; i < arr.length; i++) {
        let index = -1;
        distList.some((item, j) => {
            if (item.name === arr[i]["dist"]) {
                index = j;
                return true;
            }
            return false;
        })
        let price = parseInt(arr[i]["rent_price_listing"])
        let area = parseInt(arr[i]["rent_area"])
        if (index > -1) {
            distList[index].price += price
            distList[index].area += area
        } else if (arr[i]["dist"]) {
            distList.push({
                name: arr[i]["dist"],
                price: price,
                area: area
            });
        }
    }
    distList = distList.map((item) => {
        if (item.name.indexOf('区') === -1) {
            item.name = item.name + '区'
        }
        return {
            value: Math.round(item.price / item.area),
            name: item.name
        };
    });
    res.json({ code: 0, data: distList, msg: "成功" });
});

router.get('/city/num-price', async function(req,res,next){
    let city = req.query.city;
    let model = getModel(city);
    const arr = await model.find({}, "_id rent_area rent_price_listing dist");
    let distList = [];
    for (let i = 0; i < arr.length; i++) {
        let index = -1;
        distList.some((item, j) => {
            if (item.name === arr[i]["dist"]) {
                index = j;
                return true;
            }
            return false;
        })
        let price = parseInt(arr[i]["rent_price_listing"])
        let area = parseInt(arr[i]["rent_area"])
        if (index > -1) {
            distList[index].price += price
            distList[index].area += area
            distList[index].num++;
        } else if (arr[i]["dist"]) {
            distList.push({
                name: arr[i]["dist"],
                price: price,
                area: area,
                num: 1
            });
        }
    }
    distList = distList.map((item) => {
        if (item.name.indexOf('区') === -1) {
            item.name = item.name + '区'
        }
        return {
            value: Math.round(item.price / item.area),
            num: item.num,
            name: item.name
        };
    });
    res.json({ code: 0, data: distList, msg: "成功" });
})

router.get('/city/style-price', async function(req,res,next){
    let city = req.query.city;
    let model = getModel(city);
    const arr = await model.find({}, "_id layout rent_area rent_price_listing");
    let distList = [];
    let maxList=['2室1厅1卫','1室1厅1卫','3室2厅1卫','2室2厅1卫']
    for (let i = 0; i < arr.length; i++) {
        let index = -1;
        distList.some((item, j) => {
            if (item.layout === arr[i]["layout"]) {
                index = j;
                return true;
            }
            return false;
        })
        let price = parseInt(arr[i]["rent_price_listing"])
        let area = parseInt(arr[i]["rent_area"])
        if (index > -1) {
            distList[index].price += price
            distList[index].area += area
            distList[index].num++;
        } else if (arr[i]["layout"]&&maxList.indexOf(arr[i]["layout"])>-1) {
            distList.push({
                layout: arr[i]["layout"],
                price: price,
                area: area,
                 num: 1
            });
        }
    }
    distList = distList.map((item) => {
        return {
            value: Math.round(item.price / item.area),
            layout: item.layout,
            num:item.num
        };
    });
    res.json({ code: 0, data: distList, msg: "成功" });
})


router.get('/city/word-cloud',async function(req,res,next){
    let city = req.query.city;
    let model = getModel(city);
    const arr = await model.find({}, "_id house_tag");
    let resList = [];
    for(let i=0;i<arr.length;i++){
        if(!arr[i]["house_tag"]){
            continue;
        }
        let tags=arr[i]["house_tag"].split(' ');
        for(let j=0;j<tags.length;j++){
            let index=-1;
            resList.some((item,k)=> {
                if(item.name===tags[j]){
                    index = k;
                    return true;
                }
                return false
            });
            if (index > -1) {
                resList[index].value++
            } else if (tags[j]) {
                resList.push({
                    name: tags[j],
                    value: 1
                });
            }
        }
    }
    res.json({ code: 0, data: resList, msg: "成功" });
})

/**
 * 获取预测房价
 * */
router.get('/calculate', async function(req,res,next){
    const city=req.query.city
    const zone = req.query.zone
    let area = req.query.area
    const model = req.query.model
    if(!area){
        area = 20;
    }
    let price=getCityNum(city)*getZoneNum(zone)*area*getModelNum(model);
    res.json({
        code:0,
        data: {
            price:price
        },
        msg:'预测成功'
    })
})
/**
 * 常量，用来记录房价系数
 * */
function getCityNum(city){
    let res = 1;
    switch (city){
        case 'sz':
            res=3;
            break;
        case 'sh':
            res=2.8;
            break;
        case 'bj':
            res=3.2;
            break;
        case 'gz':
            res=2.5;
            break;
        default:
            break;
    }
    return res
}
function getZoneNum(zone){
    if(!zone){
        return 20
    }
    return Math.max(20,Math.min(zone,40))
}
function getModelNum(model){
    if(!model){
        return 1
    }
    return Math.max(1, Math.min(model*Math.random(),1.5))
}
function getModel(city){
    let model;
    switch (city) {
        case "sz":
            model = shenzhen;
            break;
        case "sh":
            model = shanghai;
            break;
        case "bj":
            model = beijing;
            break;
        case "gz":
            model = guangzhou;
            break;
    }
    return model
}

module.exports = router;