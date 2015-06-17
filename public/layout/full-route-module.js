import ProcessModule from '../routes/process/config';
import fullTpl from './fullview-template.html!text';

export default (function () {

  /**
   * Controller for Layout beahavior
   */
  class _Controller {
    constructor(authService, $mdUtil, $mdSidenav) {
      this.authService = authService;
      this.$mdUtil = $mdUtil;
      this.$mdSidenav = $mdSidenav;
    }

    getView() {
      return this.authService.isAuthenticated();
    }

    openSidenav() {
      let vm = this;
      vm.$mdSidenav('left')
        .toggle()
        .then(function () {

        });
    }

    openSearch() {

    }
  }

  /**
   * Injection of Dependencies
   * @type {string[]}
   */
  _Controller.$inject = [ 'AuthService', '$mdUtil', '$mdSidenav' ];

  /**
   * COnfigure class
   */
  class Config {
    constructor($stateProvider) {
      console.log('Config');
      $stateProvider.state('full', {
        abstract: true,
        template: fullTpl,
        controller: _Controller,
        controllerAs: 'vm'
      });
    }

    /**
     * This is hook for "this" reference
     * @returns {Config|*|Config.instance}
     */
    static factory($stateProvider) {
      Config.instance = new Config($stateProvider);
      return Config.instance;
    }

  }

  class Run {
    constructor($rootScope) {}
    /**
     * This is hook for "this" reference
     * @returns {Run|*|Run.instance}
     */
    static factory($rootScope) {
      Run.instance = new Run($rootScope);
      return Run.instance;
    }
  }

  return angular.module('fullViewRouteModule', [
    'ui.router',
    ProcessModule.name
  ])
    .config(Config.factory)
    .run(Run.factory);

})();
