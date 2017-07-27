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
                BytesService.prototype.transfer = function (transferId, amount) {
                    if (!CU.isSignedIn() )
                        throw "NEED TO BE " + CU.isSignedIn() ? "linked to twitch" : "signed in";
                    else
                        return $http.put(API_BASE + 'transfer/' + CU.get()._id, { to: transferId, amount: amount })
                };
                BytesService.prototype.giveRandom = function () {
                    if (!CU.isSignedIn() )
                        throw "NEED TO BE " + CU.isSignedIn() ? "linked to twitch" : "signed in";
                    else
                        return $http.put(API_BASE + 'rando/' + CU.get()._id)
                            .catch(function () {

                            });
                };
                return new BytesService();
            }
        ])
})();