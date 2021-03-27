const express = require('express');
const router = express.Router();
const guangzhou = require('../models/guangzhou');
const axios = require('axios');

router.get('/', function(req, res, next) {
    res.send('guangzhou');
})

router.get('/list', function(req, res, next) {
    guangzhou.findAll((err, data) => {
        res.json({ code: 0, data: data, msg: '成功' })
    })
})

module.exports = router;