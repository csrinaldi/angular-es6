import ProcessController from './process.controller';
import ProcessService from './process.service';

export default (function () {
  return angular.module('ProcessModule', [])
    .controller('ProcessController', ProcessController)
    .service('ProcessService', ProcessService);
})();
