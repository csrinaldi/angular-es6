import tpl from './core.tpl.html!text';
import headerTpl from './header.tpl.html!text';
import footerTpl from './footer.tpl.html!text';


import user from '../users/config';


/**
 * @classdesc Abstract Router for full layout region
 * @author Cristian Rinaldi
 */
class LayoutRouterConfig {

    constructor($stateProvider) {
        $stateProvider
            .state('view', {
                abstract: true,
                template : /*coreTpl*/ "<ui-view></ui-view>"
            })
            .state('view.layout', {
                abstract: true,
                views:{
                    'footer' :{
                        template : "<ui-view></ui-view>" /*footerTpl*/
                    },
                    'header' : {
                        template : "<ui-view></ui-view>" /*headerTpl*/
                    }
                }
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

let m = angular.module(name, [ 'ui.router'/*, user.name*/ ])
    .config(LayoutRouterConfig.factory)
    .run(LayoutRouter.factory);

//Export module
export default m;

