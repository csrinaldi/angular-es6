export default (function () {

  class _Controller {
    constructor($router, $location, authService, $mdUtil, $mdSidenav) {
      this.authService = authService;
      this.$mdUtil = $mdUtil;
      this.$mdSidenav = $mdSidenav;
      $location.path('/');
      $router.config([{ path:'/' , components : {content : 'home'}}]);
      console.log($router);
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

    static NAME() {
      return "MainController";
    }
  }

  /**
   * Injection of Dependencies
   * @type {string[]}
   */
  _Controller.$inject = [ '$router', 'AuthService', '$mdUtil', '$mdSidenav' ];

  return _Controller;

})();
