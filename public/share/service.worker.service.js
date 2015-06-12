/**
 * Created by scit on 12/06/15.
 */
export default (function () {

  class ServiceWorkerService {

    constructor($window) {
      this.navigator = $window.navigator;
    }

    activate(){
      let vm = this;
      if ('serviceWorker' in vm.navigator) {
        vm.navigator.serviceWorker.register("public/share/worker.js", {scope : 'public/share/'}).then(function (registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
      }
    }
  }
  return ServiceWorkerService;
})();
