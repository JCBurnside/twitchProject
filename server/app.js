require('dotenv').config({path:__dirname+"/.env"});
global.db = new require('./db.js')('mongodb://user:user@ds125053.mlab.com:25053/digitaldb');

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser');
// console.log(db);
db.connect();
app.use(bodyParser.json());
app.use(require('./middleware/headers.js'))
// app.use('/api/test', (_, res) => res.send("HELLO"));
app.use('/api/signup', require('./routes/signup.js'));
app.use('/api/login', require('./routes/signin.js'));
app.get('/api/top/:len',(req,res)=>{
	let arr=[];
	for(ctr=0;ctr<req.params.len;ctr++){
		arr.push(ctr);
	}
	res.json(arr);
})
var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("APP IS LISTENING ON PORT " + port);
})