'use strict';

/* Controllers */

techChallenge
.controller('CompanyController', function ($window, $log, $scope, $routeParams, $http, $templateCache, $mdToast, Card, Company) {
    function init() {
		$scope.validImage = false;
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
	
	function showErrorMessage(e, msg) {
		var errorMsg = msg || '';
		if (e) {
			if (e.data) {
				$log.error('HTTP error ' + e.status + ' ' + e.statusText + ': ' + e.data.message);
				errorMsg.concat(': ' + e.data.message + ' (status ' + e.status + ' ' + e.statusText + ')');
			} else {
				$log.error('HTTP error ' + e.status + ' ' + e.statusText);
				errorMsg.concat(': ' + ' status ' + e.status + ' ' + e.statusText);
			}			
		}
		showToast(errorMsg, 0);
	}
	
	function loadCompanyCard() {
		showToast("Loading company info...", 3000, true);
		if ((!isNaN($routeParams.id)) && (Number($routeParams.id) % 1 === 0)) {
			Card.get({
				cardId : $routeParams.id
			}).$promise.then(function (r) {
				showToast('Company info loaded!', 5000);
				$scope.company = Company.fromCard(r);
				$scope.card = r;		
				$log.debug($scope.card);
			}, function (e) {
				showErrorMessage(e, 'Error loading company page');
			});
		} else {
			showErrorMessage(null, $routeParams.id + ' is not a valid id.');
		}
	}
	
	function createCompanyCard() {
		$scope.card.$create(function (r) {
			$log.info('Card created: ' + JSON.stringify(r));
			showToast('Company card saved: ' + r.id + '!', 5000);
			init();
			$scope.companyForm.$setUntouched();
		}, function (e) {
			showErrorMessage(e, 'Error creating company page');
		});
	}
	
	function updateCompanyCard() {
		$scope.card.$update(function (r) {			
			$log.info('Card updated.');
			showToast('Company card updated!', 5000);				
			loadCompanyCard();
		}, function (e) {
			showErrorMessage(e, 'Error saving company page');
		});
	}

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
	
	$scope.validateImage = function () {
		if ($scope.company.logoImgUrl) {
			if (!$scope.company.logoImgUrl.indexOf('http') == 0) {
				$scope.company.logoImgUrl = 'http://'.concat($scope.company.logoImgUrl);
			}
		}
		$scope.syncCardModel();
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
		if (this.validImage) {
			$log.debug($scope.card);
			showToast("Saving company info...", null, true);
			if ($scope.card.id) {
				updateCompanyCard();
			} else {
				createCompanyCard();
			}
		} else {
			showErrorMessage(null, 'The company logo url doesn\'t point to an image.');
		}
	}

    init();
    if ($routeParams.id) {
		loadCompanyCard();
    }

})
.controller('CompanyListController', function ($log, $scope, $routeParams, Card, Company) {
	$scope.companies = [];
	Card.query({
		status : 'APPROVED',
		q: $routeParams.q
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