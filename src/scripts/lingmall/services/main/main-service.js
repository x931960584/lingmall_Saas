define(['../services'], function(services) {
    'use strict';
    services.service('MainServices', ['$q', '$http', '$cookieStore', 'config', function($q, $http, $cookieStore, config) {
        return {
            //登录之后获取权限列表
            //http://192.168.1.241:8888
            roleList: function(role_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.roleList.replace('{role_id}', role_id),
                    method: 'GET',
                    params: {
                        //'role_id' : role_id,
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            }

        }
    }]);
});
