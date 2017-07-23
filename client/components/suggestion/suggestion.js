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