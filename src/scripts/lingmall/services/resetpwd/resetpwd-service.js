define(['../services'], function(services) {
    'use strict';
    services.service('ResetpwdServices', ['$q', '$http','config', 'md5', function($q, $http, config, md5) {
        return {
            getbackpwd: function(mobile, sign, password) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getbackpwd,
                    method: 'PUT',
                   // needToken: true,
                    data: {
                        'mobile': mobile,
                        'sign': sign,
                        'password': md5.createHash(password.toString())
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (!code) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            }
        };
    }]);
});
