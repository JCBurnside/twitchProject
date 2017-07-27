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