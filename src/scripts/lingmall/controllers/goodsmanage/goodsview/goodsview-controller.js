define(['../../controllers'], function(controllers) {
    controllers.controller('goodsviewCtrl', ['$scope', '$stateParams', '$sce', 'MyGoodsServices', function($scope, $stateParams, $sce, MyGoodsServices) {
        //
        $scope.spu_id = $stateParams.spu_id;
        $scope.getGoods = function() {
            MyGoodsServices.getSingleGoodsInfo($scope.spu_id).then(function(data) {
                $scope.good = data;
                //商品规格
                $scope.skuGroup = data.skus;
                $scope.itemGroup = data.extend.specification;
                //console.log($scope.skuGroup,$scope.itemGroup);

                //解决ng-bind-html过滤style样式问题
                $scope.desc = $sce.trustAsHtml(data.desc);

                //获取img_sku_id列表
                $scope.imgSkuIdList = [];
                _.map($scope.skuGroup,function(n){return $scope.imgSkuIdList.push(n.img_sku_id)});
                $scope.getImgUrl($scope.imgSkuIdList);
            });
        };
        //
        $scope.getGoods();

        //获取批量bundle_number的缩略图
        //获取图片信息
        $scope.getImgUrl = function(imgSkuIdList) {
            MyGoodsServices.getThumbnailList(imgSkuIdList).then(function(data) {
                $scope.imgUrlList = [];
                for (var i = 0; i < data.length; i++) {
                    $scope.imgUrlList.push({img_url:data[i].domain + '/' + data[i].key + '-thumbnail100',bundle_number:data[i].bundle_number});
                };
            })
        };

    }]);
});
