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