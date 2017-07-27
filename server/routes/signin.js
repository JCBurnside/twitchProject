let router=require('express').Router(); 
router.post('/',(req,res)=>{
	db.login(req.body.user.username,req.body.user.password,(err,user)=>{
		if(err){
			console.log(err)
			return res.status(500).send(err);
		}
		if(user)
			return res.status(200).json({user:user,token:user.genToken()});
		console.log("THIS SHOULD NEVER BE SEEN");
		res.status(420).send("SOMETHING WENT TERRIBLY WRONG");
	});
})
module.exports=router;