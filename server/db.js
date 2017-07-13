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
		if(!cb||typeof(cb)!=="function")return user.save();
		user.save(cb);
	}
	this.login=function(username,password,cb=null){
		this.mongoose.findOne({username:username})
	}
	return this;
}