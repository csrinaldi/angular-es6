import ServiceWorkerService from './service.worker.service';

export default (function () {
  return angular.module('ServiceWorkerModule', [])
    .service('ServiceWorkerService', ServiceWorkerService);
})();

