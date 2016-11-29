define(['../controllers'], function(controllers) {
    controllers.controller('auditOutstockCtrl', ['$scope', '$cookieStore', '$state', '$location', 'growl', '$stateParams', 'outstockServices', 'MyGoodsServices', '$uibModal', function($scope, $cookieStore, $state, $location, growl, $stateParams, outstockServices, MyGoodsServices, $uibModal) {
        var warehouse_in_bill_id = $stateParams.id;
        var status = "";
        var isType = $stateParams.isType;

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
        if (isType == 1) {
            //详情页面
            $scope.auditTitle = "查看入库单";
            $scope.auditShow = false;
        } else {
            //审核页面
            $scope.auditTitle = "审核入库单";
            $scope.auditShow = true;
        }
        outstockServices.outStockCheck(warehouse_in_bill_id).then(function(data) {
            var imgsku = [];
            $scope.auditDetail = data;
            var timeC = function(n) {
                var date = new Date(parseFloat(n) * 1000);
                return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
            }
            $scope.inTime = timeC($scope.auditDetail.in_time);
            for (var i = 0; i < $scope.auditDetail.warehouse_in_bill_skus.length; i++) {
                imgsku.push($scope.auditDetail.warehouse_in_bill_skus[i].sku.img_sku_id);
            };
            $scope.getImgUrl(imgsku)

        }, function(data) {

        })

        $scope.Marlboro = function() {
            $scope.newMar={
                mianMatter: '是否确认通过审核?',
                id:warehouse_in_bill_id,
                item:{
                    'status':4,
                }
            }
            $modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                resolve: {
                    header: function() {
                        return "提交审核提示";
                    },
                    contents: {
                        scope:$scope.newMar,
                        templateurl: './views/goodsmanage/goodsbrand/delMod.html',
                    },
                    footer: function() {
                        var option = {
                            submit:outstockServices.outStockStat,
                            isList: function(){
                                $location.path('main/outstock');
                            }
                        }
                        return option;
                    }
                }
            })

        }
        $scope.Noaudit = function() {
            $scope.newNo={
                mianMatter: '是否确认审核不通过?',
                id:warehouse_in_bill_id,
                item:{
                    'status':3,
                }
            }
            
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: '',
                    resolve: {
                        header: function() {
                            return "提交审核提示";
                        },
                        contents: {
                            scope: $scope.newNo,
                            templateurl: './views/goodsmanage/goodsbrand/delMod.html',
                        },
                        footer: function() {
                            var option = {
                                submit:outstockServices.outStockStat,
                                isList:function(){
                                    $location.path('main/outstock');
                                }
                            }
                            return option;
                        }
                    }
                })
            }
            //获取图片
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
                    var imgList = { bundle_number: '', domain: 'assets/images', key: 'none.png' };
                    imgList.bundle_number = moreNum[i];
                    $scope.imgUrlList.push(imgList);

                };
            })
        };

    }])
})
