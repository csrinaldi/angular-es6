export default (function () {

  class _Controller {
    constructor($router, $location) {
      console.log("MainController");
      console.log($router);
      console.log($location);

      $location.path('/');
      $router.config([
        {
          path: '/process',
          components: {
            main: 'process'
          }
        },
        {
          path: '/process/:id',
          components: {
            main: 'instance'
          }
        }
      ]);
    }

    activate() {
      console.log("Activating MainController");
    }

    deactivate(){
      console.log("Desactiving MainController");
    }

    cantActivate() {
      console.log("CanActivate Main");
      return true;
    }

    canDeactivate() {
      console.log("CanDeactivate Main");
      return true;
    }
  }

  _Controller.$inject = [ '$router', '$location' ];

  return _Controller;

})();

