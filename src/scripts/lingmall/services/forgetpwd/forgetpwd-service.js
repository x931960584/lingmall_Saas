define(['../services'], function(services) {
    'use strict';
    services.service('ForgetpwdServices', ['$q', '$http', 'config', function($q, $http, config) {
        return {
            getbackpwdsms: function(mobile) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getbackpwdsms,
                    method: 'POST',
                    data: {
                        'mobile': mobile
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
            },
            valigetbackpwdsms: function(mobile, captcha) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.valigetbackpwdsms,
                    method: 'GET',
                    params: {
                        'mobile': mobile,
                        'captcha': captcha
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
    }])
});
