export default (function () {

  class _Controller {
    constructor($router, $location, ServiceWorkerService) {
      console.log("MainController");
      console.log($router);
      console.log($location);
      this.workerService = ServiceWorkerService;

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

    onNotification(){
      this.workerService.subscribe();
    }
  }

  _Controller.$inject = [ '$router', '$location' , 'ServiceWorkerService' ];

  return _Controller;

})();

