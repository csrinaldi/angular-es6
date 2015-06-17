export default (function () {

  class _Controller{

    constructor($router, $routeParams, $service) {
      let vm = this;
      vm.$service = $service;
      vm.distritos = [];
      vm.distritosFiltered = [];
      vm.layers = [];
      vm.layersFiltered = [];
      vm.selectedItem = {};
      vm.loading = false;
      vm.icons = [
        'layers', 'cloud_download', 'file_download'
      ];
      vm.cnt = 0;
      /*setInterval(function () {
        vm.size = 28;
        vm.cnt++;
        if (vm.cnt >= vm.icons.length)
          vm.cnt = 0;
        vm.icon = vm.icons[ vm.cnt ];
        vm.fill = "#abcdef";
      }, 1700);*/
    }

    canDeactivate() {
      console.log("Instsnce canDeactivate triggered");
      return true;
    };

    deactivate() {
      console.log("Instance deactivate triggered");
    };

    canActivate() {
      console.log("Instance canActivate triggered");
      let vm = this;
      vm.$service.findDistritos().then(function(data){
        vm.distritos = data;
        vm.distritosFiltered = vm.distritos
      }).catch(function(err){
        console.log(err);
      });
      return true;
    };

    activate() {
      console.log("Instance Activate triggered");


    };


    /*querySearch(query) {
      let vm = this;
      return vm.distritos.filter(vm.createFilterFor(query));
    }

    createFilterFor(query) {
      return function filterFn(distrito) {
        return (distrito.name.indexOf(query) === 0);
      };
    }

    filterForDistrito(query) {
      return function filterFn(layer) {
        return (layer.dpds === query);
      }
    }

    searchTextChange(text) {
      this.$log.info('Text changed to ' + text);
    }

    selectedItemChange(item) {
      let vm = this;
      if (item !== undefined) {
        console.log(item);
        vm.layersFiltered = vm.layers.filter(vm.filterForDistrito(item.distrito));
        console.log(vm.layersFiltered);
      }
    }

    configureLayers(distrito) {
      distrito.downloading = false;
      distrito.distrito.svgMorpheus = null;
      distrito.timerInstance = null;
    }

    onIconChange(distrito) {
      let vm = this;
      console.log(distrito.svgMorpheus);
      distrito.svgMorpheus.to(vm.icons[ distrito.actual ], {
        duration: 320,
        easing: 'expo-in',
        rotation: 'counterclock'
      })
      distrito.actual++;
      if (distrito.actual === 3)
        distrito.actual = 0;
    }


    downloadFile(distrito) {
      let vm = this;
      distrito.downloading = true;
      distrito.svgMorpheus = new SVGMorpheus('#icon_' + distrito.distrito);
      distrito.actual = 0;
    }

    downloading(distrito) {
      return !(distrito.downloading === undefined || distrito.downloading === false);
    }*/

  }

  _Controller.$inject = ['$router', '$routeParams', 'DistritoService'];

  return _Controller;

})();





