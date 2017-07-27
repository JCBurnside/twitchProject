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
        this.tranfer=function(){
            var to = prompt("Who would you like to transfer to too?",CU.get().username);
            $http.get(API_BASE+"verify").then(res=>{
                var num= eval(prompt("How much?","0"));
                BytesService.transfer(res.data,num);
            }).catch(err=>console.log(err));
        };
        this.Dump=()=>{
            $http.delete(API_BASE+'bytes/'+CU.get()._id);
        };
        this.randomTransfer=()=>{
            BytesService.giveRandom();
        };
    }
    ByteController.$inject=['$state','BytesService','CU','$http','API_BASE']
})();