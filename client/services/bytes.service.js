(function () {
    angular.module('twitchproject')
        .service('BytesService', [
            '$http', 'API_BASE', 'SessionToken', 'CU',
            function ($http, API_BASE, SessionToken, CU) {
                function BytesService() {

                }
                BytesService.prototype.getTop = function (amount) {
                    console.log(amount)
                    return $http.get(API_BASE + 'top/' + eval(amount)).catch(function (err) {
                        console.log(err);

                    });
                };
                BytesService.prototype.transfer = function (transfer, amount) {
                    if (!CU.isSignedIn() )
                        throw "NEEDS TO BE " + CU.isSignedIn() ? "linked to twitch" : "signed in";
                    else
                        return $http.put(API_BASE + 'transfer/'+transfer,{amount:amount})
                };
                BytesService.prototype.giveRandom = function (amt) {
                    if (!CU.isSignedIn() )
                        throw "NEEDS TO BE " + CU.isSignedIn() ? "linked to twitch" : "signed in";
                    else
                        return $http.put(API_BASE + 'rando/'+amt)
                            .catch(function () {

                            });
                };
                return new BytesService();
            }
        ])
})();