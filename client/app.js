(()=>{
	var app=angular.module('twitchproject',[
		'ui.router',
		'twitchproject.auth.signin',
		'twitchproject.auth.signup',
		'twitchproject.sug',
		'twitchproject.leader',
		'twitchproject.byte'
	]);
	function config($urlRouterProvider){
		$urlRouterProvider.otherwise('/signin');
	}
	config.$inject=['$urlRouterProvider'];
	app.config(config);
	app.constant('API_BASE',location.hostname==="localhost"?'//localhost:3000/api/':'');
})();