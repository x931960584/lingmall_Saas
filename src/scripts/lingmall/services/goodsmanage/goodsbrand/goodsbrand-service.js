define(['../../services'],function(services){
	'use strict';
	    services.service('GoodsbrandService',['$q','$http','$cookieStore','config',function($q,$http,$cookieStore,config){

		//

			return {
				brandList : function(access_token,offset,limit){
					var defer=$q.defer();
					$http({
						url : config.urlPrefix + config.urlDict.brandlist,
						method : "GET",
						params : {
							'access_token':access_token,
							'offset':offset,
							'limit':limit
						}

					}).success(function(response, header, config){
						var code = response.code;
	                    if (code == 0) {
	                        defer.resolve(response);
	                    }
					}).error(function(response, header, config){
						defer.reject(response);
					})
					return defer.promise;
				},
				brandAdd : function(id,item){
					var defer=$q.defer();
					$http({
						url : config.urlPrefix + config.urlDict.brandadd,
						method : "POST",
						params : {
							'access_token':$cookieStore.get('access_token')
						},
						data:item,
						

					}).success(function(response, header, config){
						var code = response.code;
	                    if (code == 0) {
	                        defer.resolve(response);
	                    }
					}).error(function(response, header, config){
						defer.reject(response);
					})
					return defer.promise;
				},
				brandDel : function(brand_id,item){
					var defer=$q.defer();
					$http({
						url : config.urlPrefix + config.urlDict.branddel.replace('{brand_id}', brand_id),
						method : "DELETE",
						params : {
							'access_token':$cookieStore.get('access_token'),
						}

					}).success(function(response, header, config){
						var code = response.code;
	                    if (code == 0) {
	                        defer.resolve(response);
	                    }
					}).error(function(response, header, config){
						defer.reject(response);
					})
					return defer.promise;
				},
				brandCheck : function(brand_id){
					var defer=$q.defer();
					$http({
						url : config.urlPrefix + config.urlDict.brandcheck.replace('{brand_id}', brand_id),
						method : "GET",
						params : {
							'access_token':$cookieStore.get('access_token')
						},
						

					}).success(function(response, header, config){
						var code = response.code;
	                    if (code == 0) {
	                        defer.resolve(response);
	                    }
					}).error(function(response, header, config){
						defer.reject(response);
					})
					return defer.promise;
				},
				brandEditor : function(brand_id,item){
					var defer=$q.defer();
					$http({
						url : config.urlPrefix + config.urlDict.brandeditor.replace('{brand_id}',brand_id),
						method : "PUT",
						params : {
							'access_token':$cookieStore.get('access_token'),
						},
						data:item

					}).success(function(response, header, config){
						var code = response.code;
	                    if (code == 0) {
	                        defer.resolve(response);
	                    }
					}).error(function(response, header, config){
						defer.reject(response);
					})
					return defer.promise;
				},
				uploadToken: function(){
					var defer=$q.defer();
					$http({
						url : config.urlPrefix + config.urlDict.uploadtoken,
						method : "GET",
						params : {
							'access_token':$cookieStore.get('access_token'),
							'project_id':'1',
						},
						
					}).success(function(response, header, config){
	                    defer.resolve(response);
					}).error(function(response, header, config){
						defer.reject(response);
					})
					return defer.promise;
				},
			} 
	}]);
});