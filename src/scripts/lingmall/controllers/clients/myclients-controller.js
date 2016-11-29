define(['../controllers'], function(controllers) {
    controllers.controller('myClientsCtrl', ['$scope', '$location', '$cookieStore', '$uibModal', 'MyClientsSernice', 'WarehouseServices', '$document', function($scope, $location, $cookieStore, $uibModal, MyClientsSernice, WarehouseServices, $document) {
        console.log("myClientsCtrl");
        var off, lim;
        var offset= 0;
        var limit= 10;
        var offset, limit, keyword, catagory_id, grade_id, region_id, verify_flag, province, city, status;
        $scope.verifyFlag = [{
            "state": 0,
            "name": "未建立"
        }, {
            "state": 1,
            "name": "已建立"
        }];
        var MyClientsList = function() {
            MyClientsSernice.custList(offset, limit, keyword, catagory_id, grade_id, region_id, verify_flag, province, city, status).then(function(data) {
                $scope.bigTotalItems = data.count;
                $scope.clientsList = data.items;

            }, function(data) {

            })
        }
        MyClientsList();
        //分页
        $scope.setPage = function() {
            offset = ($scope.bigCurrentPage - 1) * limit;
            MyClientsList();
        }
        //搜索条件栏
        $scope.iconShow = false;
        MyClientsSernice.cataList(off, lim).then(function(data) {
            $scope.cataLists = data.items;

        }, function(data) {

        })
        $scope.cataLi = function(name, id) {
            $scope.cataName = name;
            $scope.catagoryId = id;
            catagory_id = $scope.catagoryId;
        }
        $scope.cataAll = function() {
            $scope.cataName = '全部客户类型';
            $scope.catagoryId = null;
            catagory_id = $scope.catagoryId;
        }
        MyClientsSernice.gradeList(off, lim).then(function(data) {
            $scope.rankLists = data.items;

        }, function(data) {

        })
        $scope.rankLi = function(name, id) {
            $scope.rankName = name;
            $scope.gradeId = id;
            grade_id = $scope.gradeId;
        }
        $scope.rankAll = function() {
            $scope.rankName = '全部客户等级';
            $scope.gradeId = null;
            grade_id = $scope.gradeId;
        }
        MyClientsSernice.regionList(off, lim).then(function(data) {
            $scope.regionLists = data.items;
            console.log($scope.regionLists);

        }, function(data) {

        })
        $scope.regLi = function(name, id) {
            $scope.regName = name;
            $scope.regionId = id;
            region_id = $scope.regionId;
        }
        $scope.regAll = function() {
            $scope.regName = '全部销售区域';
            $scope.regionId = null;
            region_id = $scope.regionId;
        }
        $scope.supplyRelat = [{
            'name': '全部供应关系',
            'supply_id': null,
        }, {
            'name': '未建立',
            'supply_id': '1',
        }, {
            'name': '已建立',
            'supply_id': '2',
        }, ]
        $scope.supLi = function(name, id) {
            $scope.supplyName = name;
            $scope.supplyId = id;
            verify_flag = $scope.supplyId;
        }
        $scope.searchClient = function() {
                keyword = $scope.keyWord;
                MyClientsList();
            }
            //地址
        $scope.cityShow = false;
        $scope.proCity = function(e) {
            e.stopPropagation();
            $scope.cityShow = true;
        }
        $scope.cCity = function(e) {
            e.stopPropagation();
        }
        $scope.operTree = [];
        $scope.operTreeOptions = {
            fixedToTree: function() {},
            itemExpendedLevel: function() {},
            sourceTreeData: [],
            textField: 'city_name',
            childrenField: 'citys',
            rootParentLevel: 1,
            canChecked: false,
            isLeafIconClass: 'fa fa-leaf', //末级icon
            notExpendIconClass: 'fa fa-plus-square', //未展开icon
            isExpendIconClass: 'fa fa-minus-square', //已展开icon
            itemClicked: function($item) {
                $scope.operSelectedItem = $item;
                if ($scope.operSelectedItem.$item.type == 'province') {
                    return
                } else {
                    $scope.locaProvince = $scope.operSelectedItem.$item.p_name;
                    $scope.locaCity = $scope.operSelectedItem.$item.city_name;
                    province = $scope.locaProvince;
                    city = $scope.locaCity;
                    $scope.cityShow = false;
                }
            },
            itemCheckedChanged: function($item) {
                console.log($item, 'item checked');
            }
        };

        WarehouseServices.getAllCityList().then(function(data) {
            $scope.operTreeOptions.sourceTreeData = data;
            $scope.operTreeOptions.fixedToTree(data, $scope.operTree);
            $scope.operTreeOptions.itemExpendedLevel($scope.operTree, 1);
        }, function(data) {

        })
        $scope.cityClear = function() {
            $scope.locaProvince = null;
            $scope.locaCity = null;
            province = $scope.locaProvince;
            city = $scope.locaCity;
        }
        $document.bind('click', function() {
                $scope.cityShow = false;
                $scope.$apply()
            })
            //列表操作栏
        $scope.forClient = function(groId) {
            $scope.newFor = {
                mianMatter: '确认要禁用此用户吗?',
                titleRed:'禁用后，该客户将不允许购买任何商品!',
                id: groId,
                item: {
                    status:2
                },
            }
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '提示';
                    },
                    contents: {
                        scope: $scope.newFor,
                        templateurl: './views/clients/forMod.html'
                    },
                    footer: function() {
                        var option = {
                            submit: MyClientsSernice.custEdit,
                            isList: function() {
                                MyClientsList();
                            }
                        };
                        return option;
                    }
                }
            })
        };
        $scope.toClient = function(groId) {
            $scope.newFor = {
                mianMatter: '确认要启用此用户吗?',
                titleRed:'启用后，该客户将允许购买任何商品!',
                id: groId,
                item: {
                    status:1
                },
            }
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '提示';
                    },
                    contents: {
                        scope: $scope.newFor,
                        templateurl: './views/clients/forMod.html'
                    },
                    footer: function() {
                        var option = {
                            submit: MyClientsSernice.custEdit,
                            isList: function() {
                                MyClientsList();
                            }
                        };
                        return option;
                    }
                }
            })
        };
        $scope.delClient=function(groId){
        	$scope.newDel = {
                mianMatter: '当前客户是否确定删除?',
                id: groId,
                item: '',
            }
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '提示';
                    },
                    contents: {
                        scope: $scope.newDel,
                        templateurl: './views/goodsmanage/goodsbrand/delMod.html'
                    },
                    footer: function() {
                        var option = {
                            submit: MyClientsSernice.custDel,
                            isList: function() {
                                MyClientsList();
                            }
                        };
                        return option;
                    }
                }
            })
        }

    }])
})
