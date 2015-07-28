'use strict';

/* Controllers */

techChallenge
.controller('CompanyController', function ($window, $log, $scope, $routeParams, $http, $templateCache, $mdToast, $mdSidenav, Card, Company, Utils) {
    Utils.storeClientCookies($routeParams);
	
	function init() {
		$scope.card = new Card();
        $scope.company = {};        
        $window.scrollTo(0, 0);
        $http.get('partials/card-content.html').then(function (resp) {
            var template = resp.data;
            $templateCache.put('cardContentTemplate.html', template);
        });
	}
	
	function showToast(msg, delay, isLoading) {
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
	
	function loadCompanyCard() {
		showToast("Loading company info...", null, true);
        Card.get({
			cardId : $routeParams.id
		}).$promise.then(function (r) {
			showToast("Company info loaded!", 5000);
			$scope.company = Company.fromCard(r);
			$scope.card = r;		
		});
	}
	
	$scope.toggleJson = function () {
		$mdSidenav('json-view').toggle();
	};
	
	$scope.cancel = function () {
		if ($routeParams.id) {
			loadCompanyCard();
		} else {
			init();
			$scope.companyForm.$setUntouched();
		}
	};
	
	$scope.syncCardModel = function () {
		Company.toCard($scope.company, $scope.card);
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
	
	$scope.saveCompany = function() {
		showToast("Saving company info...", null, true);
		$log.info($scope.card);
		if ($scope.card.id) {
			$scope.card.$update(function (r) {
				$log.info('Card with id ' + r.cardId + ' updated.');
				showToast('Company card updated!', 5000);				
				loadCompanyCard();
			});
		} else {
			$scope.card.$create(function (r) {
				$log.info('Card created: ' + JSON.stringify(r));
				showToast('Company card saved: ' + r.cardId + '!', 5000);
				init();
				$scope.companyForm.$setUntouched();
			});
		}
	}
	
    init();	
    if ($routeParams.id) {
		loadCompanyCard();
    }

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
