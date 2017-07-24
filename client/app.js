// import * as configs from './config';
(()=>{
	var app=angular.module('twitchproject',[
		'ui.router',
		'twitchproject.auth.signin',
		'twitchproject.auth.signup',
		'twitchproject.sug'
	]);
	function config($urlRouterProvider){
		$urlRouterProvider.otherwise('/signin');
	}
	config.$inject=['$urlRouterProvider'];
	app.config(config);
	app.constant('API_BASE',location.hostname==="localhost"?'//localhost:3000/api/':'');
})();