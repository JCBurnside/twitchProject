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