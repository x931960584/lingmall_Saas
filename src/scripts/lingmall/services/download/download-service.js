define(['../services'], function(services) {
    services.service('DownLoadService', ['$q', '$http', 'config', '$cookieStore', function($q, $http, config, $cookieStore) {
        this.sentSMS = function(phone, sku_img_id) {
            var defer = $q.defer();
            $http({
                url: config.urlPrefix + '/sms/imgdownload',
                method: 'post',
                params: {
                    'access_token': $cookieStore.get('access_token')
                },
                data: {
                    mobile: phone,
                    img_sku_id: sku_img_id
                }
            }).success(function(response, hearder, config) {
                if (response.code == 0) {
                    defer.resolve(response);
                }
            }).error(function(response, hearder, config) {
                defer.reject(response.message);
            });
            return defer.promise;
        }
    }])
});
