//Import modules
import HomeModule from '../home/home.module';

import MainController from './main.controller';

export default (function () {
  return angular.module('MainModule', [HomeModule.name])
    .controller(MainController.NAME(), MainController);
})();
