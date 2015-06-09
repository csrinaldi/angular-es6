/**
 * Controller and Services Class Imports
 *
 *
 *
 *
import _ToolbarController from './toolbar.controller';
import _ProcessController from './controller';
import _ProcessService from './service';
import _ExportController from './exports/controller';
import _ContentController from './exports/content.controller';
import _ExportService from './exports/service';

import contentTPL from './views/content.template.html!text';
import toolbarTPL from './views/toolbar.template.html!text';

import exportListTPL from './exports/views/list.template.html!text';
import exportContentTPL from './exports/views/content.template.html!text';


export default (function () {
  class Config {
    constructor($stateProvider) {
      $stateProvider.state(
        'full.process', {
          abstract: true,
          url: '/process',
          views: {
            "toolbar": {
              template: toolbarTPL,
              controller: 'ToolbarController',
              controllerAs: "vm"
            },
            "content": {
              template: "<ui-view></ui-view>"
            }
          }
        })
        .state(
        'full.process.list', {
          url: '',
          views: {
            "": {
              template: contentTPL,
              controller: _ProcessController,
              controllerAs: 'vm'
            }
          },
          resolve: {
            process: function (ProcessService) {
              return ProcessService.findProcess();
            }
          },
          data: {
            title: "Gestión de Procesos",
            sub: "Gestione el lanzamiento y estado de sus procesos",
            icon: "access_time"
          }
        })
        .state(
        'full.process.export', {
          url: '/:id',
          views: {
            "": {
              template: exportListTPL,
              controller: 'ExportController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            distritos: function (ExportService) {
              return ExportService.findDistritos();
            },
            layers: function (ExportService) {
              return ExportService.findLayers();
            }
          },
          data: {
            title: "Generación de Variables Territoriales",
            sub: "Gestione las variables territoriales y descargas de puntos",
            icon: "layers"
          }
        }
      )
        .state(
        'full.process.export.distrito', {
          url: '/:id/distrito/:idDistrito',
          views: {
            "": {
              template: exportContentTPL,
              controller: 'ContentController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            distrito: function (distritos,$stateParams) {
              distritos.filter(function(distrito){
                return (distrito.distrito === $stateParams.idDistrito);
              })
            },

            data: {
              title : "Distrito: " + distrito.name + "("+distrito.distrito+")",
              subtitle : "Configure las variables de su distrito",
              icon :""

            }
          },
          data: {
            title: "Generación de Variables Territoriales",
            sub: "Gestione las variables territoriales y descargas de puntos",
            icon: "layers"
          }
        }
      );
    }

    static factory($stateProvider) {
      Config.instance = new Config($stateProvider);
      return Config.instance;
    }
  }

  class Run {
    constructor($rootScope) {
      console.log("RUN");
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          console.log(toState);
        });
    }

    static factory($rootScope) {
      Run.instance = new Config($rootScope);
      return Run.instance;
    }
  }


  Config.factory.$inject = [ '$stateProvider' ];
  Run.factory.$inject = [ '$rootScope' ];

  return angular.module('ProcessModule',
    [ 'ui.router' ])
    .controller('ProcessController', _ProcessController)
    .controller('ExportController', _ExportController)
    .controller('ContentController', _ContentController)
    .controller('ToolbarController', _ToolbarController)

    .service('ExportService', _ExportService)
    .service('ProcessService', _ProcessService)
    .config(Config.factory)
    .run(Run.config);

})();
*/
