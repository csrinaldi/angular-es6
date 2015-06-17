'use strict';
import './vendors';
import ES6Promise from 'es6-promise';
import App from './main';

(function() {
  ES6Promise.polyfill();
  angular.element(document).ready(function () {
    console.log("Boostraping Angular!!!!");
    angular.bootstrap(document.querySelector('[data-main-app]'),
      [ App.name ]
    );
  });
})();
