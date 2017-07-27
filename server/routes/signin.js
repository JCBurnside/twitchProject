let router=require('express').Router(); 
router.post('/',(req,res)=>{
	db.login(req.body.user.username,req.body.user.password,(err,user)=>{
		if(err){
			console.log(err)
			return res.status(420).send(err);
		}
		res.status(200).json({token:user.genToken()})
	});
})
module.exports=router;