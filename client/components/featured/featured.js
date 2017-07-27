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