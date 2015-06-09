'use strict';
import MainModule from './components/layout/main.module';


export default (function () {

  return angular.module('App',
    [
      // ngTouch has to be BEFORE ngAria, else ng-clicks happen twice
      /*'ngTouch',
       'ngAnimate',
       'ngAria',
       'ngMessages',
       'ngResource',
       'ngSanitize',
       'angular-jwt',
       'ngMaterial',
       'restangular',*/
      'ngNewRouter',
      /*'ngMdIcons'
       securityModule.name,
       routeModule.name*/
       MainModule.name

    ]
  )
    .config(
    [ /*'$httpProvider', 'jwtInterceptorProvider', 'RestangularProvider', '$mdThemingProvider', */'$componentLoaderProvider',
      function (/*$httpProvider, jwtInterceptorProvider, RestangularProvider, $mdThemingProvider,*/ $componentLoaderProvider) {
        /*$mdThemingProvider.theme('default')
         .primaryPalette('light-blue')
         .accentPalette('orange');*/

        $componentLoaderProvider.setTemplateMapping(function (name) {
          return name + '.template.html';
        });
      }
    ])
    .run(
    [ '$rootScope',
      function () {
        console.log("Running APP with ES6 and Angular JS 1.4.0 with New Router!!!!!");
      }
    ]);
})();

