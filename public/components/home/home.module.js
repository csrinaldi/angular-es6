import HomeController from './home.controller';

export default (function () {
  return angular.module('HomeModule', ['ngNewRouter'])
    .controller('HomeController', HomeController);
})();
