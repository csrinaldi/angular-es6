//Import modules
import HomeModule from '../home/home.module'
import ProcessModule from '../process/process.module'

import MainController from './main.controller';

export default (function () {
  return angular.module('MainModule', [HomeModule.name, ProcessModule.name])
    .controller("MainController", MainController);
})();
