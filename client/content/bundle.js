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
			this.signedIn=()=>!!(this.user()._id||false);
			this.logout=()=>{
				CU.clear();
				SessionToken.clear();
				$state.go('signin');
			}
			this.isLinked=()=>!!(this.user().twitchId||false);
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

(()=>{
    angular.module('twitchproject')
    .directive('leaderboard',function(){
        LeaderBoardController.$inject=['$scope','$state','CU','ByteService'];
        function LeaderBoardController($scope,$state,CU,ByteService){
            
            this.leaders=undefined;
            this.getLeaders=()=>ByteService.getTop($scope.count||10).then(res=>this.leaders=res.data);
            this.format=bytes=>{
                if(bytes/1000000000)
                    return "%.2fB".format(bytes/1000000000);
                if(bytes/1000000)
                    return "%.2fM".format(bytes/1000000);
                if(bytes/1000)
                    return "%.2fK".format(bytes/1000);
                return bytes;
            }
        };
        return{
            scope:{
                count:'=count'
            },
            controller:LeaderBoardController,
            controllerAs:'ctrl',
            bindToController:true,
            templateUrl:'/components/bytes/leaderboard.html'
        }
    });
})();
(()=>{
    angular
        .module('twitchproject.feat',['ui.router'])
        .config(featConfig);
    function featConfig($stateProvider) {
        $stateProvider
            .state('',{

            });
    }
})();
(()=>{
    angular
        .module('twitchproject.sug',['ui.router'])
        .config(SuggestionConfig);
    function SuggestionConfig($stateProvider) {
        $stateProvider
            .state('suggestions',{
                url:'/suggestions',
                templateUrl:'/components/suggestion/suggestion.html',
                controller:SuggestionController,
                controllerAs:'ctrl',
                bindToController:this
            });
    }
    SuggestionConfig.$inject=['$stateProvider'];
    function SuggestionController($state,$sce) {
        // "https://formspree.io/"+
        this.email=$sce.trustAsResourceUrl("https://formspree.io/"+"jcburnside97@gmail.com");
    }
    SuggestionController.$inject=['$state','$sce'];
})();
(function () {
    angular.module('twitchproject')
        .service('BytesService', [
            '$http', 'API_BASE', 'SessionToken', 'CU',
            function ($http, API_BASE, SessionToken, CU) {
                function BytesService() {

                }
                BytesService.prototype.getTop = function (amount) {
                    return $http.get(API_BASE + 'top/' + amount).catch(function (err) {
                        console.log(err);

                    });
                };
                BytesService.prototype.transfer = function (transferId, amount) {
                    if (!CU.isSignedIn() || !CU.get().twitchId)
                        throw "NEED TO BE " + CU.isSignedIn() ? "linked to twitch" : "signed in";
                    else
                        return $http.put(API_BASE + '/transfer/' + CU.get()._id, { to: transferId, amount: amount })
                };
                BytesService.prototype.giveRandom = function () {
                    if (!CU.isSignedIn() || !CU.get().twitchId)
                        throw "NEED TO BE " + CU.isSignedIn() ? "linked to twitch" : "signed in";
                    else
                        return $http.put(API_BASE + '/rando/' + CU.get()._id)
                            .catch(function () {

                            });
                };
            }
        ])
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
				return !!this.get()._id;
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
