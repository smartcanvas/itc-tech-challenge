'use strict';

/* App Module */
var techChallenge = angular.module('techChallenge', [
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngAnimate',
            'ngMaterial',
            'ngAria',
            'ui.date'
        ]);

techChallenge
.config(['$logProvider', '$httpProvider', '$routeProvider', '$mdThemingProvider',
        function ($logProvider, $httpProvider, $routeProvider, $mdThemingProvider) {
            $logProvider.debugEnabled(true);
            var $log =  angular.injector(['ng']).get('$log')
            $routeProvider
            .when('/company/new', {
                templateUrl : 'partials/company.html',
                controller : 'CompanyController'
            })
            .when('/company/:id/edit', {
                templateUrl : 'partials/company.html',
                controller : 'CompanyController'
            })
            .when('/companies', {
                templateUrl : 'partials/company-list.html',
                controller : 'CompanyListController'
            })
            .otherwise({
                redirectTo : '/company/new'
            });

            $httpProvider.interceptors.push(function ($q) {
                return {                    
                    'responseError' : function (error) {
                        // called if HTTP CODE != 2xx
                        $log.error('Error: ' + error);
                        return $q.reject(error);
                    }
                };
            });
            $mdThemingProvider.theme('default').primaryPalette('blue');
        }
    ]);
