define(['../services'], function(services) {
    'use strict';
    services.service('RegisterServices', ['$q', '$http', 'config', 'md5',  function($q, $http, config, md5) {
        return {
            mainReg: function(mobile, captcha, password) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.mainreg,
                    method: 'POST',
                    data: {
                        'mobile': mobile,
                        'captcha': captcha,
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
            },
            captcha: function(mobile) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.captcha,
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
            mainVerify: function(mobile) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.mainVerify,
                    method: 'GET',
                    params: {
                        'mobile': mobile,
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
            captchaVerify: function(mobile, captcha) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.captchaVerify,
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
        }
    }]);
});
