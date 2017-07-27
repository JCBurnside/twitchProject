var jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    jwt.verify(req.get("authorization"),process.env.SECRET,(err,decoded)=>{
        if(err){
            console.log(err)
            return res.status(500).send(err);
        }if(decoded){
            req.user=db.findOneUser(decoded);
            return next();
        }
        res.status(401).send("Unauthorized");
    });
}