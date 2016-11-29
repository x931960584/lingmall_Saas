define(['../../controllers'], function(controllers) {
    controllers.controller('SalesorderCtrl', ['$scope', '$rootScope', 'growl', '$uibModal', '$stateParams', 'SaleorderServices', 'OrgServices', '$cookieStore', '$filter',
        function($scope, $rootScope, growl, $uibModal, $stateParams, SaleorderServices, OrgServices, $cookieStore, $filter) {
            var dateFilter = $filter('date');
            $scope.dateFormat = 'yyyy-mm-dd';
            $scope.startTimePlaceholder = "开始时间";
            $scope.endTimePlaceholder = "结束时间";

            $scope.order_status = $stateParams.order_status;
            $scope.status = $stateParams.status_name;

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

            //选择订单状态
            $scope.selectStatus = function(order_status, status_name) {
                $scope.order_status = order_status;
                $scope.status = status_name;
            };
            //弹出框
            $scope.cancelOrder = function(order_id) {
                for (var i = 0; i < $scope.orderList.length; i++) {
                    if ($scope.orderList[i].order_id == order_id) {
                        $scope.currentOrder = $scope.orderList[i];
                    }
                };
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
                                btnShow: true,
                                order_id: order_id,
                                path: 'main.saleorderdetail',
                                confirm: true,
                            },
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    SaleorderServices.orderCancel(order_id, $scope.company_id).then(function(data) {
                                        $scope.currentOrder.status = 0; //0:已取消
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    }, function(data) {
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                })
            };
            $scope.updateFeeModalScope = {
                confirm: true,
                updateFeeInput: function(fee) {
                    if (fee) {
                        if (isNaN(fee)) {
                            $scope.updateFeeModalScope.update_fee = '';
                        } else {
                            $scope.updateFeeModalScope.update_fee = Number(fee).toFixed(2);
                        }
                    }
                }
            };
            $scope.updateFee = function(order_id, freight) {
                for (var i = 0; i < $scope.orderList.length; i++) {
                    if ($scope.orderList[i].order_id == order_id) {
                        $scope.updateFeeModalScope.current_freight = $scope.orderList[i].freight;
                        $scope.updateFeeModalScope.update_fee_memo = $scope.orderList[i].memo;
                    }
                };
                $scope.updateFeeModalScope.update_fee = '';
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '修改运费提示';
                        },
                        contents: {
                            scope: $scope.updateFeeModalScope,
                            templateurl: './views/ordermanage/saleorder/updatefee.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    SaleorderServices.updateFee(order_id, $scope.updateFeeModalScope.update_fee, $scope.updateFeeModalScope.update_fee_memo).then(function(data) {
                                        $scope.getOrderList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    }, function(data) {
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                })
            };
            $scope.orderSend = function(order_id) {
                for (var i = 0; i < $scope.orderList.length; i++) {
                    if ($scope.orderList[i].order_id == order_id) {
                        $scope.currentOrder = $scope.orderList[i];
                    }
                };
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '确认发货提示';
                        },
                        contents: {
                            scope: {
                                deleteText: '是否确认发货?',
                                btnText: '查看订单',
                                btnShow: true,
                                order_id: order_id,
                                path: 'main.saleorderdetail',
                                confirm: true,
                            },
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    SaleorderServices.orderSend(order_id, $scope.company_id).then(function(data) {
                                        $scope.currentOrder.status = 3; //3:已发货
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    }, function(data) {
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                })
            };
            $scope.confirmDelivery = function(order_id) {
                for (var i = 0; i < $scope.orderList.length; i++) {
                    if ($scope.orderList[i].order_id == order_id) {
                        $scope.currentOrder = $scope.orderList[i];
                    }
                };
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '确认收货提示';
                        },
                        contents: {
                            scope: {
                                deleteText: '是否确认收货?',
                                btnText: '查看订单',
                                btnShow: true,
                                order_id: order_id,
                                path: 'main.saleorderdetail',
                                confirm: true,
                            },
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    SaleorderServices.orderReceive(order_id, $scope.company_id).then(function(data) {
                                        $scope.currentOrder.status = 4; //4:已收货
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    }, function(data) {
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                })
            };
            $scope.orderClose = function(order_id) {
                for (var i = 0; i < $scope.orderList.length; i++) {
                    if ($scope.orderList[i].order_id == order_id) {
                        $scope.currentOrder = $scope.orderList[i];
                    }
                };
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '结单提示';
                        },
                        contents: {
                            scope: {
                                deleteText: '是否确认结单?',
                                btnText: '查看订单',
                                btnShow: true,
                                order_id: order_id,
                                path: 'main.saleorderdetail',
                                confirm: true,
                            },
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    SaleorderServices.orderClose(order_id, $scope.company_id).then(function(data) {
                                        $scope.currentOrder.status = 5; //5:已结单
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    }, function(data) {
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                })
            };
        }
    ]);
});
