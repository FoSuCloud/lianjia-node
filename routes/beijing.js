const express = require('express');
const router = express.Router();
const beijing = require('../models/beijing');
const axios = require('axios');

router.get('/', function(req, res, next) {
    res.send('beijing');
})

router.get('/list', function(req, res, next) {
    beijing.findAll((err, data) => {
        res.json({ code: 0, data: data, msg: '成功' })
    })
})

module.exports = router;