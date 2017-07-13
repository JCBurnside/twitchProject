global.db=new require('./db.js')('mongodb://localhost:27017/twitchProject');
require('dotenv').config();
var express=require('express'),
	app=express(),
	bodyParser=require('body-parser');
// console.log(db);
db.connect();
app.use(bodyParser.json());
app.use('/api/test',(_,res)=>res.send("HELLO"));
app.use('/api/signup',require('./routes/signup.js'));

port=process.env.PORT||3000
app.listen(port,()=>{
	console.log("APP IS LISTENING ON PORT "+port);
})