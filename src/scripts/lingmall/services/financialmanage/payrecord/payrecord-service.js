define(['../../services'], function(services) {
    services.service('PayrecordServices', ['$q', '$http', '$cookieStore', 'config', function($q, $http, $cookieStore, config) {
        return {
            //获取支付列表
            getPayList: function(order_trade_code, pay_type, pay_status, pay_create_start_time, pay_create_end_time, offset, limit) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getPayList,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        order_trade_code: order_trade_code,
                        pay_type: pay_type,
                        pay_status: pay_status,
                        pay_create_start_time: pay_create_start_time,
                        pay_create_end_time: pay_create_end_time,
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
            }
        }
    }])
});
