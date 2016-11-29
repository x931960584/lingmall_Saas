define(['./states'], function(states) {
    'use strict';
    states.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('login');
        $stateProvider.state('users', {
            url: '/',
            templateUrl: './views/users.html',
            controller: 'UsersCtrl'
        });
        $stateProvider.state('download', {
            url: '/download',
            templateUrl: './views/download/download.html',
            controller: 'DownLoad'
        });
        $stateProvider.state('users.login', {
            url: 'login',
            templateUrl: './views/login/login.html',
            controller: 'LoginCtrl'
        });
        $stateProvider.state('users.forgetpwd', {
            url: 'forgetpwd',
            templateUrl: './views/forgetpwd/forgetpwd.html',
            controller: 'ForgetpwdCtrl'
        });
        $stateProvider.state('users.resetpwd', {
            url: 'resetpwd?mobile&&sign',
            templateUrl: './views/resetpwd/resetpwd.html',
            controller: 'ResetpwdCtrl'
        });
        $stateProvider.state('main', {
            cache: true,
            url: '/main',
            controller: 'MainCtrl',
            templateUrl: './views/main.html'
        });
        $stateProvider.state('main.console', {
            url: '/console',
            params: {module_id: 16},
            controller: 'ConsoleCtrl',
            templateUrl: '../views/console/console.html'
        });
        $stateProvider.state('main.platform', {
            url: '/platform',
            controller: 'PlatformCtrl',
            templateUrl: '../views/console/platform.html'
        });
        /*$stateProvider.state('main.organize', {
            cache: true,
            url: '/organize',
            params: { module_id: 1 },
            templateUrl: '../views/organize/organize.html',
            controller: 'OrgCtrl'
        });*/
        $stateProvider.state('main.org', {
            cache: true,
            url: '/org',
            params: { module_id: 1 },
            templateUrl: '../views/organize/org.html',
            controller: 'OrganizeCtrl'
        });
        $stateProvider.state('main.useraccount', {
            cache: true,
            url: '/useraccount',
            templateUrl: '../views/useraccount/useraccount.html',
            controller: 'UseraccountCtrl'
        });
        $stateProvider.state('main.permissions', {
            cache: true,
            url: '/permissions',
            params: { module_id: 2 },
            templateUrl: '../views/permissions/permissions.html',
            controller: 'PermissionsCtrl'
        });
        $stateProvider.state('main.mygoods', {
            cache: true,
            url: '/mygoods',
            params: { module_id: 4 },
            templateUrl: '../views/goodsmanage/mygoods/mygoods.html',
            controller: 'MygoodsCtrl'
        });
        $stateProvider.state('main.addgoods', {
            cache: true,
            url: '/addgoods',
            params: { spu_id: null, status: null, module_id: 4 },
            templateUrl: '../views/goodsmanage/addgoods/addgoods.html',
            controller: 'AddgoodsCtrl'
        });
        $stateProvider.state('main.goodsbrand', {
            cache: true,
            url: '/goodsbrand',
            params: { module_id: 5 },
            templateUrl: '../views/goodsmanage/goodsbrand/goodsbrand.html',
            controller: 'goodsBrandCtrl'
        });
        $stateProvider.state('main.goodsclassify', {
            cache: true,
            url: '/goodsclassify',
            params: { module_id: 6 },
            templateUrl: '../views/goodsmanage/goodsclassify/goodsclassify.html',
            controller: 'goodsClassifyCtrl'
        });
        /*$stateProvider.state('main.saleorder', {
            cache: true,
            url: '/saleorder?order_status&status_name?',
            params: { module_id: 8 },
            templateUrl: '../views/ordermanage/saleorder/saleorder.html',
            controller: 'SaleorderCtrl'
        });*/
        $stateProvider.state('main.salesorder', {
            cache: true,
            url: '/salesorder?order_status&status_name?',
            params: { module_id: 8 },
            templateUrl: '../views/ordermanage/saleorder/salesorder.html',
            controller: 'SalesorderCtrl'
        });
        $stateProvider.state('main.saleorderdetail', {
            cache: true,
            url: '/saleorderdetail?order_id',
            params: { module_id: 8 },
            templateUrl: '../views/ordermanage/saleorderdetail/saleorderdetail.html',
            controller: 'SaleorderdetailCtrl'
        });
        $stateProvider.state('main.goodsview', {
            cache: true,
            url: '/goodsview?spu_id',
            params: { spu_id: null, module_id: 4 },
            templateUrl: '../views/goodsmanage/goodsview/goodsview.html',
            controller: 'goodsviewCtrl'
        });
        $stateProvider.state('main.payrecord', {
            cache: true,
            url: '/payrecord',
            params: { module_id: 12 },
            templateUrl: '../views/financialmanage/payrecord/payrecord.html',
            controller: 'PayrecordCtrl'
        });
        $stateProvider.state('main.activityadd', {
            cache: true,
            url: '/activityadd?id?',
            params: { module_id: 10 },
            templateUrl: '../views/activity/activityadd.html',
            controller: 'ActivityaddCtrl'
        });
        $stateProvider.state('main.activitylist', {
            cache: true,
            url: '/activitylist',
            params: { module_id: 10 },
            templateUrl: '../views/activity/activitylist.html',
            controller: 'ActivitylistCtrl'
        });
        $stateProvider.state('main.activitycheck', {
            cache: true,
            url: '/activitycheck?id',
            params: { module_id: 10 },
            templateUrl: '../views/activity/activitycheck.html',
            controller: 'ActivitycheckCtrl'
        });
        $stateProvider.state('main.warehouse', {
            url: '/warehouse',
            params: { module_id: 14 },
            templateUrl: '../views/inventorymanage/warehouse.html',
            controller: 'WarehouseCtrl'
        });
        $stateProvider.state('main.outstock', {
            url: '/outstock',
            params: { module_id: 15 },
            templateUrl: '../views/inventorymanage/outstock.html',
            controller: 'outstockCtrl'
        });
        $stateProvider.state('main.addoutstock', {
            url: '/addoutstock?id',
            params: { module_id: 15 },
            templateUrl: '../views/inventorymanage/addoutstock.html',
            controller: 'addOutstockCtrl'
        });
        $stateProvider.state('main.auditoutstock', {
            url: '/auditoutstock?id?isType',
            params: { module_id: 15 },
            templateUrl: '../views/inventorymanage/auditoutstock.html',
            controller: 'auditOutstockCtrl'
        });
        $stateProvider.state('main.clients', {
            url: '/myclients',
            params: { module_id: 26 },
            templateUrl: './views/clients/myclients.html',
            controller: 'myClientsCtrl'
        });
        $stateProvider.state('main.addclients', {
            url: '/addclients?id',
            params: { module_id: 26 },
            templateUrl: './views/clients/addclients.html',
            controller: 'addClientsCtrl'
        });
        $stateProvider.state('main.checkclients', {
            url: '/checkclients?id',
            params: { module_id: 26 },
            templateUrl: './views/clients/checkclients.html',
            controller: 'checkClientsCtrl'
        });
        $stateProvider.state('main.clientsrank', {
            url: '/clientsrank',
            params: { module_id: 29 },
            templateUrl: './views/clients/clientsrank.html',
            controller: 'clientsRankCtrl'
        });
        $stateProvider.state('main.clientscategory', {
            url: '/clientscategory',
            params: { module_id: 28 },
            templateUrl: './views/clients/clientscategory.html',
            controller: 'clientsCategoryCtrl'
        });
        $stateProvider.state('main.regionalsales', {
            url: '/regionalsales',
            params: { module_id: 30 },
            templateUrl: './views/clients/regionalsales.html',
            controller: 'regionalSalesCtrl'
        });
        $stateProvider.state('main.ordercontrol', {
            url: '/ordercontrol',
            params: { module_id: 27 },
            templateUrl: './views/clients/ordercontrol.html',
            controller: 'orderControlCtrl'
        });

    }]);
    states.config(['$httpProvider', 'growlProvider', '$translateProvider', function($httpProvider, growlProvider, $translateProvider) {
        $translateProvider.useSanitizeValueStrategy('sanitize');
        growlProvider.globalTimeToLive(3000); //多久时间自动消失
        growlProvider.globalEnableHtml(true);
        growlProvider.onlyUniqueMessages(true);
        $httpProvider.interceptors.push('HttpOperatorService');
    }]);
    states.run(['$cookieStore', '$location', '$state', function($cookieStore, $location, $state) {
        //验证是否在登录状态
        var location = $location.$$path;
        var validateLoginStatus = function() {
            var token = $cookieStore.get('access_token');
            if (!token) {
                $location.path('/login');
            }
        };
        if (location !== '/download') {
            validateLoginStatus();
        }
    }]);
    states.run(['$cookieStore', '$location', '$rootScope', 'growl', '$state', '$stateParams', '$injector', function($cookieStore, $location, $rootScope, growl, $state, $stateParams, $injector) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.previousState_name = fromState.name;
            $rootScope.previousState_params = fromParams;
            $rootScope.currentState_name = toState.name;
            $rootScope.currentState_params = toParams;
            $cookieStore.put('currentState', toState.name);
            $rootScope.role_id = $cookieStore.get('role_id');
            var OrgServices = $injector.get('OrgServices');
            if ($rootScope.role_id&&$rootScope.currentState_params.module_id) {
                OrgServices.accessControl($rootScope.currentState_params.module_id, $rootScope.role_id).then(function(data) {
                    $rootScope.accessControl = data;
                });
            }
        });
        $rootScope.back = function() { //实现返回的函数
            $state.go($rootScope.previousState_name, $rootScope.previousState_params);
        };
    }]);

});
