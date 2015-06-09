/*export default (function () {

  class ProcessService {
    constructor($http, $log) {
      console.log("Instanciando el Servicio");
      this.$http = $http;
      this.$log = $log;
    }

    findProcess() {
      let vm = this;
      let p = new Promise(function (resolve, reject) {
        var process = [];
        process.push({'id': 'vir', 'name': "Gestión de variables Territoriales", desc: "Gestiona la creación de variables territoriales y la descarga de los archivos generados"});
        process.push({'id': 'imp_parc', 'name': "Importacion de Parcelas"});
        process.push({'id': 'imp_finc', 'name': "Importacion de Fincas"});
        resolve(process);
      });
      return p;
    }
  }

  return ProcessService;

})();*/
