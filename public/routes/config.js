import FullRouteModule from '../layout/full-route-module';

let routeModule = angular.module('RouteConfigModule', [ 'ui.router',  FullRouteModule.name ]

).config([
        '$locationProvider',
        '$urlRouterProvider',
        function ($locationProvider,
                  $urlRouterProvider,
                  $httpProvider,
                  $compileProvider,
                  $controllerProvider,
                  $rootScopeProvider,
                  $stateProvider) {

            //$locationProvider.html5Mode(true);
            //$urlRouterProvider.otherwise('/user/login');
            //$urlRouterProvider.when('/', '/process');
        }
    ]
).run( ['$rootScope', '$state',
        function ($rootScope, $state) {
            $rootScope.$state = $state;
        }
    ]);

export default routeModule;
