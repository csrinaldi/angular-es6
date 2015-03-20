import coreTpl from './core.tpl.html!text';

import user from '../users/config';

/**
 * @classdesc Abstract Router for full layout region
 * @author Cristian Rinaldi
 */
class LayoutRouterConfig {

    constructor($stateProvider) {
        $stateProvider
            .state('layout', {
                abstract: true,
                template : coreTpl
            });
    }

    static factory($stateProvider) {
        LayoutRouterConfig.instance = new LayoutRouterConfig($stateProvider);
        return LayoutRouterConfig.instance;
    }
}

LayoutRouterConfig.factory.$inject = [ '$stateProvider' ];

class LayoutRouter {
    constructor($rootScope, $document) {

    }

    static factory($rootScope, $document) {
        LayoutRouter.instance = new LayoutRouter($rootScope, $document);
        return LayoutRouter.instance;
    }
}

//Inject dependencies in factory method
LayoutRouter.factory.$inject = [ '$rootScope', '$document' ];

const name = 'layoutViewRouteModule';

let m = angular.module(name, [ 'ui.router', user.name])
    .config(LayoutRouterConfig.factory)
    .run(LayoutRouter.factory);

//Export module
export default m;

