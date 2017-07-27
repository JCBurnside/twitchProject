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
        }
    }
    SuggestionController.$inject=['$state'];
    function SuggestionsController($state,$http,API_BASE) {
        this.delete=sug=>{
            $http.delete(API_BASE+'suggestions/'+sug._id)
            .catch(err=>console.log(err));
        }
        this.suggestions=[];
        $http.get(API_BASE+'suggestions').then(res=>this.suggestions=res.data);
    }
    SuggestionsController.$inject=['$state','$http','API_BASE'];
})();