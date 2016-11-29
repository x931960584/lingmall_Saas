define(['../services'], function(services) {
    'use strict';
    services.service('OrgServices', ['$q', '$http', 'config', '$cookieStore', function($q, $http, config, $cookieStore) {
        return {

            //组织架构
            //获取单个公司信息
            /*
                {
                  "company_id": 0,
                  "company_name": "string",
                  "company_status": 0,
                  "company_number": "string",
                  "reg_user": "string",
                  "reg_time": "string"
                }
            */
            getSingleCompany: function(company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.editCompany.replace('{company_id}', company_id),
                    method: 'GET',
                    params: {
                        //'company_id': company_id,
                        'access_token': $cookieStore.get('access_token'),
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
            },
            //修改公司信息
            editCompany: function(company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.editCompany.replace('{company_id}', company_id),
                    method: 'PUT',
                    params: {
                        // 'company_id': company_id,
                        'access_token': $cookieStore.get('access_token'),
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
            },
            //用户组
            //获取用户组列表
            userGroup: function(company_id, user_group_name) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.userGroup,
                    method: 'GET',
                    params: {
                        'company_id': company_id,
                        'user_group_name': user_group_name,
                        'access_token': $cookieStore.get('access_token'),
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
            },
            //添加新用户组
            addUserGroup: function(user_group_name, user_group_status, company_id, p_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.userGroup,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        "user_group_name": user_group_name,
                        "user_group_status": user_group_status,
                        "company_id": company_id,
                        "p_id": p_id,
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
            },
            // 获取单个用户组信息
            getSingleUserGroup: function(ugid) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getSingleUserGroup.replace('{ugid}', ugid),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
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
            },
            //修改用户组信息
            editUserGroup: function(ugid, user_group_name, user_group_status, p_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.editUserGroup.replace('{ugid}', ugid),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        "user_group_name": user_group_name,
                        "user_group_status": user_group_status,
                        "p_id": p_id
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
            },
            //删除用户组
            delUserGroup: function(ugid) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.editUserGroup.replace('{ugid}', ugid),
                    method: 'DELETE',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
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
            },
            //组织架构启用禁用
            userGroupStatus: function(ugid) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.userGroupStatus.replace('{ugid}', ugid),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
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
            },
            /***********************分割线****************************************/

            //用户列表
            //获取用户列表 //page 默认为1
            getUserList: function(key, offset, limit, group_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getUserList,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'key': key,
                        'offset': offset,
                        'limit': limit,
                        'group_id': group_id,
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
            },
            //删除用户信息
            delUserInfo: function(uuid) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.editUserInfo.replace('{uuid}', uuid),
                    method: 'DELETE',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
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
            },
            //获取单个用户信息
            getSingleUserInfo: function(uuid) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.editUserInfo.replace('{uuid}', uuid),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
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
            },
            //修改用户信息
            editUserInfo: function(uuid, mobile, password, name, user_group_id, role_id, status) {
                var defer = $q.defer();
                var headers = {
                    'Content-Type': 'application/json'
                };
                var data = {
                    "mobile": mobile,
                    "password": password,
                    "name": name,
                    "user_group_id": user_group_id,
                    "role_id": role_id,
                    "status": status,
                };
                $http({
                    headers: headers,
                    url: config.urlPrefix + config.urlDict.editUserInfo.replace('{uuid}', uuid),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: data,
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
            //设为主账号
            setMainAccount: function(uuid) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.setMainAccount.replace('{uuid}', uuid),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
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
            },
            //启用 禁用
            userStatus: function(uuid, status) {
                var defer = $q.defer();
                var headers = {
                    'Content-Type': 'application/json'
                };
                $http({
                    headers: headers,
                    url: config.urlPrefix + config.urlDict.userStatus.replace('{uuid}', uuid),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        status: status,
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
            },
            //添加子账号
            addChildAccount: function(mobile, password, name, role_id, user_group_id, status) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.addChildAccount,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        mobile: mobile,
                        password: password,
                        name: name,
                        role_id: role_id,
                        user_group_id: user_group_id,
                        status: status,
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
            },
            //获取角色列表
            getRoles: function(company_id, keyword) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getRoles.replace('{company_id}', company_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        keyword: keyword,
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
            //权限控制列表
            accessControl: function(module_id, role_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.accessControl.replace('{module_id}', module_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        role_id: role_id,
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
        }
    }]);
});
