'use strict';
import MainModule from './components/layout/main.module';
import CoreService from './services/service.module';

import layoutTPL from './components/layout/main.template.html!text';

export default (function () {

  return angular.module('App',
    [
      // ngTouch has to be BEFORE ngAria, else ng-clicks happen twice
       'ngTouch',
       'ngAnimate',
       'ngAria',
       'ngMessages',
       'ngResource',
       'ngSanitize',
       'angular-jwt',
       'ngMaterial',
       'restangular',
       'ngNewRouter',
       'ngMdIcons',
       CoreService.name,
       MainModule.name
    ]
  )
    .config(
    [ '$httpProvider', 'jwtInterceptorProvider', 'RestangularProvider', '$mdThemingProvider', '$componentLoaderProvider',
      function ($httpProvider, jwtInterceptorProvider, RestangularProvider, $mdThemingProvider, $componentLoaderProvider) {
        $mdThemingProvider.theme('default')
         .primaryPalette('light-blue')
         .accentPalette('orange');

        console.log("Configuring App ");
        console.log($componentLoaderProvider);
        $componentLoaderProvider.setTemplateMapping(function (name) {
          return 'public/components/'+name + '/'+name+'.template.html';
        });
        /*$componentLoaderProvider.setCtrlNameMapping(function (name) {
          console.log("Retornando Controller "+name );
          return 'vm';
        });*/
      }
    ])
    .run(
    ['$templateCache',
      function ($templateCache) {
        $templateCache.put('templateId.html', layoutTPL);
        console.log("Running APP with ES6 and Angular JS 1.4.0 with New Router!!!!!");
      }
    ]);
})();

