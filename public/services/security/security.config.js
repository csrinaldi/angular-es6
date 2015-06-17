import _AuthProvider from './auth.service';

var app = angular.module('SecurityModule', ['ngResource', 'ui.router'])
    .service('AuthService', _AuthProvider)

export default app;