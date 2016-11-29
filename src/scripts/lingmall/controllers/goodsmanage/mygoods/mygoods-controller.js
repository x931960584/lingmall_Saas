define(['../../controllers'], function(controllers) {
    controllers.controller('MygoodsCtrl', ['$scope', '$rootScope', '$uibModal', 'MyGoodsServices', 'OrgServices', 'growl', '$cookieStore', '$filter', '$document',
        function($scope, $rootScope, $uibModal, MyGoodsServices, OrgServices, growl, $cookieStore, $filter, $document) {
            $scope.brand = '全部品牌';
            $scope.category = '全部分类';
            $scope.status = '全部状态';
            $scope.pageSize = 5;
            $scope.pageIndex = 0;
            $scope.key = null;
            $scope.company_id = $cookieStore.get('company_id');
            $scope.checkedIdList = [];
            $scope.showCategoryList = false;

            $scope.statusList = [{
                name: '全部状态',
                status_id: ''
            }, {
                name: '上架',
                status_id: 1
            }, {
                name: '下架',
                status_id: 2
            }];

            $scope.upStatusModalScope = {
                confirm: true,
                deleteText: '是否确认上架?',
            };
            $scope.downStatusModalScope = {
                confirm: true,
                deleteText: '是否确认下架?',
            };
            $scope.deleteGoodsModalScope = {
                confirm: true,
                deleteText: '是否确认删除?',
            };

            $scope.mygoodsList = [];
            $scope.tableOptions = {
                //修改上架 下架 状态提示框
                upStatus: function(spu_id, status) { //上架
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribeBy: 'modal-body',
                        templateUrl: './views/modal/modal_tem.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'ms',
                        backdrop: 'static',
                        resolve: {
                            header: function() {
                                return '提示信息';
                            },
                            contents: {
                                scope: $scope.upStatusModalScope,
                                templateurl: './views/modal/delete_modal.html',
                            },
                            footer: function() {
                                return {
                                    submit: function() {
                                        MyGoodsServices.editStatus(spu_id, status).then(function(data) {
                                            //改变当前状态
                                            for (var i = 0; i < $scope.mygoodsList.length; i++) {
                                                if($scope.mygoodsList[i].spu_id == spu_id){
                                                    $scope.currentGoods = $scope.mygoodsList[i];
                                                }
                                            };
                                            $scope.currentGoods.status = status;
                                            $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                        }, function(data) {
                                            $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                        });
                                    }
                                }
                            }
                        }
                    })
                },
                downStatus: function(spu_id, status) { //下架
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribeBy: 'modal-body',
                        templateUrl: './views/modal/modal_tem.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'ms',
                        backdrop: 'static',
                        resolve: {
                            header: function() {
                                return '提示信息';
                            },
                            contents: {
                                scope: $scope.downStatusModalScope,
                                templateurl: './views/modal/delete_modal.html',
                            },
                            footer: function() {
                                return {
                                    submit: function() {
                                        MyGoodsServices.editStatus(spu_id, status).then(function(data) {
                                            //改变当前状态
                                            for (var i = 0; i < $scope.mygoodsList.length; i++) {
                                                if($scope.mygoodsList[i].spu_id == spu_id){
                                                    $scope.currentGoods = $scope.mygoodsList[i];
                                                }
                                            };
                                            $scope.currentGoods.status = status;
                                            $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                        }, function(data) {
                                            $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                        });
                                    }
                                }
                            }
                        }
                    })
                },
                deleteGoods: function(spu_id) { //删除
                    var modalInstance = $uibModal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribeBy: 'modal-body',
                        templateUrl: './views/modal/modal_tem.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'ms',
                        backdrop: 'static',
                        resolve: {
                            header: function() {
                                return '提示信息';
                            },
                            contents: {
                                scope: $scope.deleteGoodsModalScope,
                                templateurl: './views/modal/delete_modal.html',
                            },
                            footer: function() {
                                return {
                                    submit: function() {
                                        MyGoodsServices.delGoods(spu_id).then(function(data) {
                                            var delIndex = _.findIndex($scope.mygoodsList, function(n) {
                                                return n.spu_id == spu_id
                                            });
                                            $scope.mygoodsList.splice(delIndex, 1);
                                            $scope.getMyGoodsList();
                                            growl.addErrorMessage("删除成功");
                                            $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                        }, function(data) {
                                            $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                        });
                                    }
                                }
                            }
                        }
                    })
                },
                //全选 反选
                checkAll: function($event) {
                    $scope.checkedAll = $event.target;
                    $scope.checkedIdList = [];
                    if ($scope.checkedAll.checked) {
                        $scope.tableOptions.isCheckedAll = true;
                        $scope.tableOptions.isChecked = true;
                        var goodsListLen = $scope.mygoodsList.length;
                        for (var i = 0; i < goodsListLen; i++) {
                            $scope.checkedIdList.push($scope.mygoodsList[i].spu_id);
                        };
                    } else {
                        $scope.tableOptions.isChecked = false;
                        $scope.checkedIdList = [];
                    }
                },
                //单选
                checkOne: function($event, spu_id) {
                    $scope.checedkOne = $event.target;
                    if ($scope.checedkOne.checked) {
                        if ($scope.checkedIdList.indexOf(spu_id) == -1) {
                            $scope.checkedIdList.push(spu_id);
                        }
                        if ($scope.checkedIdList.length == $scope.mygoodsList.length) {
                            $scope.tableOptions.isCheckedAll = true;
                        }
                    } else {
                        $scope.tableOptions.isCheckedAll = false;
                        var index = $scope.checkedIdList.indexOf(spu_id);
                        $scope.checkedIdList.splice(index, 1);
                    }
                    // console.log('checkone',$scope.checkedIdList,'checkAll',$scope.tableOptions.isCheckedAll);
                }

            };

            //分类引入 tree-view
            $scope.categoryTree = [];
            $scope.categoryTreeOptions = {
                itemExpendedLevel: function() {},
                textField: 'supplier_category_name',
                childrenField: 'childs',
                rootParentLevel: 1,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.categoryTreeItem = $item;
                    $scope.selectCategory($item.$item.supplier_category_name, $item.$item.supplier_category_id);
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                }
            };
            var company_id = $cookieStore.get('company_id');
            $scope.categorysData = [];
            MyGoodsServices.getCategorys($scope.company_id).then(function(data) {
                $scope.categorysData = data.list;
                $scope.categoryTreeOptions.fixedToTree(data.list, $scope.categoryTree);
                $scope.categoryTreeOptions.itemExpendedLevel($scope.categoryTree, 3);
            });


            //dropdown
            $scope.selectBrand = function(name, id) {
                $scope.brand = name;
                $scope.brand_id = id;
            };
            $scope.selectCategory = function(name, id) {
                $scope.category = name;
                $scope.category_id = id;
                $scope.showCategoryList = false;
            };
            $scope.selectStatus = function(name, id) {
                $scope.status = name;
                $scope.status_id = id;
            };
            //搜索
            $scope.search = function() {
                $scope.pageIndex = 0;
            };

            //获取我的商品
            $scope.getMyGoodsList = function() {
                MyGoodsServices.getGoodsList($scope.key, $scope.brand_id, $scope.category_id, $scope.status_id, $scope.pageIndex, $scope.pageSize).then(function(data) {
                    $scope.mygoodsList = data.list;
                    $scope.mygoodsCount = data.count;
                    var skuList = _.map($scope.mygoodsList, function(n) {
                        return n.skus
                    });
                    //页码
                    $scope.maxSize = 5;
                    $scope.bigTotalItems = $scope.mygoodsCount;
                    //获取img_sku_id列表
                    $scope.imgSkuIdList = [];
                    var getImgSkuIdList = function(skuList) {
                        for (var i = 0; i < skuList.length; i++) {
                            for (var j = 0; j < skuList[i].length; j++) {
                                $scope.imgSkuIdList.push(skuList[i][j].img_sku_id)
                            };
                        };
                    };
                    getImgSkuIdList(skuList);

                    if ($scope.mygoodsCount && $scope.imgSkuIdList) {
                        $scope.getImgUrl($scope.imgSkuIdList);
                    }
                })
            };
            $scope.getMyGoodsList();

            //获取图片信息
            $scope.getImgUrl = function(imgSkuIdList) {
                var imgSkuIdList = imgSkuIdList;
                MyGoodsServices.getThumbnailList(imgSkuIdList).then(function(data) {
                    $scope.imgUrlList = [];
                    $scope.bundleNumberList = [];

                    for (var i = 0; i < data.length; i++) {
                        $scope.imgUrlList.push({ img_url: data[i].domain + '/' + data[i].key + '-thumbnail100', bundle_number: data[i].bundle_number });
                        $scope.bundleNumberList.push(data[i].bundle_number);
                    };

                    for (var i = 0; i < imgSkuIdList.length; i++) {
                        if ($scope.bundleNumberList.indexOf(imgSkuIdList[i]) == -1) {
                            $scope.imgUrlList.push({ img_url: 'assets/images/none.png', bundle_number: imgSkuIdList[i] });
                        }
                    };
                })
            };
            //页码
            $scope.setPage = function() {
                $scope.pageIndex = $scope.bigCurrentPage;
                $scope.pageIndex = $scope.pageSize * ($scope.pageIndex - 1);
                $scope.getMyGoodsList();
            };
            //获取品牌
            $scope.getBrand = function() {
                MyGoodsServices.getBrands(0, 10000000000000).then(function(data) {
                    $scope.brandsList = data.list;
                });
            };
            $scope.getBrand();
            //获取分类
            $scope.getCategory = function() {
                MyGoodsServices.getCategorys($scope.company_id).then(function(data) {
                    $scope.categorysData = data.list;
                    var data = data.list;
                    //循环遍历分类
                    $scope.categorysList = [];

                    function push(data) {
                        for (var i = 0; i < data.length; i++) {
                            $scope.categorysList.push({
                                supplier_category_name: data[i].supplier_category_name,
                                supplier_category_id: data[i].supplier_category_id,
                                last: data[i].last
                            });
                            if (data[i].childs) {
                                push(data[i].childs)
                            }
                            /*if (!data[i].childs) {
                                $scope.categorysList.push({ supplier_category_name: data[i].supplier_category_name, supplier_category_id: data[i].supplier_category_id })
                            } else {
                                push(data[i].childs)
                            }*/
                        }
                    }
                    push(data);
                });
            };
            //$scope.getCategory();
            //显示分类下拉框
            $scope.showCategoryBox = function(event) {
                var event = event || window.event;
                event.stopPropagation(); //阻止向上冒泡
                $scope.showCategoryList = !$scope.showCategoryList;
            };
            //点击空白隐藏
            $document.bind('click', function() {
                $scope.showCategoryList = false;
                $scope.$apply();
            });
            //弹出框阻止冒泡
            $scope.stop = function() {
                var event = event || window.event;
                event.stopPropagation(); //阻止向下冒泡
            };

        }
    ]).directive('goodsTable', [function() {
        return {
            restrict: 'EA',
            scope: {
                options: '=options',
                mygoodsList: '=mygoodsList',
                statusList: '=statusList',
                imgUrlList: '=imgUrlList',
                //checkedIdList:'=checkedIdList',
                accessControl: '=accessControl'
            },
            templateUrl: './views/common/goodstable/goodstable.html',
            link: function(scope, elem, attrs) {}
        }
    }]);
});
