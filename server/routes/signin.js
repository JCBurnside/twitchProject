let router=require('express').Router(); 
router.post('/',(req,res)=>{
	db.login(req.body.user.username,req.body.user.password,(err,user)=>{
		if(err)
			return res.satus(420).send(err);
		res.json({token:user.getToken()})
	});
})
module.exports=router;