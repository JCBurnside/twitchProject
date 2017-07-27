var bcrypt = require('bcryptjs'),
	jwt = require('jsonwebtoken');
module.exports = function (mongoose) {
	var US = new mongoose.Schema({
		username: { type: String,
					unique:true},
		password: { type: String },
		bytes:Number
	});
	US.pre('save', function (next) {
		var user = this;
		console.log("IN PRE-SAVE")
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				console.log("GEN SALT ERRORED")
				return next(err);
			}
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					console.log("HASH FAILED");
					console.log(err);
					return next(err);
				}
				console.log(hash);
				user.password = hash;
				next();
			});
		});
	});
	US.methods.genToken = function () {
		return jwt.sign({ id: this._id }, process.env.SECRET, { expiresIn: 60 * 60 * 24 })
	}
	return mongoose.model('User', US);
}