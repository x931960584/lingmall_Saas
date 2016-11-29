define(['../services'], function(services) {
    'use strict';

    services.service('ActivityListServices', ['$q', '$http','config','$cookieStore', function($q, $http,config,$cookieStore) {
        /*var urlDict = {
            activitylist: '/groupons', //拼团活动列表
            activityadd: '/groupons/', //拼团活动添加
            activitysearch: '/groupons/groupon_skus', //数据查询
            activityeditor: '/groupons/{groupon_id}/', //拼团活动修改
            activitydetail: '/groupons/{groupon_id}/', //拼团活动详情
            activitydel: '/groupons/{groupon_id}', //拼团活动删除
            activityexp: '/groupons/groupon_skus/actions/verify', //判断过期库存
            activitygather:'/groupons/groupon_skus/actions/verify_status',       //判断商品是否在采集
            activitynum:'/groupons/groupon_skus/actions/update_sold_count',     //销售数量

        };*/
        return {
            activityList: function(title,status,offset,limit,online_status) { //拼团活动列表
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activitylist,
                    method: 'GET',
                    params: {
                        'access_token':$cookieStore.get('access_token'),
                        'title': title,
                        'status':status,
                        'offset':offset,
                        'limit':limit,
                        'online_status':online_status
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

            activityAdd: function(title,start_time,end_time,online_status,skus) {  //拼团活动添加
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activityadd,
                    method: 'POST',
                    params:{
                        'access_token':$cookieStore.get('access_token')
                    },
                    data: {
                        'title':title,
                        'start_time':start_time,
                        'end_time':end_time,
                        'online_status':online_status,
                        'skus':skus
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

            activitySearch: function(category_id, brand, goodsname) { //数据查询
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activitysearch,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'category_id': category_id,
                        'brand': brand,
                        'goodsname': goodsname,
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

            activityEditor: function(groupon_id,title,start_time,end_time,online_status,skus) { //拼团活动修改
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activityeditor.replace('{groupon_id}',groupon_id),
                    method: 'PUT',
                    params: {
                        'access_token':$cookieStore.get('access_token'),
                    },
                    data: {
                        'title':title,
                        'start_time':start_time,
                        'end_time':end_time,
                        'online_status':online_status,
                        'skus':skus
                    }
                }).success(function(response, header, config) {
                    var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response);
                })
                return defer.promise;
            },

            activityDetail: function(groupon_id) { //拼团活动详情
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activitydetail.replace('{groupon_id}', groupon_id),
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
                    defer.reject(response.message);
                })
                return defer.promise;
            },
            activityDown: function(groupon_id,item) { //拼团活动上下线
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.actividown.replace('{groupon_id}', groupon_id),
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
                    defer.reject(response);
                })
                return defer.promise;
            },

            activityDel: function(groupon_id) { //拼团活动删除
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activitydel,
                    method: 'DELETE',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'groupon_id':groupon_id
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
            activityExp: function(data) { //判断过期库存
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activityexp,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'data':data
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
            activityGather: function() { //判断商品是否在采集
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activitygather,
                    method: 'POST',
                    data: {
                        
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
            activityNum: function() { //销售数量
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.activitynum,
                    method: 'PUT',
                    params: {
                        'role_id': role_id,
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
            goodsList: function(key,brand_id,category_id,status,offset,limit) { //获取商品列表
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.goodslist,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        'key':key,
                        'brand_id':brand_id,
                        'category_id':category_id,
                        'status':status,
                        'offset':offset,
                        'limit':limit
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
             operationList: function() { //运营分类列表
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.operationCategory,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        
                    }
                }).success(function(response, header, config) {
                    defer.resolve(response);
                    /*var code = response.code;
                    if (code == 0) {
                        defer.resolve(response.data);
                    }*/
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                })
                return defer.promise;
            },


        }
    }])
})
