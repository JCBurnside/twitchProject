var bcrypt=require('bcryptjs')
module.exports=function(db,mongoose=require('mongoose')){
	this.url=db;
	this.mongoose=mongoose;
	this.User=require('./models/user.js')(this.mongoose);
	this.connect=function(){
		this.mongoose.connect(this.url);
		this.on('connected',()=>console.log("CONNECTED TO ",this.url))
	}
	this.on=function(when,what){
		if(!when instanceof String)throw "Not Specified When";
		if(typeof(what)!=="function")throw "Callback is not a function";
		this.mongoose.connection.on(when,what);
	}
	this.createUser=function(username,hashedPass,cb=null){
		var user=new this.User({
			username:username,
			password:hashedPass
		})
		console.log(user)
		if(!cb||typeof(cb)!=="function")return user.save();
		user.save(cb);
	}
	this.login=function(username,password,cb=null){
		console.log("LOGIN CALLED",username);
		this.User.findOne({username:username}).then((err,user)=>{
			if(err){
				if(!cb)
					return false;
				cb(err,null);
			}
			if(user){
				console.log("FOUND ONE");
				bcrypt.compare(password,user.password,(err,matches)=>{
					if(matches){
						if(!cb)
							return true;
						cb(null,user)
					}else{
						if(!cb)
							return false;
						cb(err,null);
					}
				},i=>console.log(i));
			}else {
				console.log("USER NOT FOUND")
				if(!cb)
					return false;
				cb(err,null);
			}
		});
	}
	return this;
}