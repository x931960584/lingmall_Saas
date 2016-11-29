define(['../controllers'], function(controllers) {
    controllers.controller('ConsoleCtrl', ['$scope', '$rootScope', '$state', '$cookieStore', '$uibModal', '$sce', 'SaleorderServices', 'ConsoleServices',
        function($scope, $rootScope, $state, $cookieStore, $uibModal, $sce, SaleorderServices, ConsoleServices) {
            $scope.pageIndex = 0;
            $scope.pageSize = 5;
            //不同状态下的订单数量
            $scope.getOrderCount = function() {
                var type = 'sale';
                var company_id = $cookieStore.get('company_id');
                SaleorderServices.getOrderCount(type, company_id).then(function(data) {
                    $scope.unpay = data.UNPAY; //等待支付
                    $scope.unsend = data.UNSEND; //等待发货
                    $scope.sended = data.SENDED; //已发货
                    $scope.received = data.RECEIVED; //已收货
                    $scope.finished = data.FINISHED; //已结单
                    $scope.paying = data.PAYING; //正在支付 (支付处理中)
                    $scope.cancel = data.CANCEL; //已取消
                })
            };
            $scope.getOrderCount();

            //订单查看权限限制
            $scope.linkToOrder = function(order_status, status_name){
                if($rootScope.accessControl.salesOrder.view ==1){
                    $state.go('main.salesorder',{order_status: order_status,status_name: status_name}, {reload: true} );
                }
            };

            //获取通告列表
            $scope.getNoticeList = function() {
                ConsoleServices.getNotices($scope.pageIndex, $scope.pageSize).then(function(data) {
                    $scope.noticeList = data.list;
                })
            };
            $scope.getNoticeList();
            //查看公告详情
            $scope.viewNoticeDetail = function(notice_id) {
                ConsoleServices.NoticesCheck(notice_id).then(function(data) {
                    $scope.noticeData = data;
                    var modalScope = {
                        pageName: 'view',
                        pageView: 'view',
                        title: $scope.noticeData.title,
                        time: $scope.noticeData.updated_at.slice(0, 10),
                        mainContent: $sce.trustAsHtml($scope.noticeData.content)
                    };
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribeBy: 'modal-body',
                        templateUrl: './views/modal/modal_tem.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                            header: function() {
                                return '平台通知';
                            },
                            contents: {
                                scope: modalScope,
                                templateurl: './views/console/platModal.html',
                            },
                            footer: function() {}
                        }
                    });
                });
            };
        }
    ])
});
