import HomeController from './home.controller';

export default (function () {
  return angular.module('HomeModule', [])
    .controller(HomeController.NAME(), HomeController);
})();
