export default (function () {

  class _Controller {

    constructor($router, $location, $service, $http, ServiceWorkerService) {
      let vm = this;
      vm.process = [];
      vm.$http = $http;
      vm.processFiltered = [];
      vm.$router = $router;
      vm.$service = $service;
      vm.selectedItem = {};
      vm.icons = [
        'layers', 'cloud_download', 'file_download'
      ];
      vm.cnt = 0;
      vm.loading = false;
      vm.$serviceWorker = ServiceWorkerService;
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
      event.stopPropagation();
      let vm = this;
      vm.$serviceWorker.sendMessage({name : "RegisterEventSource", path : "hhh"}).then(function(data){
        console.log(data);
      }).catch(function(err){
        console.log(err);
      });

      /*let vm = this;
      vm.$http(
        {
          url: 'http://localhost:3000/api/hello',
          //url: 'http://localhost/rest/app_dev.php/hello',
          method: "GET",
          withCredentials: false,
          headers: {
            'scit-token': 'a833f5cac52c2cc5401ff2f73dd7203143e2f65b',
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      ).success(function (data) {
          console.log(data);
        }
      ).error(function (err) {
          console.log("Notification error");
          console.log(err);
        }
      );*/

      //this.$router.parent.navigate("/process/"+process.id);
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

  _Controller.$inject = [ '$router', '$location', 'ProcessService' , '$http', 'ServiceWorkerService'];

  return _Controller;

})();


