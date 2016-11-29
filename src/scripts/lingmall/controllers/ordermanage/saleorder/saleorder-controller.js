define(['../../controllers'], function(controllers) {
    controllers.controller('SaleorderCtrl', ['$scope', 'growl', '$stateParams', 'SaleorderServices', 'OrgServices', '$cookieStore', '$filter', function($scope, growl, $stateParams, SaleorderServices, OrgServices, $cookieStore, $filter) {
        /*var dateFilter = $filter('date');
        $scope.dateFormat = 'yyyy-mm-dd';
        $scope.startTimePlaceholder="开始时间";
        $scope.endTimePlaceholder="结束时间";

        $scope.order_status = $stateParams.order_status;
        $scope.status = $stateParams.status_name;

        $scope.$watch('startTime', function(nv, ov) {
            if (nv != ov) {
                $scope.getOrderList();
            }
        });
        $scope.$watch('endTime', function(nv, ov) {
            if (nv !== ov) {
                $scope.getOrderList();
            }
        });

        $scope.startDate = ' ';
        $scope.endDate = ' ';
        $scope.order_code = null;

        $scope.seller_company_id = $cookieStore.get('company_id');
        $scope.company_id = $cookieStore.get('company_id');
        $scope.buyer_company_id = null;

        //order_type 类型 (销售：sale，采购：purchase) //怎么判断用户是采购还是销售
        $scope.order_type = 'sale';
        $scope.pageIndex = 0;
        $scope.pageSize = 8;

        //订单状态
        $scope.orderStatus = [{
            order_status: null,
            status_name: '全部订单'
        }, {
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
        }];
        $scope.status = '全部订单';

        //获取订单列表
        $scope.getOrderList = function() {
            $scope.startDate = dateFilter($scope.startTime, 'yyyy-MM-dd');
            $scope.endDate = dateFilter($scope.endTime, 'yyyy-MM-dd');
            SaleorderServices.getOrderList($scope.order_type, $scope.buyer_company_id, $scope.seller_company_id, $scope.order_code, $scope.order_status, $scope.startDate, $scope.endDate, $scope.pageIndex, $scope.pageSize).then(function(data) {
                $scope.orderList = data.list;
                $scope.orderCount = data.count;
                $scope.maxSize = 5;
                $scope.bigTotalItems = $scope.orderCount;

                //搜索提示
                if (($scope.order_code != null || $scope.order_status != null || $scope.startDate || $scope.endDate) && $scope.orderCount == 0) {
                    growl.addInfoMessage("未搜索到相关订单");
                }
            })
        };
        $scope.getOrderList();

        //页码
        $scope.setPage = function() {
            $scope.pageIndex = $scope.bigCurrentPage;
            $scope.pageIndex = $scope.pageSize * ($scope.pageIndex - 1);
            $scope.getOrderList();
        };

        //取消订单
        $scope.showOrderCancelBox = function(order_id) {
            $scope.order_id = order_id;
            $scope.currentOrder = _.find($scope.orderList, function(n) {
                return n.order_id == order_id
            });
            $scope.orderCancelBox = true;
        };
        $scope.cancelOrder = function() {
            SaleorderServices.orderCancel($scope.order_id, $scope.company_id).then(function(data) {
                $scope.currentOrder.status = 0; //0:已取消
                $scope.orderCancelBox = false;
            })
        };
        //确认收货
        $scope.showConfirmDeliveryBox = function(order_id) {
            $scope.order_id = order_id;
            $scope.currentOrder = _.find($scope.orderList, function(n) {
                return n.order_id == order_id
            });
            $scope.confirmDeliveryBox = true;
        };
        $scope.confirmDelivery = function() {
            SaleorderServices.orderReceive($scope.order_id, $scope.company_id).then(function(data) {
                $scope.currentOrder.status = 4; //4:已收货
                $scope.confirmDeliveryBox = false;
            })
        };
        //订单发货
        $scope.showOrderSendBox = function(order_id) {
            $scope.order_id = order_id;
            $scope.currentOrder = _.find($scope.orderList, function(n) {
                return n.order_id == order_id
            });
            $scope.orderSendBox = true;
        };
        $scope.orderSend = function() {
            SaleorderServices.orderSend($scope.order_id, $scope.company_id).then(function(data) {
                $scope.currentOrder.status = 3; //3:已发货
                $scope.orderSendBox = false;
            })
        };
        //修改运费
        $scope.showUpdateFeeBox = function(order_id, freight) {
            $scope.order_id = order_id;
            $scope.currentOrder = _.find($scope.orderList, function(n) {
                return n.order_id == order_id
            });
            console.log($scope.currentOrder);
            $scope.current_freight = $scope.currentOrder.freight;
            $scope.update_fee = '';
            $scope.update_fee_momo = $scope.currentOrder.memo;
            $scope.updateFeeBox = true;
        };
        $scope.updateFee = function() {
            SaleorderServices.updateFee($scope.order_id, $scope.update_fee, $scope.update_fee_momo).then(function(data) {
                // $scope.currentOrder.freight = data.fee;
                $scope.getOrderList();
                $scope.updateFeeBox = false;
            })
        };
        $scope.updateFeeInput = function(fee) {
            if (fee) {
                if (isNaN(fee)) {
                    $scope.update_fee = '';
                } else {
                    $scope.update_fee = Number(fee).toFixed(2);
                }
            }
        };
        //确认完结
        $scope.showOrderCloseBox = function(order_id) {
            $scope.order_id = order_id;
            $scope.currentOrder = _.find($scope.orderList, function(n) {
                return n.order_id == order_id
            });
            $scope.orderCloseBox = true;
        };
        $scope.orderClose = function() {
            SaleorderServices.orderClose($scope.order_id, $scope.company_id).then(function(data) {
                $scope.currentOrder.status = 5; //5:已结单
                $scope.orderCloseBox = false;
            })
        };
        $scope.cancel = function() {
            $scope.orderCancelBox = false;
            $scope.confirmDeliveryBox = false;
            $scope.orderSendBox = false;
            $scope.orderCloseBox = false;
            $scope.updateFeeBox = false;
        };

        //选择订单状态
        $scope.selectStatus = function(order_status, status_name) {
            $scope.order_status = order_status;
            $scope.status = status_name;
            $scope.getOrderList();
        };*/

    }]);
});
