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