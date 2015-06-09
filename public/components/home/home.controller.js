import CoreController from '../../core/core';

export default (function () {
  class HomeController /*extends CoreController*/ {

    constructor($router) {
      $router.config([{ path:'/', component: 'home' }]);
    }

    activate(){
      console.log("Activating controller");
    }



    static NAME() {
      return "HomeController";
    }
  }

  return HomeController;

})();




