define(['../controllers'], function(controllers) {
    controllers.controller('outstockCtrl', ['$scope', '$rootScope', '$cookieStore', '$state', '$location', 'growl', 'outstockServices', '$uibModal', function($scope, $rootScope, $cookieStore, $state, $location, growl, outstockServices, $uibModal) {
        //初始化数据
        $scope.selectWarehour = "选择仓库";
        $scope.selectStatue = "入库状态";
        $scope.selectType = "入库类型";
        $scope.selectAudit = "审核状态";
        $scope.warehouse_in_bill_number = "";
        $scope.warehouse_id = "";
        $scope.in_status = "";
        $scope.in_type = "";
        $scope.review_status = "";
        $scope.start_time = "";
        $scope.end_time = "";
        var offsetWare = 0;
        var limitWare = 100
        var offset = 0;
        var limit = 10;
        $scope.dateFormat = 'yyyy-mm-dd hh:ii:00';
        $scope.startTimePlaceholder = "入库时间";
        $scope.endTimePlaceholder = "截止时间"
            //下拉数据
        $scope.outStatue = [
            { 'outStatue': '', 'outStatueName': '入库状态' },
            { 'outStatue': '1', 'outStatueName': '未入库' },
            { 'outStatue': '2', 'outStatueName': '已入库' },
        ];
        $scope.outType = [
            { 'outType': '', 'outTypeName': '入库类型' },
            { 'outType': '1', 'outTypeName': '采购入库' }
        ];
        $scope.outAudit = [
            { 'outAudit': '', 'outAuditName': '审核状态' },
            { 'outAudit': '1', 'outAuditName': '未审核' },
            { 'outAudit': '2', 'outAuditName': '待审核' },
            { 'outAudit': '3', 'outAuditName': '未通过审核' },
            { 'outAudit': '4', 'outAuditName': '已审核' },

        ]
        outstockServices.wareHousesList(offsetWare, limitWare).then(function(data) {
            $scope.wareList = data.list;
        }, function(data) {

        })
        $scope.denudedShow=false;
        $scope.inputTitle=function(){
            if($scope.warehouse_in_bill_number != ""){
            $scope.denudedShow=true;
            }else{
                $scope.denudedShow=false;
            }
        }
        $scope.denuded=function(){
            $scope.warehouse_in_bill_number="";
            $scope.denudedShow=false;
        }

        //搜索事件
        $scope.SecWare = function(warehouse_id, name) {
            $scope.selectWarehour = name;
            $scope.warehouse_id = warehouse_id;
        }
        $scope.SecAllWare = function() {
            $scope.selectWarehour = "全部仓库";
            $scope.warehouse_id = "";
        }
        $scope.inStatue = function(statue, name) {
            $scope.selectStatue = name;
            $scope.in_status = statue;
        }
        $scope.inType = function(type, name) {
            $scope.selectType = name;
            $scope.in_type = type;
        }
        $scope.reviewStatus = function(reviw, name) {
            $scope.selectAudit = name;
            $scope.review_status = reviw;
        }
        $scope.searchList = function() {
                offset = 0;
                getOutstockList();
            }
            //入库单列表
        var timeC = function(n) {
            var date = new Date(parseFloat(n) * 1000);
            return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        }
        var getOutstockList = function() {
            //$scope.start_time=$scope.start_time.replace('')
            outstockServices.outStockList(offset, limit, $scope.warehouse_in_bill_number, $scope.warehouse_id, $scope.in_status, $scope.in_type, $scope.review_status, $scope.start_time, $scope.end_time).then(function(data) {
                $scope.stocklist = data.list;
                $scope.bigTotalItems = data.count;
                for (var i = 0; i < $scope.stocklist.length; i++) {
                    $scope.stocklist[i].in_time = timeC(parseFloat($scope.stocklist[i].in_time));
                };
            }, function(data) {

            })
        }
        getOutstockList();

        //提交审核按钮
        $scope.submitAudit = function(id) {
                $scope.modalItem = {
                    mianMatter: '是否确认提交审核?',
                    id: id,
                    item: {
                        'status': 2,
                    }
                };
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: '',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return "提交审核提示";
                        },
                        contents: {
                            scope: $scope.modalItem,
                            templateurl: './views/goodsmanage/goodsbrand/delMod.html',
                        },
                        footer: function() {
                            var option = {
                                submit: outstockServices.outStockStat,
                                isList: function() {
                                    getOutstockList();
                                }
                            }
                            return option;
                        }
                    }
                })
            }
            //分页
        $scope.setPage = function() {
            offset = ($scope.bigCurrentPage - 1) * limit;
            getOutstockList();

        }



    }])
})
