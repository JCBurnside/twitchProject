var bcrypt=require('bcryptjs')
module.exports=function(db,mongoose=require('mongoose')){
	this.url=db;
	this.mongoose=mongoose;
	this.User=require('./models/user.js')(this.mongoose);
	this.Suggestion=require('./models/Suggestion.js')(this.mongoose);
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
			password:hashedPass,
			bytes:0
		})
		console.log(user)
		if(!cb||typeof(cb)!=="function")return user.save();
		user.save(cb);
	}
	this.login=function(username,password,cb=null){
		console.log("LOGIN CALLED",username);
		this.User.findOne({username:username},(err,user)=>{
			if(err){
				if(!cb)
					return false;
				cb(err,null);
			}
			if(user){
				console.log("FOUND ONE");
				bcrypt.compare(password,user.password,(err,matches)=>{
					if(err){
						cb(err,null);
					}
					if(matches){
						if(!cb)
							return true;
						cb(null,user)
					}else{
						if(!cb)
							return false;
						cb(err,null);
					}
				});
			}else {
				console.log("USER NOT FOUND")
				if(!cb)
					return false;
				cb("not found",null);
			}
		});
	};
	this.findOneUser=function(id){return this.User.findById(id)};
	this.getTop=function(count){
		return this.User.find().sort({bytes:-1}).limit(count);
	}
	this.transfer=function(user,amount,target,cb){
		amount=Math.min(user.bytes,amount);
		amount=amount==NaN?0:amount
		this.User.findByIdAndUpdate(user._id,{$inc:{bytes:-1*amount}},(err,doc)=>{
				if(err)
					cb(err,null);
				else
					this.User.update({username:target},{$inc:{bytes:amount}}).exec((err,doc)=>{
						if(err){
							cb(err,null);
							this.User.update({_id:user._id},{$inc:{bytes:amount}},(err,doc)=>{
								if(err)
									console.log(err);
								else
									console.log("SOMETHING WENT WRONG");
							});
						}
						else
							cb(null,amount);
					})
			
		})
	}
	this.random=function(user,amount,cb){
		amount=Math.min(user.bytes,amount);
		amount=amount==NaN?0:amount
		this.User.findByIdAndUpdate(user._id,{$inc:{bytes:-1*amount}},(err,doc)=>{
			if(err)
				return cb(err,null);
			this.User.random((err,randoUser)=>{
				if(err)
					cb(err,null);
				else
					this.User.update({_id:randoUser._id},{$inc:{bytes:amount}}).exec((err,doc)=>{
						if(err){
							cb(err,null);
							this.User.update({_id:user._id},{$inc:{bytes:amount}},(err,doc)=>{
								if(err)
									console.log(err);
								else
									console.log("SOMETHING WENT WRONG");
							});
						}
						else
							cb(null,amount);
					})
			});
		})
	}
	this.dump=function(user,cb){
		this.User.findByIdAndUpdate(user._id,{$set:{bytes:0}},cb)
	}
	this.verify=function(target,cb){
		this.User.findOne({username:target},cb)
	}
	this.getSugs=function(cb){
		this.Suggestion.find(cb);
	}
	this.createSug=function(user,sug,cb){
		var newSug=new this.Suggestion({
			title:sug.title,
			msg:sug.msg,
			type:sug.type||'BROKEN',
			by:user._id
		});
		newSug.save(cb);
	}
	this.deleteSug=function(user,id,cb){
		this.Suggestion.findById(id,(err,res)=>{
			if(err){
				console.log(err);
				return cb(err,null);
			}
			if(res.by==user._id){
				this.Suggestion.remove({_id:id},cb);
			}
		})
	}
	return this;
}