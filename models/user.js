const mongodb = require("./index.js");

const user = new mongodb.Schema({
    username: String,
    email: String,
    password: String,
    role: Number
});

user.statics.findAll = function(callback) {
    this.find({}, callback);
};

const model = mongodb.model("user", user);

module.exports = model;