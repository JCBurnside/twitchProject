var bcrypt=require('bcryptjs');
module.exports=function(mongoose){
	var US=new mongoose.Schema({
		username:{type:String},
		password:{type:String}
	});
	return mongoose.model('User',US);
}