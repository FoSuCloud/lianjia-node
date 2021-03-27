const mongodb = require("./index.js");

const guangzhou = new mongodb.Schema({
    bathroom_num: String,
    bedroom_num: String,
    bizcircle_name: String,
    city: String,
    dist: String,
    distance: String,
    frame_orientation: String,
    hall_num: String,
    house_tag: String,
    house_title: String,
    latitude: String,
    layout: String,
    longitude: String,
    m_url: String,
    rent_area: String,
    rent_price_listing: String,
    rent_price_unit: String,
    resblock_name: String,
    type: String,
});

guangzhou.statics.findAll = function(callback) {
    this.find({}, callback);
};

const model = mongodb.model("guangzhou", guangzhou);

module.exports = model;