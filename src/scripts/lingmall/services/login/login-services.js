define(['../services'], function(services) {
    'use strict';
    services.service('LoginServices', ['$q', '$http', '$cookieStore', 'md5', 'config', function($q, $http, $cookieStore, md5, config) {
        return {
            //登录 http://192.168.1.245:8102
            login: function(username, password) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.login,
                    method: 'POST',
                    data: {
                        'grant_type': 'password',
                        'client_id': 'f3d259ddd3ed8ff3843839b',
                        'client_secret': '4c7f6f8fa93d59c45502c0ae8c4a95b',
                        'username': username,
                        'password': md5.createHash(password.toString()), //md5.createHash(password.toString())
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (!code) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response);
                });
                return defer.promise;
            },
            mainVerify: function(mobile) {
                var defer = $q.defer();
                return $http({
                    url: config.urlPrefix + config.urlDict.mainVerify,
                    method: 'GET',
                    needToken: true,
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
            }
        }
    }])
})
