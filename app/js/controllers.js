'use strict';

/* Controllers */

techChallenge
.controller('CompanyController', function ($window, $log, $scope, $routeParams, $http, $templateCache, $mdToast, $mdSidenav, Card, Company, Utils) {
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
		}).$promise.then(function (r) {
			$scope.company = Company.fromCard(r);
		});
    }

    $scope.closeToast = function () {
        $mdToast.hide();
    };
    
    $scope.showToast = function (msg, delay, isLoading) {
        var toastTemplate = '<md-toast class="md-capsule"><span>' + msg + '</span></md-toast>';
		if (!delay) {
			delay = 0;
		}
        if (isLoading) {
            toastTemplate = '<md-toast class="md-capsule"><md-progress-circular md-diameter="24" md-mode="indeterminate"></md-progress-circular><span>' + msg + '</span></md-toast>';
        }
        return $mdToast.show({
            template : toastTemplate,
            hideDelay : delay,
            position : 'bottom left'
        });
    }

	$scope.toggleJson = function () {
		$mdSidenav('json-view').toggle();
	};

	$scope.saveCompany = function () {
		$scope.showToast("Saving company info...", null, true);
		if ($scope.card.id) {
			$scope.card.$update(function (r) {
				$log.info('Card with id ' + r.cardId + ' updated.');
				$scope.showToast('Company card updated!', 5000);
				$scope.init();
				$scope.companyForm.$setUntouched();
			});
		} else {
			$scope.card.$create(function (r) {
				$log.info('Card created: ' + JSON.stringify(r));
				$scope.showToast('Company card saved: ' + r.cardId + '!', 5000);
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
