var bcrypt = require('bcryptjs'),
	jwt = require('jsonwebtoken');
module.exports = function (mongoose) {
	var US = new mongoose.Schema({
		username: { type: String,
					unique:true,
					required:true},
		password: { type: String,
					required:true },
		bytes:Number
	});
	US.pre('save', function (next) {
		var user = this;
		console.log("IN PRE-SAVE")
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	});
	US.methods.genToken = function () {
		return jwt.sign({ id: this._id }, process.env.SECRET, { expiresIn: 60 * 60 * 24 })
	}
	US.statics.random=function(cb){
		this.count((err,count)=>{
			if(err)
				return cb(err);
			let rand=Math.floor(Math.random()*count);
			this.findOne().skip(rand).exec(cb);
		})
	}
	return mongoose.model('User', US);
}