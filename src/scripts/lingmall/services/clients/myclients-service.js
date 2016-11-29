define(['../services'], function(services) {
    services.service('MyClientsSernice', ['$q', '$http', 'config', '$cookieStore', function($q, $http, config, $cookieStore) {
        return {
            clientNo: function() {
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.clientno,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            custList: function(offset, limit, keyword, catagory_id, grade_id, region_id, verify_flag, province, city, status) { //客户列表
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.custlist,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'offset': offset,
                        'limit': limit,
                        'keyword': keyword,
                        'catagory_id': catagory_id,
                        'grade_id': grade_id,
                        'region_id': region_id,
                        'verify_flag': verify_flag,
                        'province': province,
                        'city': city,
                        'status': status

                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            custAdd: function(items) { //客户新增
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.custlist,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: items,
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            custCheck: function(customer_id) { //客户查看
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.custcheck.replace('{customer_id}', customer_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            custDel: function(customer_id, item) { //客户删除
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.custcheck.replace('{customer_id}', customer_id),
                    method: 'DELETE',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    defer.resolve(response);
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            custEdit: function(customer_id, item) { //客户修改
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.custcheck.replace('{customer_id}', customer_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: item,
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },


            gradeList: function(offset, limit) { //等级列表
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.gradelist,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'offset': offset,
                        'limit': limit,
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            gradeAdd: function(name) { //等级新增
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.gradelist,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        name: name,
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            gradeCheck: function(grade_id) { //等级查看
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.gradecheck.replace('{grade_id}', grade_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            gradeDel: function(grade_id) { //等级删除
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.gradecheck.replace('{grade_id}', grade_id),
                    method: 'DELETE',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    defer.resolve(response);
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            gradeEdit: function(grade_id, name) { //等级修改
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.gradecheck.replace('{grade_id}', grade_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        name: name,
                    }
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            gradeDefult: function(grade_id, item) { //设置默认
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.gradecheck.replace('{grade_id}', grade_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: item,
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },

            cataList: function(offset, limit) { //分类列表
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.catalist,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'offset': offset,
                        'limit': limit,
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            cataAdd: function(name) { //分类新增
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.catalist,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        name: name,
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            cataCheck: function(catagory_id) { //分类查看
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.catacheck.replace('{catagory_id}', catagory_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            cataDel: function(catagory_id) { //分类删除
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.catacheck.replace('{catagory_id}', catagory_id),
                    method: 'DELETE',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    defer.resolve(response);
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            cataEdit: function(catagory_id, name) { //分类修改
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.catacheck.replace('{catagory_id}', catagory_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        name: name,
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            cataDefult: function(catagory_id, item) { //设置默认
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.catacheck.replace('{catagory_id}', catagory_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: item,
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },


            regionList: function(offset, limit, keyword) { //区域列表
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.regionlist,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'offset': offset,
                        'limit': limit,
                        'keyword': keyword
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            regionAdd: function(id, item) { //区域新增
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.regionlist,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: item,
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            regionCheck: function(region_id) { //区域查看
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.regioncheck.replace('{region_id}', region_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            regionDel: function(region_id) { //区域删除
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.regioncheck.replace('{region_id}', region_id),
                    method: 'DELETE',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    defer.resolve(response);
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            regionEdit: function(region_id,item) { //区域修改
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.regioncheck.replace('{region_id}', region_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data:item,
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            settLement: function() { //结算方式
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.settlement,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            strategyList: function(offset,limit,type,goods_id,customer_id,supplier_id) { //客户管控列表
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.strategylist,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'offset':offset,
                        'limit':limit,
                        'type':type,
                        'goods_id':goods_id,
                        'customer_id':customer_id,
                        'supplier_id':supplier_id
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            aggretList: function(offset,limit,type,goods_id,customer_id,supplier_id) { //客户管控列表
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.aggretlist,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'offset':offset,
                        'limit':limit,
                        'type':type,
                        'goods_id':goods_id,
                        'customer_id':customer_id,
                        'supplier_id':supplier_id
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            strategyAdd: function(id,item) { //客户管控新增
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.strategylist,
                    method: 'POST',
                    params:{
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: item,
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            strategyCheck: function(strategy_id) { //客户管控详情
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.strategycheck.replace('{strategy_id}',strategy_id),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            strategyEdit: function(strategy_id,item) { //客户管控修改
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.strategycheck.replace('{strategy_id}',strategy_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data:item,
                }).success(function(response, header, config) {
                    if (response) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
             strategyDel: function(strategy_id) { //客户管控删除
                var defer = $q.defer();
                $http({
                    url: config.urlClients + config.urlDict.strategycheck.replace('{strategy_id}',strategy_id),
                    method: 'DELETE',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                }).success(function(response, header, config) {
                        defer.resolve(response);
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
        }
    }])
})
