define(['../../controllers'], function(controllers) {
    controllers.controller('SaleorderdetailCtrl', ['$scope', '$rootScope', 'SaleorderServices', 'MyGoodsServices', '$uibModal', '$location', '$stateParams', '$cookieStore', 'growl',
        function($scope, $rootScope, SaleorderServices, MyGoodsServices, $uibModal, $location, $stateParams, $cookieStore, growl) {
            $scope.order_id = $stateParams.order_id;
            $scope.company_id = $cookieStore.get('company_id');
            $scope.orderCancelBox = false;
            //获取订单详情
            $scope.getOrderDetail = function() {
                SaleorderServices.orderDetail($scope.order_id, $scope.company_id).then(function(data) {
                    $scope.orderDetail = data;
                    $scope.skuList = data.goods_info;
                    //订单状态
                    $scope.orderStatus = data.order_info.status;
                    //运费
                    $scope.total_freight_price = (($scope.orderDetail.order_info.total_price * 100 - $scope.orderDetail.order_info.goods_total_pric * 100) / 100).toFixed(2);
                    //获取img_sku_id列表
                    $scope.imgSkuIdList = [];
                    for (var i = 0; i < $scope.skuList.length; i++) {
                        $scope.imgSkuIdList.push($scope.skuList[i].sku.img_sku_id);
                    };
                    if($scope.imgSkuIdList.length!=0){
                        $scope.getImgUrl($scope.imgSkuIdList);
                    }
                })
            };
            $scope.getOrderDetail();

            //获取商品图片信息
            $scope.getImgUrl = function(imgSkuIdList) {
                MyGoodsServices.getThumbnailList(imgSkuIdList).then(function(data) {
                    $scope.imgUrlList = [];
                    $scope.bundleNumberList = [];
                    for (var i = 0; i < data.length; i++) {
                        $scope.imgUrlList.push({img_url:data[i].domain + '/' + data[i].key + '-thumbnail100',bundle_number:data[i].bundle_number});
                        $scope.bundleNumberList.push(data[i].bundle_number);
                    };
                    for (var i = 0; i < imgSkuIdList.length; i++) {
                        if($scope.bundleNumberList.indexOf(imgSkuIdList[i]) == -1){ //不包含
                            $scope.imgUrlList.push({ img_url: 'assets/images/none.png', bundle_number: imgSkuIdList[i] });
                        }
                    };
                })
            };

            //取消订单
            $scope.cancelOrder = function(){
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '取消订单提示';
                        },
                        contents: {
                            scope: {
                                deleteText: '是否取消订单',
                                btnText: '查看订单',
                                confirm: true,
                            },
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    SaleorderServices.orderCancel($scope.order_id, $scope.company_id).then(function(data) {
                                        $location.path('/main/salesorder');
                                        growl.addSuccessMessage('取消成功');
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                })
            };


            //订单状态
            $scope.orderStatusList = [{
                order_status: 0,
                status_name: '已取消'
            }, {
                order_status: 1,
                status_name: '待支付'
            }, {
                order_status: 2,
                status_name: '待发货'
            }, {
                order_status: 3,
                status_name: '已发货'
            }, {
                order_status: 4,
                status_name: '已收货'
            }, {
                order_status: 5,
                status_name: '已结单'
            }, {
                order_status: 6,
                status_name: '支付处理中'
            }, {
                order_status: null,
                status_name: '全部订单'
            }];
        }
    ]);
});
