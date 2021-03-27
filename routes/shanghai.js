const express = require('express');
const router = express.Router();
const shanghai = require('../models/shanghai');
const axios = require('axios');

router.get('/', function(req, res, next) {
    res.send('shanghai');
})

router.get('/list', function(req, res, next) {
    shanghai.findAll((err, data) => {
        res.json({ code: 0, data: data, msg: '成功' })
    })
})

module.exports = router;