var mongoose 					= require('mongoose'),
	passpotLocalMongoose		= require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
});

UserSchema.plugin(passpotLocalMongoose);

module.exports = mongoose.model("User", UserSchema);