define(['../../services'], function(services) {
    'use strict';
    services.service('MyGoodsServices', ['$q', '$http', 'config', '$cookieStore', function($q, $http, config, $cookieStore) {
        return {
            //获取商品列表
            getGoodsList: function(key, brand_id, category_id, status, offset, limit) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getGoodsList,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        key: key,
                        brand_id: brand_id,
                        category_id: category_id,
                        status: status,
                        offset: offset,
                        limit: limit,
                    },
                    data: {}
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
            //添加商品
            addGoods: function(spu_code, spu_name, supplier_category_id, brand_id, unit, sort, skus, specification, others, keyword, desc) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.addGoods,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        spu_code: spu_code,
                        spu_name: spu_name,
                        supplier_category_id: supplier_category_id,
                        brand_id: brand_id,
                        unit: unit,
                        sort: sort,
                        skus: skus,
                        specification: specification,
                        others: others,
                        keyword: keyword,
                        desc: desc
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
            //删除商品
            delGoods: function(spu_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.operateGoods.replace('{spu_id}', spu_id),
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
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            //获取单个商品信息
            getSingleGoodsInfo: function(spu_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getSingleInfo.replace('{spu_id}', spu_id),
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
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            //修改spu信息
            editSpuInfo: function(spu_id, company_id, spu_code, spu_name, supplier_category_id, brand_id, unit, sort, skus, specification, others, keyword, desc) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.operateGoods.replace('{spu_id}', spu_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        company_id: company_id,
                        spu_code: spu_code,
                        spu_name: spu_name,
                        supplier_category_id: supplier_category_id,
                        brand_id: brand_id,
                        unit: unit,
                        sort: sort,
                        skus: skus,
                        specification: specification,
                        others: others,
                        keyword: keyword,
                        desc: desc
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
            //生成spu编码
            createSpuCode: function() {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.createSpuCode,
                    method: 'POST',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
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
            //获取sku_id
            getSkuId: function() {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getSkuId,
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
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            //获取sku详细信息
            getSkuDetail: function(sku_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getSkuDetail,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        sku_id: sku_id,
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
            //获取品牌
            getBrands: function(offset, limit) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getBrands,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
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
            //获取分类列表
            getCategorys: function(company_id) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.getCategorys,
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
            //上架 下架
            editStatus: function(spu_id, status) {
                var defer = $q.defer();
                $http({
                    url: config.urlPrefix + config.urlDict.editStatus.replace('{spu_id}', spu_id),
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                    },
                    data: {
                        status: status,
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
            //获取项目上传token
            getUploadToken: function(project_id, bundle_number) {
                if (!bundle_number) {
                    bundle_number = '';
                }
                var defer = $q.defer();
                $http({
                    url: config.imgUrl + config.urlDict.getUploadToken,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        project_id: project_id, //品牌: 1 广告: 2 图片:3
                        bundle_number: bundle_number,
                    }
                }).success(function(response, header, config) {
                    if (response.bundle_number) {
                        defer.resolve(response);
                    }
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            //获取bundle_number的图片列表
            getPicsList: function(bundle_number) {
                var defer = $q.defer();
                $http({
                    url: config.imgUrl + config.urlDict.getPicsList.replace('{bundle_number}', bundle_number),
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token')
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
            //批量修改bundle_number的图片业务关系
            modifyPics: function(bundle_number, pics) {
                var defer = $q.defer();
                $http({
                    url: config.imgUrl + config.urlDict.modifyPics + bundle_number,
                    method: 'PUT',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        bundle_number: bundle_number,
                    },
                    data: pics
                }).success(function(response, header, config) {
                    defer.resolve(response);
                }).error(function(response, header, config) {
                    defer.reject(response.message);
                });
                return defer.promise;
            },
            //批量获取bundle_number的缩略图
            getThumbnailList: function(bundle_number) {
                var defer = $q.defer();
                $http({
                    url: config.imgUrl + config.urlDict.getThumbnailList,
                    method: 'GET',
                    params: {
                        'access_token': $cookieStore.get('access_token'),
                        bundle_number: bundle_number
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
        }
    }]);
});
