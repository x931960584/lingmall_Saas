define(['./services'], function(services) {
    'use strict';
    services.service('HttpOperatorService', ['$cookieStore', '$location', '$injector', 'growl', '$q', function($cookieStore, $location, $injector, growl, $q) {
        var httpOperator = {
            request: function(config) {
                if (config.needToken) {
                    config.headers['access_token'] = $cookieStore.get('access_token');
                }
                return config;
            },
            response: function(response) {
                return response;
            },
            responseError: function(response) {
                var code = response.data.code;
                var message = response.data.message;
                var $http = $injector.get('$http');
                var $config = $injector.get('config');
                if (code == 1102 || code == 2013) {
                    $http({
                        url: $config.urlPrefix + $config.urlDict.refresh_token,
                        method: 'POST',
                        data: {
                            'grant_type': 'refresh_token',
                            'refresh_token': $cookieStore.get('refresh_token'),
                            'client_id': 'f3d259ddd3ed8ff3843839b',
                            'client_secret': '4c7f6f8fa93d59c45502c0ae8c4a95b'
                        }
                    }).success(function(response, header, config) {
                        var code = response.code;
                        if (code == 0) {
                            $cookieStore.put('access_token', response.data.access_token);
                            $cookieStore.put('refresh_token', response.data.refresh_token);
                        }
                    })
                } else if (code == 2016) {
                    //2016:账号禁用  2018:refresh_token过期
                    growl.addErrorMessage('该账号被禁用');
                    $cookieStore.remove('access_token');
                    $cookieStore.remove('refresh_token');
                    $cookieStore.remove('username');
                    $cookieStore.remove('company_id');
                    $cookieStore.remove('company_number');
                    $cookieStore.remove('role_id');
                    $cookieStore.remove('module_id');
                    $location.path('/login');
                } else if (code == 2018) {
                    growl.addErrorMessage('Token过期');
                    $cookieStore.remove('access_token');
                    $cookieStore.remove('refresh_token');
                    $cookieStore.remove('username');
                    $cookieStore.remove('company_id');
                    $cookieStore.remove('company_number');
                    $cookieStore.remove('role_id');
                    $cookieStore.remove('module_id');
                    $location.path('/login');
                } else if (code == 8207) {

                } else if(response.status !== 500) {
                    growl.addErrorMessage(message);
                }else if(response.status == 500){
                    growl.addErrorMessage('服务不可用,请重试!');
                }
                return $q.reject(response);
            }
        };
        return httpOperator;
    }]);
});
