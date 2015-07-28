'use strict';

/* Controllers */

techChallenge
.controller('CompanyController', function ($window, $log, $scope, $routeParams, $http, $templateCache, Card, Company, Utils) {
    Utils.storeClientCookies($routeParams);
    $scope.init = function () {
        $scope.card = new Card();
        $scope.company = {};
		$window.scrollTo(0, 0);
        $http.get('partials/card-content.html').then(function (resp) {
            var template = resp.data;
            $templateCache.put('cardContentTemplate.html', template);
        });
    };
    $scope.init();
    if ($routeParams.id) {
        $scope.card = Card.get({
                cardId : $routeParams.id
            });
        $scope.company = Company.fromCard($scope.card);
    }
    $scope.saveCompany = function () {
        if ($scope.card.id) {
            $scope.card.$update(function (r) {
                $log.info('Card with id ' + r.cardId + ' updated.');
                $scope.init();
                $scope.companyForm.$setUntouched();
            });
        } else {
            $scope.card.$create(function (r) {                
                $log.info('Card created: ' + JSON.stringify(r));
                $scope.init();
                $scope.companyForm.$setUntouched();
            });
        }
    };

    $scope.syncCardModel = function () {
        Company.toCard($scope.company, $scope.card);
    };

    $scope.cancel = function () {
        $scope.init();
        $scope.companyForm.$setUntouched();
    };

    $scope.isCompanyValid = function () {
        if ($scope.companyForm.$pristine) {
            return false;
        }
        if ($scope.companyForm.$invalid) {
            return false;
        }
        return true;
    };
})
.controller('CompanyListController', function ($log, $scope, $routeParams, Card, Company, Utils) {
    Utils.storeClientCookies($routeParams);
    $scope.companies = [];
    Card.query({
        status : 'APPROVED'
    }).$promise.then(function (r) {
        $scope.result = r;
        $scope.cards = r.data;
        for (var i = 0; i < $scope.cards.length; i++) {
            $scope.companies.push(Company.fromCard($scope.cards[i]));
        }
        $log.info('Got ' + r.meta.count + ' objects');
    }, function (e) {
        $log.error('Error: ' + e);
    });
})
