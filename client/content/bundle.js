(()=>{
	var app=angular.module('twitchproject',[
		'ui.router',
		'twitchproject.auth.signin',
		'twitchproject.auth.signup'
	]);
	function config($urlRouterProvider){
		$urlRouterProvider.otherwise('/signin');
	}
	config.$inject=['$urlRouterProvider'];
	app.config(config);
	app.constant('API_BASE','//localhost:3000/api/');
})();
(()=>{
	angular
		.module('twitchproject.auth.signin',['ui.router'])
		.config(signinConfig);
	function signinConfig($stateProvider) {
		$stateProvider
			.state('signin',{
				url:'/signin',
				templateUrl:'/components/auth/signin.html',
				controller:SigninController,
				controllerAs:'ctrl',
				bindToController:this
			});
	}
	signinConfig.$inject=['$stateProvider'];
	function SigninController($state,UsersService){
		this.user={};
		this.login=()=>{
			UsersService.login(this.user).then(res=>{
				console.log(res);

			});
		};
	}
	SigninController.$inject=['$state','UsersService'];	
})();


(()=>{
	angular
		.module('twitchproject.auth.signup',['ui.router'])
		.config(signupConfig);
		function signupConfig($stateProvider){
			$stateProvider
			.state('signup',{
				url:'/signup',
				templateUrl:'/components/auth/signup.html',
				controller:SignUpController,
				controllerAs:'ctrl',
				bindToController:this
			});
		}
		signupConfig.$inject=['$stateProvider'];
		function SignUpController($state,UsersService){
			var vm=this
			vm.user={};
			vm.message="Sign up for an account!";
			vm.submit=function(){
				console.log(vm.user);
				UsersService.create(vm.user).then(function(res){
					console.log(res);

				});
			};
		}
		SignUpController.$inject=['$state','UsersService'];
})();
(()=>{
	angular.module('twitchproject')
	.directive('userlinks',function(){
		UserLinksController.$inject=['$state','CU','SessionToken'];
		function UserLinksController($state,CU,SessionToken) {
			this.user=()=>CU.get()||{};
			this.signedIn=()=>!!(this.user().id);
			this.logout=()=>{
				CU.clear();
				SessionToken.clear();
				$state.go('signin');
			}
			this.isLinked=()=>!!(this.user().twitchId);
		}
		return{
			scope:{},
			controller:UserLinksController,
			controllerAs:'ctrl',
			bindToController:true,
			templateUrl:'/components/auth/userlinks.html'
		}
	})
})();
(function(){
	angular.module('twitchproject')
		.service('CU',['$window',function($window){
			function CurrentUser(){
				var cu=$window.localStorage.getItem('currentUser');
				if(cu&&cu!=='undefined')this.cu=JSON.parse($window.localStorage.getItem('currentUser'));
			}
			CurrentUser.prototype.set = function(user) {
				this.cu=user;
				$window.localStorage.setItem('currentUser',JSON.stringify(user));
			};
			CurrentUser.prototype.get = function() {
				return this.cu||{};
			};
			CurrentUser.prototype.clear = function() {
				this.cu=undefined;
				$window.localStorage.removeItem('currentUser');
			};
			CurrentUser.prototype.isSignedIn = function() {
				return !!this.get().id;
			};
			return new CurrentUser();
		}]);
})();
(function(){
	angular.module('twitchproject')
		.service('SessionToken',['$window',function($window){
			function SessionToken(){
				this.sessionToken=$window.localStorage.getItem('sessionToken');
			}
			SessionToken.prototype.set = function(token) {
				this.sessionToken=token;
				$window.localStorage.setItem('sessionToken',token);
			};
			SessionToken.prototype.get = function() {
				return this.sessionToken;
			};
			SessionToken.prototype.clear = function() {
				this.sessionToken=undefined;
				$window.localStorage.removeItem('sessionToken');
			};
			return new SessionToken();
		}]);
})();
(function(){
	angular.module('twitchproject')
		.service('UsersService',[
			'$http','API_BASE','SessionToken','CU',
			function($http,API_BASE,SessionToken,CU){
				function UsersService(){

				}
				UsersService.prototype.create = function(user) {
					var userPromise=$http.post(API_BASE+'signup',{
						user:user
					});
					userPromise.then(function(res){
						SessionToken.set(res.data.sessionToken);
						CU.set(res.data.user);
					});
					return userPromise;
				};
				UsersService.prototype.login = function(user) {
					var loginPromise=$http.post(API_BASE+'login',{
						user:user
					});
					loginPromise.then(function(res){
						SessionToken.set(res.data.token);
						CU.set(res.data.user);
					});
					return loginPromise;
				};
				UsersService.prototype.link = function() {
				};
				return new UsersService();
			}
		]);
})();
//# sourceMappingURL=bundle.js.map
