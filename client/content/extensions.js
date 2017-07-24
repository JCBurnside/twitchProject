Array.prototype.toString=function(){
	let out="["
	this.forEach((element)=>{
		out+=element+element.name?",":(": "+element.name+",");
	})
	return out.substr(0,out.length-1)+"]";
}
Math.trunc=Math.trunc||function(x){
	if(isNaN(x))return NaN;
	return x>0?Math.floor(x):Math.ceil(x);
}
String.prototype.format=function(format,...args){
	if(this!=String.prototype){
		args.unshift(format);
		format=this;
	}
	let s=format.split('%');
	let out='';
	if(!format.startsWith('%'))out=s.shift();
	s.forEach((element)=>{
		if(element.startsWith('s')){
			out+=element.replace(/^s/,new String(args.shift()||''));
		}else if(element.search(/([.],[0-9]|)[f]/)!=-1){
			var decimalSlots=0;
			if(element.startsWith('.')){
				decimalSlots=eval(element.substr(1,element.indexOf('f')))
			}
		}else if(element.startsWith('d')){
			var x=args.shift();
			console.log(x)
			if(typeof(x)=="number"){
				out+=element.replace(/^d/,new String(Math.trunc(x)))
			}else out+=element.replace(/^d/,'NaN');
		}else{
			out+=element;
		}
	})
	if(args.length>0){
		if(args.length!=1)args.forEach((e)=>out+=" "+e)
		else out+=args[0];
	}
	return out;
}
