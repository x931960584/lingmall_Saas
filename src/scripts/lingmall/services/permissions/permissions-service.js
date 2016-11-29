define(['../services'], function(services) {
    'use strict';
    services.service('PermissionServices', ['$q', '$http','config','$cookieStore', function($q, $http,config,$cookieStore) {

        var methodDict = {
            get: 'GET',
            post: 'POST',
            put: 'PUT',
            del: 'DELETE'
        };
        return {
            roleList: function(company_id, keyword) { //角色列表搜索
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissionlist.replace('{company_id}', company_id),
                    method: methodDict.get,
                    params: {
                        'access_token':$cookieStore.get('access_token'),
                        'keyword': keyword,
                    },
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },

            delPermission: function(company_id, item) { //删除角色
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissiondel.replace('{company_id}', company_id),
                    method: methodDict.del,
                    params: item,
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },

            addPermission: function(id,item) { //添加修改角色
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissionadd,
                    method: methodDict.post,
                    params:{
                        'access_token':$cookieStore.get('access_token')
                    },
                    data: item,
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                })
                return defer.promise;
            },

            forbidden: function(role_id, status) { //禁用启用
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissionforbidden,
                    method: methodDict.post,
                    params:{
                        'access_token':$cookieStore.get('access_token')
                    },
                    data: {
                        'role_id': role_id,
                        'status': status,
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                })
                return defer.promise;
            },

            modules: function(role_id, keyword) { //模块列表
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissionmodules.replace('{role_id}', role_id),
                    method: methodDict.get,
                    params: {
                        'keyword': keyword,
                        'access_token':$cookieStore.get('access_token')
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                })
                return defer.promise;
            },

            editor: function(role_id, module_id, action_id,status) { //编辑权限
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissioneditor,
                    method: methodDict.post,
                    params:{
                        'access_token':$cookieStore.get('access_token')
                    },
                    data: {
                        'module_id': module_id,
                        'role_id': role_id,
                        'action_id': action_id,
                        'status': status,
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                })
                return defer.promise;
            },
            modsearch: function(role_id, module_id) { //单一模块权限
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissionmodsearch.replace('{module_id}', module_id),
                    method: methodDict.get,
                    params: {
                        'role_id': role_id,
                        'access_token':$cookieStore.get('access_token')
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                })
                return defer.promise;
            },
            pitchall: function(role_id, module_id,status) { //统一修改
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissionpitchall.replace('{module_id}', module_id),
                    method: methodDict.get,
                    params: {
                        'role_id': role_id,
                        'status': status,
                        'access_token':$cookieStore.get('access_token')
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                })
                return defer.promise;
            },
            judgement: function(role_id, module_id) { //权限控制
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.permissionjudgement.replace('{module_id}', module_id),
                    method: methodDict.get,
                    params: {
                        'role_id': role_id,
                        'access_token':$cookieStore.get('access_token')
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                })
                return defer.promise;
            },


        }
    }])
})
