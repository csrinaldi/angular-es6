'use strict';

angular
        .module('scitClientApp', [
            'ngCookies',
            'ngResource',
            'ngSanitize',
            'ui.router'
        ])
        .config(function($stateProvider, $urlRouterProvider) {
            //
            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/");
            //
            // Now set up the states
            $stateProvider
                    .state('process', {
                        url: "/process",
                        templateUrl: "views/process.html",
                        controller: 'ProcessController'
                        
                    })
                    .state('process.list', {
                        url: "/process/list",
                        templateUrl: "views/process.list.html",
                        controller: 'ProcessController'
                    })
                    .state("home", {
                        url: "/",
                        templateUrl: "views/home.html",
                        controller: 'HomeController'
                    })
        });

