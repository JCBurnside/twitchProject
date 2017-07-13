var router=require('express').Router(),
	bcrypt=require('bcryptjs'),
	jwt=require('jsonwebtoken');
router.post('/',(req,res)=>{
	var username=req.body.user.username,
		pass=bcrypt.hashSync(req.body.user.password,10);
	db.createUser(username,pass,(err,user)=>{
		if(err){
			console.log(err);
			res.status(500).send(err);
			return;
		}
		console.log("USER WAS CREATED:"+username);
		res.status(200).json({
			user:user,
			message:'created',
			token:jwt.sign({id:user.id},process.env.SECRET,{expiresIn:60*60*24})
		});
	});
});
module.exports=router;