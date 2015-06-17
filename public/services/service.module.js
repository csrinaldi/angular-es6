import DistritoService from './distrito.services';

export default (function () {
  return angular.module('CoreServices', [])
    .service('DistritoService', DistritoService);
})();
