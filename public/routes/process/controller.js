import CoreController from '../../core/core';

export default (function () {
  class ProcessController /*extends CoreController*/ {
    /**
     * Constructor
     * @param process
     * @param $log
     * @param $scope
     */
    constructor(process, $log, $scope, $state) {
      super();

      let vm = this;
      vm.process = process;
      vm.processFiltered = vm.process;
      vm.selectedItem = {};
      vm.$log = $log;
      vm.$scope = $scope;
      vm.$state = $state;
      vm.icons = [
        'layers', 'cloud_download', 'file_download'
      ];
      vm.cnt = 0;
      vm.loading = false;

      //Call some code when a state change starts
      $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        vm.loading = true;
      });

      //Call some code when a state change finishes
      $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        vm.loading = false;
      });


    }

    querySearch(query) {
      let vm = this;
      return vm.process.filter(vm.createFilterFor(query));
    }

    createFilterFor(query) {
      return function filterFn(distrito) {
        return (procces.name.indexOf(query) === 0);
      };
    }

    searchTextChange(text) {
      this.$log.info('Text changed to ' + text);
    }

    selectedItemChange($event, item) {
      console.log("Que pasa");
      let vm = this;
      console.log(vm);
      console.log(vm.$state);
      vm.$state.go("full.process.export", {'id': 'vir'});
      //$event.preventDefault();
    }
  }

  return ProcessController;

})();



