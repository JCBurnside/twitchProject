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
    angular
        .module('twitchproject.feat',['ui.router'])
        .config(featConfig);
    function featConfig($stateProvider) {
        $stateProvider
            .state('feat',{
                url:'/featured',
                templateUrl:'/components/featured/featured.html',
                controller:FeaturedController,
                controllerAs:'ctrl',
                bindToController:this
            });
    };
    featConfig.$inject=['$stateProvider'];
    function FeaturedController($state,$http,API_BASE,$sce) {
        this.feat=undefined;
        $http.get(API_BASE+'/featured').then(res=>{
            this.feat=res.data;
            this.feat.forEach((clip,i)=>{
                this.feat[i].img=$sce.trustAsResourceUrl(clip.img);
            });
        });
    }
    FeaturedController.$inject=['$state','$http','API_BASE','$sce'];
})();

(()=>{
    angular
        .module('twitchproject.byte',['ui.router'])
        .config(byteConfig);
    function byteConfig($stateProvider) {
        $stateProvider
            .state('byte',{
                url:'/bytes',
                templateUrl:'/components/bytes/bytes.html',
                controller:ByteController,
                controllerAs:'ctrl',
                bindToController:this
            });
    };
    byteConfig.$inject=['$stateProvider'];
    function ByteController($state,BytesService,CU,$http,API_BASE){
        this.signedIn=()=>CU.isSignedIn();
        this.transfer=function(){
            var to = prompt("Who would you like to transfer to too?",CU.get().username);
            $http.get(API_BASE+"verify/"+to).then(res=>{
                if(res.data){
                    var num= eval(prompt("How much?","0"));
                    BytesService.transfer(to,num);
                }
                else
                    alert("that person does not exist"); 
            }).catch(err=>console.log(err));
        };
        this.Dump=()=>{
            $http.delete(API_BASE+'dump/');
        };
        this.randomTransfer=()=>{
            BytesService.giveRandom(prompt("How much would you like to give?","0"));
        };
    }
    ByteController.$inject=['$state','BytesService','CU','$http','API_BASE']
})();
(()=>{
    angular
    .module('twitchproject.leader',['ui.router'])
    .config(leaderConfig);
    function leaderConfig($stateProvider){
        $stateProvider
            .state('leaderboard',{
                url:'/leaderboard',
                template:'<leaderboard count="1"/>'
            });
    };
    angular.module('twitchproject')
    .directive('leaderboard',function(){
        LeaderBoardController.$inject=['$scope','$state','CU','BytesService'];
        function LeaderBoardController($scope,$state,CU,BytesService){
            console.log($scope)
            this.leaders=undefined;
            BytesService.getTop($scope.count||10).then(res=>this.leaders=res.data);
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
                count:'='
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
        .module('twitchproject.sug',['ui.router'])
        .config(SuggestionConfig);
    function SuggestionConfig($stateProvider) {
        $stateProvider
            .state('suggestion',{
                url:'/suggestion',
                templateUrl:'/components/suggestion/suggestion.html',
                controller:SuggestionController,
                controllerAs:'ctrl',
                bindToController:this
            })
            .state('suggestions',{
                url:'/suggestions',
                templateUrl:'/components/suggestion/suggestions.html',
                controller:SuggestionsController,
                controllerAs:'ctrl',
                bindToController:this
            });
    }
    SuggestionConfig.$inject=['$stateProvider'];
    function SuggestionController($state,$http,API_BASE) {
        this.submit=()=>{
            $http.post(API_BASE+'suggestions',{sug:this.sug})
            .then((res)=>{
                if(res.data)
                    $state.go('suggestions')
            })
        }
    }
    SuggestionController.$inject=['$state','$http','API_BASE'];
    function SuggestionsController($state,$http,API_BASE) {
        this.delete=(sug,i)=>{
            $http.delete(API_BASE+'suggestions/'+sug)
            .then(res=>{
                if(res.data)
                    this.suggestions.splice(i,1);
            })
            .catch(err=>console.log(err));
        }
        this.suggestions=[];
        $http.get(API_BASE+'suggestions').then(res=>this.suggestions=res.data);
    }
    SuggestionsController.$inject=['$state','$http','API_BASE'];
})();
(()=>{
	angular.module('twitchproject')
		.factory('AuthInterceptor',['SessionToken','API_BASE',
			function(SessionToken,API_BASE){
				return {
					request:function(config){
						var token=SessionToken.get();
						if(token&&config.url.indexOf(API_BASE)>-1){
							config.headers['Authorization']=token;
						}
						return config
					}
				};
			}
		]);
	angular.module('twitchproject')
		.config(['$httpProvider',function($httpProvider){
			return $httpProvider.interceptors.push('AuthInterceptor')
		}]);
})();
(function () {
    angular.module('twitchproject')
        .service('BytesService', [
            '$http', 'API_BASE', 'SessionToken', 'CU',
            function ($http, API_BASE, SessionToken, CU) {
                function BytesService() {

                }
                BytesService.prototype.getTop = function (amount) {
                    console.log(amount)
                    return $http.get(API_BASE + 'top/' + eval(amount)).catch(function (err) {
                        console.log(err);

                    });
                };
                BytesService.prototype.transfer = function (transfer, amount) {
                    if (!CU.isSignedIn() )
                        throw "NEEDS TO BE " + CU.isSignedIn() ? "linked to twitch" : "signed in";
                    else
                        return $http.put(API_BASE + 'transfer/'+transfer,{amount:amount})
                };
                BytesService.prototype.giveRandom = function (amt) {
                    if (!CU.isSignedIn() )
                        throw "NEEDS TO BE " + CU.isSignedIn() ? "linked to twitch" : "signed in";
                    else
                        return $http.put(API_BASE + 'rando/'+amt)
                            .catch(function () {

                            });
                };
                return new BytesService();
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
					}).catch(err=>console.log(err));
					return loginPromise;
				};
				UsersService.prototype.link = function() {
				};
				return new UsersService();
			}
		]);
})();
//# sourceMappingURL=bundle.js.map
