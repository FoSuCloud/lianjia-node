const mongodb = require('mongoose');
const url = 'mongodb://localhost/lianjiazufang';
mongodb.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
module.exports = mongodb;