const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
	admno: {type: Number, unique: true},
	name: String,
	fname: String,
	std: Number,
   	sec: String,
	subjects: Array
},{strict:false});
	
module.exports = mongoose.model("Record", recordSchema);