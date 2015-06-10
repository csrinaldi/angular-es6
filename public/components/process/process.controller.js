export default (function () {
  class _Controller  {

    constructor($service) {
      let vm = this;
      vm.$service = $service;
      vm.selectedItem = {};
      vm.icons = [
        'layers', 'cloud_download', 'file_download'
      ];
      vm.cnt = 0;
      vm.loading = false;
    }

    activate(){
      console.log("Activate");
      let vm = this;
    }

    canActivate(){
      console.log("canActivate");
      let vm = this;
      vm.$service.findProcess().then(function(data){
        vm.process = data;
        vm.processFiltered = vm.process;
      });
      return true;
    }

    /*querySearch(query) {
      let vm = this;
      return vm.process.filter(vm.createFilterFor(query));
    }

    createFilterFor(query) {
      return function filterFn(distrito) {
        return (vm.procces.name.indexOf(query) === 0);
      };
    }

    searchTextChange(text) {
      this.$log.info('Text changed to ' + text);
    }

    selectedItemChange($event, item) {
      let vm = this;
    }*/
  }

  _Controller.$inject = ['ProcessService'];

  return _Controller;

})();


