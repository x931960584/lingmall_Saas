define(['../controllers'], function(controllers) {
    controllers.controller('ActivitycheckCtrl', ['$scope', '$location', '$state', '$cookieStore', '$stateParams', 'ActivityListServices', 'MyGoodsServices', '$uibModal', function($scope, $location, $state, $cookieStore, $stateParams, ActivityListServices, MyGoodsServices, $uibModal) {

        $scope.activeStatus = [
            { 'active_status': 1, 'active_status_name': '上线' },
            { 'active_status': 2, 'active_status_name': '下线' }
        ];
        $scope.recommendStatus = [
            { 'recommend': 0, 'recommendname': '不推荐' },
            { 'recommend': 1, 'recommendname': '推荐' }
        ];

        var imgId = [];
        var groupon_id = $stateParams.id;
        $scope.getImgUrl = function(imgSkuIdList) {
            var imgSkuIdList = imgSkuIdList;
            var bundleNum = [];
            var moreNum = [];
            MyGoodsServices.getThumbnailList(imgSkuIdList).then(function(data) {
                $scope.imgUrlList = data;
                for (var i = 0; i < $scope.imgUrlList.length; i++) {
                    bundleNum.push($scope.imgUrlList[i].bundle_number);
                };
                for (var i = 0; i < imgSkuIdList.length; i++) {
                    if (bundleNum.indexOf(imgSkuIdList[i]) == -1) {
                        moreNum.push(imgSkuIdList[i]);
                    }
                };
                for (var i = 0; i < moreNum.length; i++) {
                    var imgList = { bundle_number: '', domain: 'assets/images', key: 'none.png' }
                    imgList.bundle_number = moreNum[i];
                    $scope.imgUrlList.push(imgList);

                };

            })
        };

        ActivityListServices.activityDetail(groupon_id).then(function(data) {
            for (var i = 0; i < data.groupon_skus.length; i++) {
                if (!data.groupon_skus[i].groupon_sku_fares[0].start_count) {
                    data.groupon_skus[i].groupon_sku_fares = [];

                }
            };

            $scope.data = data;
            var today = new Date();
            var e1 = new Date(Date.parse($scope.data.end_time));
            $scope.timeAll = today - e1;
            $scope.groupon_id = data.groupon_id;
            for (var i = 0; i < $scope.data.groupon_skus.length; i++) {
                imgId.push($scope.data.groupon_skus[i].sku.img_sku_id);

            };
            $scope.getImgUrl(imgId);
        }, function(data) {


        });

        $scope.emigration = function(biaoId) {
            //$scope.luggageShow=true;
            $scope.luggList = biaoId;
            $scope.lunglist = {
                luggList: $scope.luggList,
                pageView: 'view',
                pageName: 'view',

            }
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: 'md',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '运费详情';
                    },
                    contents: {
                        scope: $scope.lunglist,
                        templateurl: './views/activity/checkLung.html',
                    },
                    footer: function() {

                    }
                }
            })
        }
        $scope.luggagecancel = function() {
            $scope.luggageShow = false;
        }

    }])
})
