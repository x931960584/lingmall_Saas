define(['../../services'],function(services){
	'use strict';
	services.service('GoodsclassifyService',['$q','$http','$cookieStore','config',function($q,$http,$cookieStore,config){

		/*var urlDict={
			init :'/categorys/Supplier_categorys/actions/init',  //初始化默认分类
			list : '/categorys/Supplier_categorys',    //分类列表
			add :'/categorys/Supplier_categorys',    //添加分类
			del :'/categorys/Supplier_categorys/{category_id}', //删除分类
			check:'/categorys/Supplier_categorys/{category_id}', //获取单个的信息
			editor:'/categorys/Supplier_categorys/{category_id}',  //修改
		}*/


		return{
			classifyInit: function(company_id) { //初始化默认分类
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.classifyinit,
                    method: 'POST',
                    data: {
                        'company_id': company_id,
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
            classifyList: function() { //分类列表
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.classifylist,
                    method: 'GET',
                    params: {
                        'company_id': $cookieStore.get('company_id'),
                        'access_token':$cookieStore.get('access_token')
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
            classifyAdd: function(category_name,p_id) { //增加分类
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.classifyadd,
                    method: 'POST',
                    params: {
                        'access_token':$cookieStore.get('access_token'),
                    },
                    data: {
                        'supplier_category_name':category_name,
                        'p_id':p_id
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
            classifyDel: function(supplier_category_id,item) { //删除分类
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.classifydel.replace('{supplier_category_id}',supplier_category_id),
                    method: 'DELETE',
                    params: {
                        'access_token':$cookieStore.get('access_token'),
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
            classifyCheck: function(category_id, company_id,access_token) { //查看分类
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.classifycheck.replace('{category_id}',category_id),
                    method: 'GET',
                    params: {
                        'company_id': company_id,
                        'access_token':access_token,
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
             classifyEditor: function(supplier_category_id,supplier_category_name,p_id) { //修改分类
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.classifyeditor.replace('{supplier_category_id}',supplier_category_id),
                    method: 'PUT',
                    params: {
                        'access_token':$cookieStore.get('access_token'),
                    },
                    data: {
                        'supplier_category_name':supplier_category_name,
                        'p_id':p_id
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