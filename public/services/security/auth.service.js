/**
 *
 */
class AuthService {

    /**
     * @ngInject
     *
     * @param $http
     * @param $q
     * @param $window
     */
    constructor($q, $http, $window, jwtHelper) {
        this.$http = $http;
        this.$q = $q;
        this.principal = null;
        this.$window = $window;
        this.$jwtHelper = jwtHelper;
        this.authenticated = false;
    }

    url_base64_decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
    }

    /**
     * Login with credentials and obtain JWT
     *
     * @param credentials
     * @returns {*}
     */
    login(credentials) {
        let vm = this;
        let deferred = this.$q.defer();
        /*vm.$http.post('http://localhost:3000/authenticate', credentials).success(
            function (data, status, headers, config) {
                vm.principal = vm.$jwtHelper.decodeToken(data.token);
                vm.isAuthenticated = true;
                vm.$window.localStorage.setItem('token', data.token);
                deferred.resolve(vm.principal);
            }).error(function (data, status, headers, config) {
                vm.$window.localStorage.removeItem('token');
                vm.isAuthenticated = false;
                deferred.reject();
            });*/
        this.authenticated = true;
        deferred.resolve(null);
        return deferred.promise;
    }

    logout(){
        "use strict";
        this.authenticated = false;
        this.principal = null;
    }

    isAuthenticated() {
        "use strict";
        return this.authenticated;
    }

    getPrincipal() {
        "use strict";
        return this.principal;
    }
}

export default AuthService;
