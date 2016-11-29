define(['../services'], function(services) {
    'user strict';
    services.service('WarehouseServices', ['$q', '$http', 'config', '$cookieStore', function($q, $http, config, $cookieStore) {
        return {
            //获取仓库列表
            getWarehouseList: function(offset, limit, keyword, status, ranges_data, province, city) {
                var defer = $q.defer();
                /*
                 "ranges_data": [
                    {
                      "province": "浙江",
                      "city": "嘉兴"
                    },
                    {
                      "province": "浙江",
                      "city": "杭州"
                    }
                  ]
                */
                $http({
                    url: config.urlPrefix + config.urlDict.getWarehouseList,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        offset: offset,
                        limit: limit,
                        keyword: keyword,
                        status: status,
                        ranges_data: ranges_data,
                        province: province,
                        city: city
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
            //获取仓库编号
            getWarehouseNumber: function(type) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getWarehouseNumber,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        type: type //1仓库编号2入库单编号
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
            //新增仓库
            /*
            "address_data": {
                "province": "string",
                "city": "string",
                "district": "string",
                "detail": "string",
                "post": "string",
                "name": "string",
                "phone": "string"
              },*/
              /*
              "range_data": [
                {
                  "province": "浙江",
                  "city": "嘉兴"
                }
              ]
              */
            addWarehouses: function(warehouse_number, name, address_data, head_uuid, warehouse_phone, is_default, range_data) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.addWarehouses,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        warehouse_number: warehouse_number,
                        name: name,
                        address_data: address_data,
                        head_uuid: head_uuid,
                        warehouse_phone: warehouse_phone,
                        is_default: is_default,
                        range_data: range_data
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
            //获取仓库详情
            getWarehouseDetail: function(warehouse_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getWarehouseDetail.replace('{warehouse_id}', warehouse_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        warehouse_id: warehouse_id
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
            //添加配送范围
            addRange: function(warehouse_id, range) {
                /* data
                [
                  {
                    "province": "浙江",
                    "city": "嘉兴"
                  }
                ]
                */
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.addRange.replace('{warehouse_id}', warehouse_id),
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        warehouse_id: warehouse_id
                    },
                    data: {
                        range: range
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
            //获取所有城市列表
            getAllCityList: function() {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getAllCityList,
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
                    defer.reject(response.message)
                })
                return defer.promise;
            },
            //删除仓库
            deleteWarehouse: function(warehouse_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.deleteWarehouse.replace('{warehouse_id}', warehouse_id),
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
                    defer.reject(response.message)
                })
                return defer.promise;
            },
            //编辑仓库
            /*
            "address_data": {
                "address_id": "string",
                "province": "string",
                "city": "string",
                "district": "string",
                "detail": "string",
                "post": "string",
                "name": "string",
                "phone": "string"
              },
            "range_data": [
                {
                  "province": "浙江",
                  "city": "嘉兴"
                }
            ]
            */
            editWarehouse: function(warehouse_id, warehouse_number, name, address_data, head_uuid, warehouse_phone, is_default, range_data) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.editWarehouse.replace('{warehouse_id}', warehouse_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        warehouse_number: warehouse_number,
                        name: name,
                        address_data: address_data,
                        head_uuid: head_uuid,
                        warehouse_phone: warehouse_phone,
                        is_default: is_default,
                        range_data: range_data
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
            //禁用启用仓库
            warehouseStatus: function(warehouse_id, status) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.warehouseStatus.replace('{warehouse_id}', warehouse_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        status: status
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
            }
        }
    }]);
});
