const mongoose = require('mongoose');
 

const reportSchema = new mongoose.Schema({
    term: String,
    admno: Number,
    per: Number,
    secRank: Number,
    classRank: Number,
    std: Number,
    sec: String,
    reports: {},
    total: {},
    coscholastic: {}
});

module.exports = mongoose.model("Reports", reportSchema);