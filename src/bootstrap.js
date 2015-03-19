import mainModule from './main';

console.log("GG");

angular.element(document).ready(function() {
    angular.bootstrap(document, [mainModule.name], {
        //strictDi: true
    });
    console.log("Ready");
});
