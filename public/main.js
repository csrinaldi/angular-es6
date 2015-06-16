'use strict';
import ServiceWorker from './share/service.worker.module';
import CoreService from './services/service.module';
import ProcessModule from './components/process/process.module';
import InstanceModule from './components/instance/instance.module';
import MainController from './main.controller';

//import layoutTPL from './components/layout/main.template.html!text';

export default (function () {

  return angular.module('App',
    [
      // ngTouch has to be BEFORE ngAria, else ng-clicks happen twice
      'ngTouch',
      'ngMessages',
      'angular-jwt',
      'ngMaterial',
      'restangular',
      'ngNewRouter',
      'ngMdIcons',
      ServiceWorker.name,
      CoreService.name,
      ProcessModule.name,
      InstanceModule.name
    ])
    .controller("MainController", MainController)

    .config(
    [ '$httpProvider', 'jwtInterceptorProvider', 'RestangularProvider', '$mdThemingProvider', '$componentLoaderProvider',
      function ($httpProvider, jwtInterceptorProvider, RestangularProvider, $mdThemingProvider, $componentLoaderProvider) {

        /*$mdThemingProvider.theme('default')
          .primaryPalette('light-blue')
          .accentPalette('orange');
        */

        $componentLoaderProvider.setTemplateMapping(function (name) {
          return 'public/components/' + name + '/' + name + '.template.html';
        });
      }
    ])
    .run(
    [ '$templateCache','ServiceWorkerService',
      function ($templateCache,ServiceWorkerService) {
        //$templateCache.put('templateId.html', layoutTPL);
        console.log("Running APP with ES6 and Angular JS 1.4.0 with New Router!!!!!");
        ServiceWorkerService.activate();
      }
    ]);
})();

