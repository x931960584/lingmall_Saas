define(['../../services'], function(services) {
    services.service('SaleorderServices', ['$q', '$http', 'config', '$cookieStore', function($q, $http, config, $cookieStore) {
        return {
            //获取订单列表
            getOrderList: function(order_type, buyer_company_id, seller_company_id, order_code, status, order_create_start_time, order_create_end_time, offset, limit) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getOrderList,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        order_type: order_type,
                        buyer_company_id: buyer_company_id,
                        seller_company_id: seller_company_id,
                        order_code: order_code,
                        status: status,
                        order_create_start_time: order_create_start_time,
                        order_create_end_time: order_create_end_time,
                        offset: offset,
                        limit: limit
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
            //提交创建订单 //sass端不调用
            createOrder: function(buyer_company_id, warehouse_id, total_fee, total_goods_price, total_order_price, province, city, detail, post, name, phone, seller_company_id, groupon_sku_id, groupon_sku_count, groupon_sku_fee, groupon_sku_total_price) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.createOrderList,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        buyer_company_id: buyer_company_id,
                        warehouse_id: warehouse_id,
                        total_fee: total_fee,
                        total_goods_price: total_goods_price,
                        total_order_price: total_order_price,
                        province: province,
                        city: city,
                        detail: detail,
                        post: post,
                        name: name,
                        phone: phone,
                        seller_company_id: seller_company_id,
                        groupon_sku_id: groupon_sku_id,
                        groupon_sku_count: groupon_sku_count,
                        groupon_sku_fee: groupon_sku_fee,
                        groupon_sku_total_price: groupon_sku_total_price,
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
            //订单详情
            orderDetail: function(order_id, company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.orderDetail.replace('{order_id}', order_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        company_id: company_id,
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
            //订单修改运费
            updateFee: function(order_id, fee, memo) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.updateFee.replace('{order_id}', order_id),
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        fee: fee,
                        memo: memo
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
            //订单发货
            orderSend: function(order_id, company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.orderSend.replace('{order_id}', order_id),
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        company_id: company_id,
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
            //确认收货
            orderReceive: function(order_id, company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.orderReceive.replace('{order_id}', order_id),
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        order_id: order_id,
                        company_id: company_id,
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
            //确认完结
            orderClose: function(order_id, company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.orderClose.replace('{order_id}', order_id),
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        company_id: company_id,
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
            //订单取消
            orderCancel: function(order_id, company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.orderCancel.replace('{order_id}', order_id),
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        company_id: company_id,
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
            //不同状态的订单数量
            getOrderCount: function(order_type, company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getOrderCount,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        type: order_type,
                        company_id: company_id,
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
