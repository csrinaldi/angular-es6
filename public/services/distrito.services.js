export default (function () {
  class _Service {
    constructor($http, $log) {
      this.$http = $http;
      this.$log = $log;
    }

    findLayers() {
      let vm = this;
      let p = new Promise(function (resolve, reject) {
        vm.$http.get('https://scit.santafe.gov.ar/scitMap/get_vir_layers.php')
          .success(function (response) {
            console.log("Layers");
            console.log(response);
            resolve(response);
          })
          .error(function (data) {
            console.log(data);
            reject(data);
          });
      });
      return p;
    }

    findDistritos() {
      let vm = this;
      let p = new Promise(function (resolve, reject) {
        vm.$http.get('https://scit.santafe.gov.ar/scitMap/get_distritos.php')
          .success(function (data) {
            console.log("Distritos");
            console.log(data);
            resolve(data);
          })
          .error(function (data) {
            console.log(data);
            reject(data);
          });
      });
      return p;
    }
  }

  _Service.$inject = ['$http', '$log'];

  return _Service
})();
