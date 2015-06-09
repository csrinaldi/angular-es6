import SVGMorpheus from 'SVG-Morpheus';
import CoreController from '../../../core/core';

export default (function () {

  class ExportController {


    constructor(distritos, layers, $scope) {
      this.distritos = distritos;
      this.layers = layers;
      this.distritosFiltered = this.distritos;
      this.layersFiltered = {};
      this.selectedItem = {};
      this.loading = false;
      this.icons = [
        'layers', 'cloud_download', 'file_download'
      ];

      let vm = this;
      //Call some code when a state change starts
      $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        vm.loading = true;
      });

      //Call some code when a state change finishes
      $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        vm.loading = false;
      });

      vm.cnt = 0;

      setInterval(function () {
        vm.size = 28;
        vm.cnt++;
        if (vm.cnt >= vm.icons.length)
          vm.cnt = 0;
        vm.icon = vm.icons[ vm.cnt ];
        vm.fill = "#abcdef";
      }, 1700);
    }

    querySearch(query) {
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
      /*distrito.timerInstance = function () {
       console.log("llamando");
       vm.onIconChange(distrito);
       }*/

    }

    downloading(distrito) {
      return !(distrito.downloading === undefined || distrito.downloading === false);
    }

  }

  return ExportController;

})();





