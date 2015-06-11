export default (function () {
  class _Controller {

    constructor($router, $location, $service) {
      console.log("Process controller instantiated");
      console.log($router);
      console.log($service);
      console.log("-------------------------------");


      let vm = this;
      vm.process = [];
      vm.processFiltered = [];
      vm.$router = $router;
      vm.$service = $service;
      vm.selectedItem = {};
      vm.icons = [
        'layers', 'cloud_download', 'file_download'
      ];
      vm.cnt = 0;
      vm.loading = false;
    }

    canDeactivate() {
      console.log("Process canDeactivate triggered");
      return true;
    };

    deactivate() {
      this.processFiltered = [];
      console.log("Process deactivate triggered");
    };

    canActivate() {
      console.log("Process canActivate triggered");
      let vm = this;
      console.log("Process activate triggered");
      vm.$service.findProcess().then(function(data){
        vm.process = data;
        vm.processFiltered = vm.process
      }).catch(function(err){
        console.log(err);
      });
      //TODO

      return true;
    };

    activate() {
      console.log(this.processFiltered);
    };

    goTo(process) {
      this.$router.parent.navigate("/process/"+process.id);
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

  _Controller.$inject = [ '$router', '$location', 'ProcessService' ];

  return _Controller;

})();


