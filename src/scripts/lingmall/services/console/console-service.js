define(['../services'], function(services) {
    'use strict';
    services.service('ConsoleServices', ['$q', '$http', 'config', '$cookieStore',
        function($q, $http, config, $cookieStore) {
            return {
                //获取平台列表
                getNotices: function(offset, limit, title, startTime, endTime) {
                    var defer = $q.defer();
                    $http({
                        url: config.urlPrefix + config.urlDict.getNotices,
                        method: 'GET',
                        params: {
                            'access_token': $cookieStore.get('access_token'),
                            'offset': offset,
                            'limit': limit,
                            'title': title,
                            'startTime': startTime,
                            'endTime': endTime
                        }
                    }).success(function(response, header, config) {
                        var code = response.code;
                        if (code == 0) {
                            defer.resolve(response.data);
                        }
                    }).error(function(response, header, config) {
                        defer.reject(response.message)
                    });
                    return defer.promise;
                },
                //查看
                NoticesCheck: function(notice_id) {
                    var defer = $q.defer();
                    $http({
                        url: config.urlPrefix + config.urlDict.operationNotices.replace('{notice_id}', notice_id),
                        method: 'GET',
                        params: {
                            'access_token': $cookieStore.get('access_token')
                        }
                    }).success(function(response, header, config) {
                        var code = response.code;
                        if (code == 0) {
                            defer.resolve(response.data);
                        }
                    }).error(function(response, header, config) {
                        defer.reject(response.message)
                    });
                    return defer.promise;
                },
                //地址分级
                CityClassily: function(province, city, offset, limit) {
                    var defer = $q.defer();
                    $http({
                        url: config.urlPrefix + config.urlDict.cityClassily,
                        method: 'GET',
                        params: {
                            'access_token': $cookieStore.get('access_token'),
                            'province': province,
                            'city': city,
                            'offset': offset,
                            'limit': limit
                        }
                    }).success(function(response, header, config) {
                        var code = response.code;
                        if (code == 0) {
                            defer.resolve(response.data);
                        }
                    }).error(function(response, header, config) {
                        defer.reject(response.message)
                    });
                    return defer.promise;
                },
                //获取公司信息
                CompanyDetail: function(company_id) {
                    var defer = $q.defer();
                    $http({
                        url: config.urlPrefix + config.urlDict.companyDetail.replace('{company_id}', company_id),
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
                        defer.reject(response)
                    });
                    return defer.promise;
                },
                //修改公司信息
                CompanyEdit: function(company_id, item) {
                    var defer = $q.defer();
                    $http({
                        url: config.urlPrefix + config.urlDict.companyEdit.replace('{company_id}', company_id),
                        method: 'PUT',
                        params: {
                            'access_token': $cookieStore.get('access_token'),
                        },
                        data: item
                    }).success(function(response, header, config) {
                        var code = response.code;
                        if (code == 0) {
                            defer.resolve(response.data);
                        }
                    }).error(function(response, header, config) {
                        defer.reject(response)
                    });
                    return defer.promise;
                },
                //验证公司信息
                CompanyVerify: function(company_id) {
                    var defer = $q.defer();
                    $http({
                        url: config.urlPrefix + config.urlDict.companyVerify.replace('{company_id}', company_id),
                        method: 'GET',
                        params: {
                            'access_token': $cookieStore.get('access_token'),
                        },

                    }).success(function(response, header, config) {
                        var code = response.code;
                        if (code == 0) {
                            defer.resolve(response.data);
                        }
                    }).error(function(response, header, config) {
                        defer.reject(response)
                    });
                    return defer.promise;
                },
                 //主营项目
                MainCategorys: function(company_id) {
                    var defer = $q.defer();
                    $http({
                        url: config.urlPrefix + config.urlDict.mainCategorys,
                        method: 'GET',
                        params: {
                            'access_token': $cookieStore.get('access_token'),
                        },

                    }).success(function(response, header, config) {
                        var code = response.code;
                        if (code == 0) {
                            defer.resolve(response.data);
                        }
                    }).error(function(response, header, config) {
                        defer.reject(response)
                    });
                    return defer.promise;
                },
            }
        }
    ]);
});
