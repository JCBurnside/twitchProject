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
