'use strict';
import loginTpl from './login.tpl.html!text';

class UserRouterConfig {

    /**
     * @param $stateProvider
     */
    constructor($stateProvider) {
        $stateProvider
            .state('layout.users', {
                abstract: true,
                template : "<ui-view></ui-view>"
            })
            .state('layout.users.login', {
                url: '/login',
                template: loginTpl
            })
    }


    /**
     * This is hook for "this" reference
     * @returns {LayoutRouterConfig|*|LayoutRouterConfig.instance}
     */
    static factory($stateProvider) {
        UserRouterConfig.instance = new UserRouterConfig($stateProvider);
        return UserRouterConfig.instance;
    }

}
UserRouterConfig.factory.$inject = [ '$stateProvider' ];

/**
 * @classdesc Configure behavior of routing change
 * @author Cristian Rinaldi
 */
class UserRouter {
    /**
     * @param $rootScope
     * @param $document
     */
    constructor($rootScope, $document) {

    }

    /**
     * This is hook for "this" reference
     * @returns {LayoutRouter|*|LayoutRouter.instance}
     */
    static factory($rootScope, $document) {
        UserRouter.instance = new UserRouter($rootScope, $document);
        return UserRouter.instance;
    }
}

//Inject dependencies in factory method
UserRouter.factory.$inject = [ '$rootScope', '$document' ];

const name = 'userRouteModule';

let m = angular.module(name, [ 'ui.router' ])
    .config(UserRouterConfig.factory)
    .run(UserRouter.factory);

//Export module
export default m;
