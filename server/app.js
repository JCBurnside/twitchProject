require('dotenv').config({path:__dirname+"/.env"});
global.db = new require('./db.js')('mongodb://user:user@ds125053.mlab.com:25053/digitaldb');

var express = require('express'),
	app = express(),
	bytes=require('./routes/bytes'),
	requireAuth=require('./middleware/requireAuth');
	bodyParser = require('body-parser');
// console.log(db);
db.connect();
app.use(bodyParser.json());
app.use(require('./middleware/headers.js'))
// app.use('/api/test', (_, res) => res.send("HELLO"));
app.use('/api/signup', require('./routes/signup.js'));
app.use('/api/login', require('./routes/signin.js'));
app.get('/api/top/:len',(req,res)=>{
	
	db.getTop(10).exec((err,doc)=>{
		if(err)
			res.status(500).send(err);
		else
			res.send(doc);
	});
});
app.put('/api/rando/:amount',requireAuth,bytes.rando);
app.put('/api/transfer/:target',requireAuth,bytes.transfer)
app.delete('/api/dump',requireAuth,bytes.dump);
app.get('/api/verify/:target',(req,res)=>{
	db.verify(req.params.target,(err,found)=>{
		if(err||!found)
			res.send(false);
		else
			res.send(true);
	});
});
app.use('/api/suggestions',require('./routes/suggestions.js'))
var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("APP IS LISTENING ON PORT " + port);
})