define(['../controllers'], function(controllers) {
    controllers.controller('regionalSalesCtrl', ['$scope', '$cookieStore', '$state', '$location', '$uibModal', 'WarehouseServices', 'MyClientsSernice', function($scope, $cookieStore, $state, $location, $uibModal, WarehouseServices, MyClientsSernice) {
        console.log('regionalSalesCtrl');
        //列表
        var offset = 0;
        var limit = 10;
        var keyword = null;
        var regionSearList = function() {
            MyClientsSernice.regionList(offset, limit, keyword).then(function(data) {
                $scope.regionList = data.items;
                $scope.bigTotalItems=data.count;
            }, function(data) {

            })
        }
        regionSearList();
        $scope.setPage = function() {
            offset = ($scope.bigCurrentPage - 1) * limit;
            regionSearList();
        }
        $scope.searchRegion = function() {
            keyword = $scope.keyWord;
            regionSearList();
        }
        $scope.regionDel = function(region_id) {
            $scope.newDel = {
                mianMatter: '当前销售区域是否确定删除?',
                id: region_id,
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
                            submit: MyClientsSernice.regionDel,
                            isList: function() {
                                regionSearList();
                            }
                        };
                        return option;
                    }
                }
            })
        }






        //新增数状插件
        $scope.newModalItem = {
            item: {
                range: null,
                name: null
            },
            proRang: [],
            rangList: [],
            operTree: [],
            operTreeOptions: {
                fixedToTree: function() {},
                itemExpendedLevel: function() {},
                sourceTreeData: [],
                textField: 'city_name',
                childrenField: 'citys',
                rootParentLevel: 1,
                canChecked: true,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.operSelectedItem = $item;

                },
                itemCheckedChanged: function($item) {
                    var operChecked = $item.$item;
                    console.log('operChecked', operChecked)
                    if (operChecked.type == 'province') {
                        if (operChecked.isChecked) {

                            for (var i = 0; i < operChecked.citys.length; i++) {
                                operChecked.citys[i].isChecked = true;
                                $scope.newModalItem.rangList.push({ 'province': operChecked.citys[i].p_name, 'city': operChecked.citys[i].city_name })
                            };

                        } else {

                            for (var i = 0; i < operChecked.citys.length; i++) {
                                operChecked.citys[i].isChecked = false;
                                for (var j = 0; j < $scope.newModalItem.rangList.length; j++) {
                                    if ($scope.newModalItem.rangList[j].province == operChecked.citys[i].p_name && $scope.newModalItem.rangList[j].city == operChecked.citys[i].city_name) {
                                        $scope.newModalItem.rangList.splice(j, 1);
                                    }
                                };
                            };

                        }

                    } else if (operChecked.type == 'city') {

                        if (operChecked.isChecked) {
                            $scope.newModalItem.rangList.push({ 'province': operChecked.p_name, 'city': operChecked.city_name })
                        } else {
                            for (var k = 0; k < $scope.newModalItem.rangList.length; k++) {
                                if ($scope.newModalItem.rangList[k].province == operChecked.p_name && $scope.newModalItem.rangList[k].city == operChecked.city_name) {
                                    $scope.newModalItem.rangList.splice(k, 1);
                                }
                            };
                        }
                    };
                    var arrReg = [];
                    var arrRegList = [];
                    if ($scope.newModalItem.rangList.length > 0) {

                        for (var i = 0; i < $scope.newModalItem.rangList.length; i++) {
                            if (arrReg.indexOf($scope.newModalItem.rangList[i].province) == -1) {
                                arrReg.push($scope.newModalItem.rangList[i].province);
                            }

                        };
                        for (var i = 0; i < arrReg.length; i++) {
                            arrRegList.push({ 'p': arrReg[i], 'c': [] });
                        };

                        for (var j = 0; j < $scope.newModalItem.rangList.length; j++) {
                            for (var i = 0; i < arrRegList.length; i++) {
                                if (arrRegList[i].p == $scope.newModalItem.rangList[j].province) {
                                    if (arrRegList[i].c.indexOf($scope.newModalItem.rangList[j].city) == -1) {
                                        arrRegList[i].c.push($scope.newModalItem.rangList[j].city);
                                    }
                                }
                            };
                        };
                    }
                    $scope.newModalItem.item.range = JSON.stringify(arrRegList);
                }
            },
            operSelectedItem: {},
        };
        //编辑数状插件
        $scope.editModalItem = {
            item: {
                range: null,
                name: null,
            },
            id:null,
            proRang: [],
            rangList: [],
            operTree: [],
            operTreeOptions: {
                fixedToTree: function() {},
                itemExpendedLevel: function() {},
                sourceTreeData: [],
                textField: 'city_name',
                childrenField: 'citys',
                rootParentLevel: 1,
                canChecked: true,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.operSelectedItem = $item;

                },
                itemCheckedChanged: function($item) {
                    var operChecked = $item.$item;
                    console.log('qq', operChecked)
                    if (operChecked.type == 'province') {
                        if (operChecked.isChecked) {
                            for (var i = 0; i < operChecked.citys.length; i++) {
                                operChecked.citys[i].isChecked = true;
                                $scope.editModalItem.rangList.push({ 'province': operChecked.citys[i].p_name, 'city': operChecked.citys[i].city_name })
                            };
                        } else {

                            for (var i = 0; i < operChecked.citys.length; i++) {
                                operChecked.citys[i].isChecked = false;
                                for (var j = 0; j < $scope.editModalItem.rangList.length; j++) {
                                    if ($scope.editModalItem.rangList[j].province == operChecked.citys[i].p_name && $scope.editModalItem.rangList[j].city == operChecked.citys[i].city_name) {
                                        $scope.editModalItem.rangList.splice(j, 1);
                                    }
                                };
                            };
                        }

                    } else if (operChecked.type == 'city') {
                        if (operChecked.isChecked) {
                            $scope.editModalItem.rangList.push({ 'province': operChecked.p_name, 'city': operChecked.city_name })
                        } else {
                            for (var k = 0; k < $scope.editModalItem.rangList.length; k++) {
                                if ($scope.editModalItem.rangList[k].province == operChecked.p_name && $scope.editModalItem.rangList[k].city == operChecked.city_name) {
                                    $scope.editModalItem.rangList.splice(k, 1);
                                }
                            };
                        }
                    }
                    console.log('rangList',$scope.editModalItem.rangList)
                    var arrReg = [];
                    var arrRegList = [];
                    if ($scope.editModalItem.rangList.length > 0) {

                        for (var i = 0; i < $scope.editModalItem.rangList.length; i++) {
                            if (arrReg.indexOf($scope.editModalItem.rangList[i].province) == -1) {
                                arrReg.push($scope.editModalItem.rangList[i].province);
                            }

                        };
                        for (var i = 0; i < arrReg.length; i++) {
                            arrRegList.push({ 'p': arrReg[i], 'c': [] });
                        };

                        for (var j = 0; j < $scope.editModalItem.rangList.length; j++) {
                            for (var i = 0; i < arrRegList.length; i++) {
                                if (arrRegList[i].p == $scope.editModalItem.rangList[j].province) {
                                    if (arrRegList[i].c.indexOf($scope.editModalItem.rangList[j].city) == -1) {
                                        arrRegList[i].c.push($scope.editModalItem.rangList[j].city);
                                    }
                                }
                            };
                        };
                    }
                    $scope.editModalItem.item.range = JSON.stringify(arrRegList);
                    //console.log('hhhh', JSON.stringify($scope.newModalItem.rangList))
                }
            },
            operSelectedItem: {},
        }
        WarehouseServices.getAllCityList().then(function(data) {
            $scope.newModalItem.operTreeOptions.sourceTreeData = data;
            $scope.newModalItem.operTreeOptions.fixedToTree(data, $scope.newModalItem.operTree);
            $scope.newModalItem.operTreeOptions.itemExpendedLevel($scope.newModalItem.operTree, 3);
            $scope.editModalItem.operTreeOptions.sourceTreeData = data;
            $scope.editModalItem.operTreeOptions.fixedToTree(data, $scope.newModalItem.operTree);
            $scope.editModalItem.operTreeOptions.itemExpendedLevel($scope.newModalItem.operTree, 3);
        }, function(data) {

        })

        //新增区域
        $scope.addRegional = function() {
            var proRangItem = $scope.newModalItem.operTree;
            for (var i = 0; i < proRangItem.length; i++) {
                proRangItem[i].isChecked = false;
                for (var k = 0; k < proRangItem[i].citys.length; k++) {
                    proRangItem[i].citys[k].isChecked = false;
                };
            };
            $scope.newModalItem.item = {
                range: null,
                name: null
            };
            $scope.newModalItem.operTree = [];
            $scope.newModalItem.proRang = [];
            $scope.newModalItem.rangList = [];
            //$scope.addModalItem = $scope.newModalItem;
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '新增销售区域';
                    },
                    contents: {
                        scope: $scope.newModalItem,
                        templateurl: './views/clients/saleMod.html',
                    },
                    footer: function() {
                        var options = {
                            submit: MyClientsSernice.regionAdd,
                            isList: function() {
                                regionSearList();
                            },
                        };
                        return options;
                    }
                }
            });
        };

        //编辑区域
        $scope.regionEdit = function(region_id) {
            var proRangItem = $scope.editModalItem.operTree;
            for (var i = 0; i < proRangItem.length; i++) {
                proRangItem[i].isChecked = false;
                for (var k = 0; k < proRangItem[i].citys.length; k++) {
                    proRangItem[i].citys[k].isChecked = false;
                };
            };
            $scope.editModalItem.id=region_id;
            $scope.editModalItem.item = {
                range: null,
                name: null,
            };
            $scope.editModalItem.operTree = [];
            $scope.editModalItem.proRang = [];
            $scope.editModalItem.rangList = [];
            MyClientsSernice.regionCheck(region_id).then(function(data) {
                $scope.editModalItem.item.name = data.name;
                $scope.editModalItem.item.range = data.range;
                var RagCity = JSON.parse(data.range);
                var cityArr=[];
                for (var i = 0; i < $scope.editModalItem.operTree.length; i++) {
                    for (var j = 0; j < RagCity.length; j++) {
                        if(RagCity[j].p == $scope.editModalItem.operTree[i].city_name){
                            $scope.editModalItem.operTree[i].isChecked=true;
                            for (var k = 0; k < RagCity[j].c.length; k++) {
                                for (var v = 0; v < $scope.editModalItem.operTree[i].citys.length; v++) {
                                    if(RagCity[j].c[k]==$scope.editModalItem.operTree[i].citys[v].city_name){
                                        $scope.editModalItem.operTree[i].citys[v].isChecked=true;
                                    }
                                };
                            };
                        }
                    };
                };
                for (var i = 0; i < RagCity.length; i++) {
                    for (var j = 0; j < RagCity[i].c.length; j++) {
                        cityArr.push({'province':RagCity[i].p,'city':RagCity[i].c[j]})
                    };
                };
                $scope.editModalItem.rangList=cityArr;
            }, function(data) {

            })
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '编辑销售区域';
                    },
                    contents: {
                        scope: $scope.editModalItem,
                        templateurl: './views/clients/saleMod.html',
                    },
                    footer: function() {
                        var options = {
                            submit: MyClientsSernice.regionEdit,
                            isList: function() {
                                regionSearList();
                            },
                        };
                        return options;
                    }
                }
            });
        };

        //查看区域详情
        $scope.regionCheck=function(region_id){
            $scope.checkItem={
                name:null,
                cityList:null,
                pageView:'view',
                pageName:'view',
            }
            MyClientsSernice.regionCheck(region_id).then(function(data) {
                $scope.checkItem.name=data.name;
                $scope.checkItem.cityList=JSON.parse(data.range);
            }, function(data) {

            })
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '销售区域详情';
                    },
                    contents: {
                        scope: $scope.checkItem,
                        templateurl: './views/clients/ckecMod.html',
                    },
                    footer: function() {
                        var options = {
                            submit: MyClientsSernice.regionEdit,
                            isList: function() {
                                regionSearList();
                            },
                        };
                        return options;
                    }
                }
            });
        }


    }])
})
