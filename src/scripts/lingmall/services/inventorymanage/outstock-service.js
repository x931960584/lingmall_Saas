define(['../services'], function(services) {
    'user strict';
    services.service('outstockServices', ['$q', '$http', 'config', '$cookieStore', function($q, $http, config, $cookieStore) {
        return {
            //获取入库单列表
            outStockList: function(offset, limit,warehouse_in_bill_number,warehouse_id,in_status,in_type,review_status,start_time,end_time) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.outstockList,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'offset': offset,
                        'limit': limit,
                        'warehouse_in_bill_number':warehouse_in_bill_number,
                        'warehouse_id':warehouse_id,
                        'in_status':in_status,
                        'in_type':in_type,
                        'review_status':review_status,
                        'start_time':start_time,
                        'end_time':end_time
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message)
                })
                return defer.promise;
            },
           //新增入库单
            outStockAdd: function(warehouse_in_bill_number,in_type,warehouse_id,in_time,data) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.outstockAdd,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token')
                    },
                    data: {
                        'warehouse_in_bill_number':warehouse_in_bill_number,
                        'in_type':in_type,
                        'warehouse_id':warehouse_id,
                        'in_time':in_time,
                        'warehouse_in_bill_skus':data
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message)
                })
                return defer.promise;
            },
            //查看入库单
            outStockCheck: function(warehouse_in_bill_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.outstockCheck.replace('{warehouse_in_bill_id}',warehouse_in_bill_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token')
                    },
                    
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message)
                })
                return defer.promise;
            },
            //修改入库单
            outStockEdit: function(warehouse_in_bill_id,warehouse_in_bill_number,in_type,warehouse_id,in_time,data) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.outstockEdit.replace('{warehouse_in_bill_id}',warehouse_in_bill_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token')
                    },
                    data: {
                        'warehouse_in_bill_number':warehouse_in_bill_number,
                        'in_type':in_type,
                        'warehouse_id':warehouse_id,
                        'in_time':in_time,
                        'warehouse_in_bill_skus':data
                    }
                    
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message)
                })
                return defer.promise;
            },
            //修改入库单状态
            outStockStat: function(warehouse_in_bill_id,item) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.outstcokStat.replace('{warehouse_in_bill_id}',warehouse_in_bill_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token')
                    },
                    data: item,
                    
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message)
                })
                return defer.promise;
            },
            //获取入库单编号
            outStockNum: function(type) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.outstockNum,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'type':type
                    },
                    
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message)
                })
                return defer.promise;
            },
            //获取仓库
            wareHousesList: function(offset,limit) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.warehousesList,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'offset':offset,
                        'limit':limit
                    },
                    
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message)
                })
                return defer.promise;
            },
            //获取仓库
            userName: function(uuid) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getUserName.replace('{uuid}',uuid),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token')
                    },
                    
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message)
                })
                return defer.promise;
            },
        }
    }]);
});
