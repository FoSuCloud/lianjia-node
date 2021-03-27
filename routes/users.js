var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('users 根节点');
});
router.get('/user', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;