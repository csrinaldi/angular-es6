import InstanceController from './instance.controller';

export default (function () {
  return angular.module('InstanceModule', [])
    .controller('InstanceController', InstanceController);
})();
