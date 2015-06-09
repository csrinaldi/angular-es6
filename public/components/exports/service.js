export default (function () {
  class ExportService {
    constructor($http, $log) {
      this.$http = $http;
      this.$log = $log;
    }

    findLayers() {
      let vm = this;
      let p = new Promise(function (resolve, reject) {
        vm.$http.get('http://10.1.13.5/scitMap/get_vir_layers.php')
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
        vm.$http.get('http://10.1.13.5/scitMap/get_distritos.php')
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

  return ExportService
})();
