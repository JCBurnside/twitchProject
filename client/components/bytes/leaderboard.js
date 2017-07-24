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