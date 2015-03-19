//Main modules
import 'angular';
import 'angular-ui/ui-router';
import 'github:angular/bower-material@0.8.3';

//Project modules
import core from './core/config';

let mainModule = angular.module('app', ['ui.router', 'ngMaterial']);

export default mainModule;