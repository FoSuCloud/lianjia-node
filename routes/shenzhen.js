const express = require('express');
const router = express.Router();
const shenzhen = require('../models/shenzhen');
const axios = require('axios');

router.get('/', function(req, res, next) {
    res.send('shenzhen');
})

router.get('/list', function(req, res, next) {
    shenzhen.findAll((err, data) => {
        res.json({ code: 0, data: data, msg: '成功' })
    })
})

module.exports = router;