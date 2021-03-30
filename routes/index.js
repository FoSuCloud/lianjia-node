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

router.get("/city/heat", async function(req, res, next) {
    let city = req.query.city;
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

module.exports = router;