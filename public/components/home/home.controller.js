export default (function () {
  class HomeController {

    constructor($router) {
      this.$router = $router;

      this.$router.config([
        { path:'/home',
            components: {
                content : 'home'
            }
        }
      ]);



    }

    activate(){

      console.log(this.$router);
      console.log("Activating controller");
    }

    cantActivate(){
      console.log("CanActivate");
      return false;
    }
  }

  return HomeController;

})();




