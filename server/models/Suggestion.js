module.exports=function(mongoose){
    var SS=new mongoose.Schema({
        title:String,
        msg:String,
        by:String
    });
    return mongoose.model('Suggestions',SS);
}