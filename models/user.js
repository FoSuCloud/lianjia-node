const mongodb = require("./index.js");

const user = new mongodb.Schema({
    username: String,
    email: String,
    password: String
});

user.statics.findAll = function(callback) {
    this.find({}, callback);
};

const model = mongodb.model("user", user);

module.exports = model;