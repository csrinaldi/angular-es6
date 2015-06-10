export default (function () {

  class _Controller {
    constructor($router, $location) {
      console.log("MainController");
      console.log($router);
      console.log($location);

      $location.path('/process');
      $router.config([
        { path:'/process',  component: 'process' },
        { path:'/process/:id',  component : 'instance' }
      ]);
    }

    activate(){
      console.log("Activating MainController");
    }

    cantActivate(){
      console.log("CanActivate");
      return false;
    }

    canDeactivate(){
      console.log("CanDeactivate");
    }
  }

  _Controller.$inject = [ '$router', '$location'];

  return _Controller;

})();

