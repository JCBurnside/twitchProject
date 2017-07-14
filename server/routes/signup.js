var router=require('express').Router(),
	bcrypt=require('bcryptjs'),
	jwt=require('jsonwebtoken');
router.post('/',(req,res)=>{
	var username=req.body.user.username,
		password=req.body.user.password;
	db.createUser(username,password,(err,user)=>{
		if(err){
			console.log(err);
			res.status(500).send(err);
			return;
		}
		console.log("USER WAS CREATED:"+username);
		res.status(200).json({
			user:user,
			message:'created',
			token:user.genToken()
		});
	});
});
module.exports=router;