define(['../controllers'], function(controllers) {
    controllers.controller('WarehouseCtrl', ['$scope', '$rootScope', '$cookieStore', '$document', '$uibModal', 'growl', 'WarehouseServices', 'OrgServices',
        function($scope, $rootScope, $cookieStore, $document, $uibModal, growl, WarehouseServices, OrgServices) {
            $scope.pageSize = 8;
            $scope.pageIndex = 0;
            $scope.keyword = null;
            $scope.range = [];
            //状态
            $scope.status_name = '全部状态';
            $scope.warehouseStatus = [{
                warehouse_status: null,
                status_name: '全部状态'
            }, {
                warehouse_status: 1,
                status_name: '启用'
            }, {
                warehouse_status: 2,
                status_name: '禁用'
            }];
            //选择状态
            $scope.selectStatus = function(warehouse_status, status_name) {
                $scope.warehouse_status = warehouse_status;
                $scope.status_name = status_name;
            };
            // 选择的配送范围
            $scope.selectedList = [];
            $scope.selectRangeObj = [];
            $scope.selectRangeItem = [];
            //添加仓库选择的配送范围
            $scope.addWarehouseRange = [];
            //配送范围城市列表引入ngtree
            $scope.cityTree = [];
            $scope.cityTreeOptions = {
                itemExpendedLevel: function() {},
                textField: 'city_name',
                childrenField: 'citys',
                rootParentLevel: 1,
                canChecked: true,
                isLeafIconClass: 'mar-left', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.cityTreeItem = $item;
                },
                itemCheckedChanged: function($item) {
                    var item = $item.$item;
                    if (item.isChecked && $scope.selectRangeItem.indexOf(item) == -1) {
                        $scope.selectRangeItem.push(item);
                    } else {
                        $scope.selectRangeItem.splice($scope.selectRangeItem.indexOf(item), 1);
                    }
                    if (item.type == 'province') {
                        checkProvince(item);
                    } else if (item.type == 'city') {
                        checkCity(item);
                    }

                    function checkProvince(item) {
                        if (item.isChecked) {
                            //$scope.selectedList.push(item.city_name);省份
                            var citys = item.citys;
                            for (var i = 0; i < citys.length; i++) {
                                citys[i].isChecked = true;
                                $scope.selectedList.push(citys[i].city_name);
                                $scope.selectRangeObj.push({ province: citys[i].p_name, city: citys[i].city_name });
                            };
                        } else {
                            if ($scope.selectedList) {
                                /*var index = $scope.selectedList.indexOf(item.city_name); 省份
                                $scope.selectedList.splice(index, 1);*/
                                var citys = item.citys;
                                for (var i = 0; i < citys.length; i++) {
                                    citys[i].isChecked = false;
                                    var cityIndex = $scope.selectedList.indexOf(citys[i].city_name);
                                    $scope.selectedList.splice(cityIndex, 1);
                                    for (var j = 0; j < $scope.selectRangeObj.length; j++) {
                                        if ($scope.selectRangeObj[j].province == citys[i].p_name && $scope.selectRangeObj[j].city == citys[i].city_name) {
                                            $scope.selectRangeObj.splice(j, 1);
                                        }
                                    };
                                };
                            }
                        }
                    };

                    function checkCity(item) {
                        if (item.isChecked) {
                            $scope.selectedList.push(item.city_name);
                            $scope.selectRangeObj.push({ province: item.p_name, city: item.city_name });
                        } else {
                            if ($scope.selectedList) {
                                var index = $scope.selectedList.indexOf(item.city_name);
                                $scope.selectedList.splice(index, 1);
                                for (var i = 0; i < $scope.selectRangeObj.length; i++) {
                                    if ($scope.selectRangeObj[i].province == item.p_name && $scope.selectRangeObj[i].city == item.city_name) {
                                        $scope.selectRangeObj.splice(i, 1);
                                    }
                                };
                            }
                        }
                    };
                    // console.log($scope.selectedList, $scope.selectRangeObj);
                }
            };

            //所属地区 城市列表引入ngtree
            $scope.areaTree = [];
            $scope.areaTreeOptions = {
                itemExpendedLevel: function() {},
                textField: 'city_name',
                childrenField: 'citys',
                rootParentLevel: 1,
                isExpendAll: true,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.areaTreeItem = $item;
                    //选中某一城市 隐藏弹出框
                    function selectArea(city_name, p_name, type) {
                        var event = event || window.event;
                        event.stopPropagation();
                        if (type == 'province') {
                            return;
                            // $scope.area_province = city_name;
                            // $scope.area_city = '';
                        } else if (type == 'city') {
                            $scope.area_province = p_name;
                            $scope.area_city = city_name;
                        }
                        $scope.showAreaList = false;
                    };
                    selectArea($item.$item.city_name, $item.$item.p_name, $item.$item.type);
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                }
            };
            //添加仓库 配送范围 引入treeview
            $scope.addWarehouseRangeTree = [];
            $scope.addWarehouseRangeTreeOptions = {
                // fixedToTree: function() {},
                sourceTreeData: [],
                itemExpendedLevel: function() {},
                isExpendAll: true,
                textField: 'city_name',
                childrenField: 'citys',
                rootParentLevel: 1,
                initItemExpendedLevel: 1,
                canChecked: true,
                isLeafIconClass: 'mar-left', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.addWarehouseRangeTreeItem = $item;
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                    //选择添加仓库的配送范围
                    var item = $item.$item;
                    if (item.type == 'province') {
                        checkProvince(item);
                    } else if (item.type == 'city') {
                        checkCity(item);
                    }

                    function checkProvince(item) {
                        if (item.isChecked) {
                            var citys = item.citys;
                            for (var i = 0; i < citys.length; i++) {
                                citys[i].isChecked = true;
                                $scope.addWarehouseRange.push({ province: item.city_name, city: citys[i].city_name });
                            };
                        } else {
                            if ($scope.addWarehouseRange) {
                                var citys = item.citys;
                                for (var i = 0; i < citys.length; i++) {
                                    citys[i].isChecked = false;
                                    for (var j = 0; j < $scope.addWarehouseRange.length; j++) {
                                        if ($scope.addWarehouseRange[j].province == citys[i].p_name && $scope.addWarehouseRange[j].city == citys[i].city_name) {
                                            $scope.addWarehouseRange.splice(j, 1);
                                        }
                                    };
                                };
                            }
                        }
                    };

                    function checkCity(item) {
                        if (item.isChecked) {
                            $scope.addWarehouseRange.push({ province: item.p_name, city: item.city_name });
                        } else {
                            if ($scope.addWarehouseRange) {
                                for (var i = 0; i < $scope.addWarehouseRange.length; i++) {
                                    if ($scope.addWarehouseRange[i].province == item.p_name && $scope.addWarehouseRange[i].city == item.city_name) {
                                        $scope.addWarehouseRange.splice(i, 1);
                                    }
                                };
                            }
                        }
                    };
                }
            };
            //添加仓库所属地区 treeview
            $scope.addWarehouseAreaTree = [];
            $scope.addWarehouseAreaTreeOptions = {
                // fixedToTree: function() {},
                sourceTreeData: [],
                itemExpendedLevel: function() {},
                isExpendAll: true,
                textField: 'city_name',
                childrenField: 'citys',
                rootParentLevel: 1,
                initItemExpendedLevel: 1,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.addWarehouseAreaTreeItem = $item;
                    //选中某一城市 隐藏弹出框
                    function selectArea(city_name, p_name, type) {
                        var event = event || window.event;
                        event.stopPropagation();
                        if (type == 'province') {
                            return;
                            /*$scope.addWarehouseAreaProvince = city_name;
                            $scope.addWarehouseAreaCity = '';*/
                        } else if (type == 'city') {
                            $scope.addWarehouseAreaProvince = p_name;
                            $scope.addWarehouseAreaCity = city_name;
                        }
                        $scope.addWarehouseModalScope.address_data.province = $scope.addWarehouseAreaProvince;
                        $scope.addWarehouseModalScope.address_data.city = $scope.addWarehouseAreaCity;
                        $scope.editWarehouseModalScope.address_data.province = $scope.addWarehouseAreaProvince;
                        $scope.editWarehouseModalScope.address_data.city = $scope.addWarehouseAreaCity;
                        // console.log('$scope.addWarehouseArea', $scope.addWarehouseAreaProvince, $scope.addWarehouseAreaCity);
                        $scope.addWarehouseModalScope.showAddWarehouseAreaBox = false;
                        $scope.editWarehouseModalScope.showAddWarehouseAreaBox = false;
                    };
                    selectArea($item.$item.city_name, $item.$item.p_name, $item.$item.type);
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                }
            };

            var fixArray = function(s_array, key_array) {
                var len = s_array.length;
                var keyArrayLen = key_array.length;
                for (var j = 0; j < keyArrayLen; j++) {
                    var key = key_array[j];
                    for (var i = 0; i < len; i++) {
                        if (s_array[i][key]) {
                            s_array[i].level = j;
                            fixArray(s_array[i][key], key_array);
                        }
                    }
                }
                return s_array;
            };

            //获取所有城市列表
            WarehouseServices.getAllCityList().then(function(data) {
                $scope.allCityList = data;
                var key_array = ['citys', 'areas'];
                data = fixArray(data, key_array);
                $scope.addWarehouseModalScope.addWarehouseCitys = data;
                /*$scope.viewWarehouseModalScope.addWarehouseCitys = data;*/
                $scope.editWarehouseModalScope.addWarehouseCitys = data;
                $scope.addWarehouseRangeTreeOptions.sourceTreeData = angular.copy(data);
                $scope.addWarehouseAreaTreeOptions.sourceTreeData = angular.copy(data);
                $scope.addWarehouseRangeTree = data;
                $scope.cityTreeOptions.fixedToTree(angular.copy(data), $scope.cityTree);
                $scope.cityTreeOptions.itemExpendedLevel($scope.cityTree, 0);
                $scope.areaTreeOptions.fixedToTree(angular.copy(data), $scope.areaTree);
                $scope.areaTreeOptions.itemExpendedLevel($scope.areaTree, 0);
            });

            //确认并显示配送范围 隐藏配送列表框
            $scope.confirmRange = function() {
                $scope.range = $scope.selectedList;
                $scope.range_data = $scope.selectRangeObj;
                $scope.showRangeList = false;
               // console.log('range', $scope.range);
            };
            $scope.clearRange = function() {
                $scope.range = [];
                $scope.range_data = [];
                $scope.selectedList = [];
                $scope.selectRangeObj = [];
                for (var i = 0; i < $scope.selectRangeItem.length; i++) {
                    $scope.selectRangeItem[i].isChecked = false;
                    if ($scope.selectRangeItem[i].citys) {
                        for (var j = 0; j < $scope.selectRangeItem[i].citys.length; j++) {
                            $scope.selectRangeItem[i].citys[j].isChecked = false;
                        };
                    }
                };
                $scope.selectRangeItem = [];
                $scope.showRangeList = false;
            };

            //显示城市列表弹出框
            $scope.showRangeListBox = function(event) {
                event = event || window.event;
                event.stopPropagation();
                $scope.showRangeList = !$scope.showRangeList;
            };
            $scope.showAreaListBox = function(event) {
                event = event || window.event;
                event.stopPropagation();
                $scope.showAreaList = !$scope.showAreaList;
            };
            $scope.clearArea = function() {
                $scope.area_province = null;
                $scope.area_city = null;
                $scope.showAreaList = false;
            };
            //点击空白隐藏
            $document.bind('click', function() {
                $scope.showAreaList = false;
                $scope.showRangeList = false;
                $scope.editWarehouseModalScope.showAddWarehouseAreaBox = false;
                $scope.addWarehouseModalScope.showAddWarehouseAreaBox = false;
                $scope.$apply();
            });
            //弹出框阻止冒泡
            $scope.stop = function(event) {
                event = event || window.event;
                event.stopPropagation(); //阻止向下冒泡
            };

            //获取仓库列表
            /*
             "ranges_data": [
                {
                  "province": "浙江",
                  "city": "嘉兴"
                },
                {
                  "province": "浙江",
                  "city": "杭州"
                }
              ]
            */
            $scope.ranges_data = [];
            $scope.getWarehouseList = function() {
                WarehouseServices.getWarehouseList($scope.pageIndex, $scope.pageSize, $scope.keyword, $scope.warehouse_status, $scope.range_data, $scope.area_province, $scope.area_city).then(function(data) {
                    $scope.warehouseList = data.list;
                    $scope.warehouseCount = data.count;
                    //页码显示的方块
                    $scope.maxSize = 5;
                    $scope.bigTotalItems = $scope.warehouseCount;
                });
            };
            $scope.getWarehouseList();

            //翻页
            $scope.setPage = function() {
                $scope.pageIndex = $scope.bigCurrentPage;
                $scope.pageIndex = $scope.pageSize * ($scope.pageIndex - 1);
                $scope.getWarehouseList();
            };

            $scope.addWarehouseModalScope = {
                addWarehouseRangeTree: $scope.addWarehouseRangeTree,
                addWarehouseRangeTreeOptions: $scope.addWarehouseRangeTreeOptions,
                addWarehouseRangeTreeTtem: $scope.addWarehouseRangeTreeItem,
                addWarehouseAreaTree: $scope.addWarehouseAreaTree,
                addWarehouseAreaTreeOptions: $scope.addWarehouseAreaTreeOptions,
                addWarehouseAreaTreeItem: $scope.addWarehouseAreaTreeItem,
                warehouse_number: $scope.warehouse_number,
                warehouse_name: $scope.warehouse_name,
                head_uuid: $scope.head_uuid,
                warehouse_phone: $scope.warehouse_phone,
                is_default: $scope.is_default,
                address_data: {},
                range_data: [],
                confirm: true,
                setShowBox: function(event) {
                    event = event || window.event;
                    event.stopPropagation();
                    $scope.addWarehouseModalScope.showAddWarehouseAreaBox = !$scope.addWarehouseModalScope.showAddWarehouseAreaBox;
                },
                clearArea: function() {
                    $scope.addWarehouseModalScope.address_data.province = '';
                    $scope.addWarehouseModalScope.address_data.city = '';
                    $scope.addWarehouseModalScope.showAddWarehouseAreaBox = false;
                },
                stop: function(event) {
                    event = event || window.event;
                    event.stopPropagation();
                },
                inputHeader: function(header) {
                    OrgServices.getUserList(header, 0, 10000000).then(function(data) {
                        $scope.userList = data.list;
                        $scope.addWarehouseModalScope.userList = data.list;
                        $scope.addWarehouseModalScope.showUserListBox = true;
                    });
                },
                setHeader: function(uuid, name, mobile) {
                    $scope.addWarehouseModalScope.head_uuid = uuid;
                    if (!name || name == '') {
                        $scope.addWarehouseModalScope.warehouse_header = mobile;
                    } else {
                        $scope.addWarehouseModalScope.warehouse_header = name;
                    }
                    $scope.addWarehouseModalScope.showUserListBox = false;
                }
            };
            $scope.viewWarehouseModalScope = {
                pageName: 'view',
                pageView: 'view',
                /*addWarehouseRangeTree: $scope.addWarehouseRangeTree,
                addWarehouseRangeTreeOptions: $scope.addWarehouseRangeTreeOptions,
                addWarehouseRangeTreeTtem: $scope.addWarehouseRangeTreeItem,
                addWarehouseAreaTree: $scope.addWarehouseAreaTree,
                addWarehouseAreaTreeOptions: $scope.addWarehouseAreaTreeOptions,
                addWarehouseAreaTreeItem: $scope.addWarehouseAreaTreeItem,*/
                warehouse_number: $scope.warehouse_number,
                warehouse_name: $scope.warehouse_name,
                head_uuid: $scope.head_uuid,
                warehouse_phone: $scope.warehouse_phone,
                is_default: $scope.is_default,
                address_data: {},
                range_data: [],
                setShowBox: function() {}
            };
            $scope.editWarehouseModalScope = {
                addWarehouseRangeTree: $scope.addWarehouseRangeTree,
                addWarehouseRangeTreeOptions: $scope.addWarehouseRangeTreeOptions,
                addWarehouseRangeTreeTtem: $scope.addWarehouseRangeTreeItem,
                addWarehouseAreaTree: $scope.addWarehouseAreaTree,
                addWarehouseAreaTreeOptions: $scope.addWarehouseAreaTreeOptions,
                addWarehouseAreaTreeItem: $scope.addWarehouseAreaTreeItem,
                warehouse_detail: $scope.warehouseDetail,
                warehouse_number: $scope.warehouse_number,
                warehouse_name: $scope.warehouse_name,
                //head_uuid: $scope.head_uuid,
                warehouse_phone: $scope.warehouse_phone,
                is_default: $scope.is_default,
                address_data: {},
                range_data: [],
                confirm: true,
                setShowBox: function(event) {
                    event = event || window.event;
                    event.stopPropagation();
                    $scope.editWarehouseModalScope.showAddWarehouseAreaBox = !$scope.editWarehouseModalScope.showAddWarehouseAreaBox;
                },
                clearArea: function() {
                    $scope.editWarehouseModalScope.address_data.province = '';
                    $scope.editWarehouseModalScope.address_data.city = '';
                    $scope.editWarehouseModalScope.showAddWarehouseAreaBox = false;
                },
                stop: function(event) {
                    event = event || window.event;
                    event.stopPropagation();
                },
                inputHeader: function(header) {
                    OrgServices.getUserList(header, 0, 10000000).then(function(data) {
                        $scope.userList = data.list;
                        $scope.editWarehouseModalScope.userList = data.list;
                        $scope.editWarehouseModalScope.showUserListBox = true;
                    });
                },
                setHeader: function(uuid, name, mobile) {
                    $scope.editWarehouseModalScope.head_uuid = uuid;
                    if (!name || name == '') {
                        $scope.editWarehouseModalScope.warehouse_header = mobile;
                    } else {
                        $scope.editWarehouseModalScope.warehouse_header = name;
                    }
                    $scope.editWarehouseModalScope.showUserListBox = false;
                }
            };

            //模态框
            //添加仓库
            $scope.addWarehouse = function() {
                //初始化数据
                //清空上次选中状态
                var item = $scope.addWarehouseModalScope.addWarehouseRangeTree;
                for (var i = 0; i < item.length; i++) {
                    item[i].isChecked = false;
                    for (var j = 0; j < item[i].citys.length; j++) {
                        item[i].citys[j].isChecked = false;
                    };
                };
                $scope.addWarehouseModalScope.showAddWarehouseAreaBox = false;
                $scope.addWarehouseModalScope.addWarehouseRangeTree = [];
                $scope.addWarehouseModalScope.addWarehouseAreaTree = [];
                $scope.addWarehouseRange = [];
                $scope.addWarehouseModalScope.warehouse_name = '';
                $scope.addWarehouseModalScope.address_data.province = '';
                $scope.addWarehouseModalScope.address_data.city = '';
                $scope.addWarehouseModalScope.address_data.detail = '';
                $scope.addWarehouseModalScope.warehouse_header = '';
                $scope.addWarehouseModalScope.warehouse_phone = '';
                $scope.addWarehouseModalScope.is_default = false;
                $scope.addWarehouseModalScope.head_uuid = '';
                $scope.addWarehouseModalScope.warehouse_header = '';
                $scope.addWarehouseModalScope.showUserListBox = false;
                $scope.addWarehouseModalScope.addWarehouseRangeTreeOptions.sourceTreeData = angular.copy($scope.allCityList);
                $scope.addWarehouseModalScope.addWarehouseAreaTreeOptions.sourceTreeData = angular.copy($scope.allCityList);

                //获取仓库编码
                var type = 1; //1仓库编号2入库单编号
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '添加仓库';
                        },
                        contents: {
                            scope: $scope.addWarehouseModalScope,
                            templateurl: './views/inventorymanage/addwarehousemodal.html'
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    var is_default;
                                    if ($scope.addWarehouseModalScope.is_default == true) {
                                        is_default = 1;
                                    } else {
                                        is_default = 2;
                                    }
                                    $scope.addWarehouseModalScope.range_data = $scope.addWarehouseRange;
                                    WarehouseServices.addWarehouses($scope.addWarehouseModalScope.warehouse_number, $scope.addWarehouseModalScope.warehouse_name,
                                        $scope.addWarehouseModalScope.address_data, $scope.addWarehouseModalScope.head_uuid, $scope.addWarehouseModalScope.warehouse_phone,
                                        is_default, $scope.addWarehouseModalScope.range_data).then(function(data) {
                                        growl.addSuccessMessage('添加成功');
                                        $scope.getWarehouseList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    }, function(data) {
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        },
                    }
                });
                WarehouseServices.getWarehouseNumber(type).then(function(data) {
                    $scope.addWarehouseModalScope.warehouse_number = data.number;
                });
            };
            //查看仓库时 获取仓库详情
            var viewWarehouseDetail = function(warehouse_id) {
                WarehouseServices.getWarehouseDetail(warehouse_id).then(function(data) {
                    $scope.warehouseDetail = data;
                    //显示仓库信息
                    $scope.viewWarehouseModalScope.warehouse_name = data.name;
                    $scope.viewWarehouseModalScope.warehouse_number = data.warehouse_number;
                    $scope.viewWarehouseModalScope.warehouse_phone = data.warehouse_phone;
                    $scope.viewWarehouseModalScope.address_data.province = data.address.province;
                    $scope.viewWarehouseModalScope.address_data.city = data.address.city;
                    $scope.viewWarehouseModalScope.address_data.detail = data.address.detail;
                    if (!data.user.name || data.user.name == '') {
                        $scope.viewWarehouseModalScope.warehouse_header = data.user.mobile;
                    } else {
                        $scope.viewWarehouseModalScope.warehouse_header = data.user.name;
                    }
                    if (data.is_default == 1) {
                        $scope.viewWarehouseModalScope.is_default = true;
                    } else if (data.is_default == 2) {
                        $scope.viewWarehouseModalScope.is_default = false;
                    }
                    var ranges = data.ranges;
                    var range_text = [];
                    for (var i = 0; i < ranges.length; i++) {
                        range_text.push(ranges[i].province + '省' + ranges[i].city + '市');
                    };
                    $scope.viewWarehouseModalScope.range_data = range_text;
                    /*$scope.viewWarehouseRange = data.ranges;
                    var item = $scope.viewWarehouseModalScope.addWarehouseRangeTree;
                    for (var i = 0; i < item.length; i++) {
                        for (var j = 0; j < $scope.viewWarehouseRange.length; j++) {
                            if (item[i].city_name == $scope.viewWarehouseRange[j].province) {
                                item[i].isChecked = true;
                                for (var k = 0; k < item[i].citys.length; k++) {
                                    if (item[i].citys[k].city_name == $scope.viewWarehouseRange[j].city) {
                                        item[i].citys[k].isChecked = true;
                                    }
                                };
                            }
                        };
                    };*/
                });
            };
            //查看仓库
            $scope.views = function(warehouse_id) {
                /*$scope.viewWarehouseModalScope.addWarehouseRangeTree = [];
                $scope.viewWarehouseModalScope.addWarehouseAreaTree = [];*/
                $scope.viewWarehouseModalScope.warehouse_name = '';
                $scope.viewWarehouseModalScope.warehouse_number = '';
                $scope.viewWarehouseModalScope.warehouse_phone = '';
                $scope.viewWarehouseModalScope.address_data.province = '';
                $scope.viewWarehouseModalScope.address_data.city = '';
                $scope.viewWarehouseModalScope.address_data.detail = '';
                $scope.viewWarehouseModalScope.warehouse_header = '';
                $scope.viewWarehouseModalScope.range_data = '';
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '查看仓库';
                        },
                        contents: {
                            scope: $scope.viewWarehouseModalScope,
                            templateurl: './views/inventorymanage/viewwarehousemodal.html'
                        },
                        footer: function() {}
                    }
                });
                viewWarehouseDetail(warehouse_id);
            };
            //编辑
            /*
                "address_data": {
                    "address_id": "string",
                    "province": "string",
                    "city": "string",
                    "district": "string",
                    "detail": "string",
                    "post": "string",
                    "name": "string",
                    "phone": "string"
                  },
                "range_data": [
                    {
                      "province": "浙江",
                      "city": "嘉兴"
                    }
                ]
            */
            //编辑仓库时 获取仓库详情
            var editWarehouseDetail = function(warehouse_id) {
                WarehouseServices.getWarehouseDetail(warehouse_id).then(function(data) {
                    $scope.warehouseDetail = data;
                    $scope.editWarehouseModalScope.warehouse_detail = data;
                    //显示仓库信息
                    $scope.editWarehouseModalScope.warehouse_name = data.name;
                    $scope.editWarehouseModalScope.warehouse_number = data.warehouse_number;
                    $scope.editWarehouseModalScope.warehouse_phone = data.warehouse_phone;
                    $scope.editWarehouseModalScope.address_data.address_id = data.address.address_id;
                    $scope.editWarehouseModalScope.address_data.province = data.address.province;
                    $scope.editWarehouseModalScope.address_data.city = data.address.city;
                    $scope.editWarehouseModalScope.address_data.detail = data.address.detail;
                    if (!data.user.name || data.user.name == '') {
                        $scope.editWarehouseModalScope.warehouse_header = data.user.mobile;
                    } else {
                        $scope.editWarehouseModalScope.warehouse_header = data.user.name;
                    }
                    $scope.editWarehouseModalScope.head_uuid = data.user.uuid;
                    if (data.is_default == 1) {
                        $scope.editWarehouseModalScope.is_default = true;
                    } else if (data.is_default == 2) {
                        $scope.editWarehouseModalScope.is_default = false;
                    };
                    $scope.addWarehouseRange = data.ranges;
                    $scope.editWarehouseRange = data.ranges;
                    var item = $scope.editWarehouseModalScope.addWarehouseRangeTree;
                    for (var i = 0; i < item.length; i++) {
                        for (var j = 0; j < $scope.editWarehouseRange.length; j++) {
                            if (item[i].city_name == $scope.editWarehouseRange[j].province) {
                                for (var k = 0; k < item[i].citys.length; k++) {
                                    if (item[i].citys[k].city_name == $scope.editWarehouseRange[j].city) {
                                        item[i].isChecked = true;
                                        item[i].citys[k].isChecked = true;
                                    }
                                };
                            }
                        };
                    };
                })
            };
            $scope.edit = function(warehouse_id) {
                //清空上次选中状态
                var item = $scope.editWarehouseModalScope.addWarehouseRangeTree;
                for (var i = 0; i < item.length; i++) {
                    item[i].isChecked = false;
                    for (var j = 0; j < item[i].citys.length; j++) {
                        item[i].citys[j].isChecked = false;
                    };
                };
                $scope.editWarehouseModalScope.showAddWarehouseAreaBox = false;
                $scope.editWarehouseModalScope.showUserListBox = false;
                $scope.editWarehouseModalScope.addWarehouseRangeTree = [];
                $scope.editWarehouseModalScope.addWarehouseAreaTree = [];
                $scope.editWarehouseModalScope.addWarehouseRangeTreeOptions.sourceTreeData = angular.copy($scope.allCityList);
                $scope.editWarehouseModalScope.addWarehouseAreaTreeOptions.sourceTreeData = angular.copy($scope.allCityList);
                $scope.addWarehouseRange = [];
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '编辑仓库';
                        },
                        contents: {
                            scope: $scope.editWarehouseModalScope,
                            templateurl: './views/inventorymanage/addwarehousemodal.html'
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    var is_default;
                                    if ($scope.editWarehouseModalScope.is_default == true) {
                                        is_default = 1;
                                    } else {
                                        is_default = 2;
                                    };
                                    $scope.editWarehouseModalScope.range_data = $scope.addWarehouseRange;
                                    WarehouseServices.editWarehouse(warehouse_id, $scope.editWarehouseModalScope.warehouse_number, $scope.editWarehouseModalScope.warehouse_name,
                                        $scope.editWarehouseModalScope.address_data, $scope.editWarehouseModalScope.head_uuid, $scope.editWarehouseModalScope.warehouse_phone,
                                        is_default, $scope.editWarehouseModalScope.range_data).then(function(data) {
                                        growl.addSuccessMessage('编辑成功');
                                        $scope.getWarehouseList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    }, function(data) {
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        },
                    }
                });
                editWarehouseDetail(warehouse_id);
            };
            //删除
            $scope.delete = function(warehouse_id) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '删除仓库';
                        },
                        contents: {
                            scope: {
                                pageStatus: 'delete',
                                confirm: true,
                            },
                            templateurl: './views/inventorymanage/operationwarehouse.html'
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    WarehouseServices.deleteWarehouse(warehouse_id).then(function(data) {
                                        growl.addSuccessMessage('删除成功');
                                        $scope.getWarehouseList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    }, function(data) {
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    });
                                },
                            }
                        }
                    }
                })
            };
            //启用
            $scope.enable = function(warehouse_id, warehouse_status) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '确认信息';
                        },
                        contents: {
                            scope: {
                                pageStatus: 'enable',
                                confirm: true,
                            },
                            templateurl: './views/inventorymanage/operationwarehouse.html'
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    WarehouseServices.warehouseStatus(warehouse_id, warehouse_status).then(function(data) {
                                        growl.addSuccessMessage('修改成功');
                                        $scope.getWarehouseList();
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
            //禁用
            $scope.disable = function(warehouse_id, warehouse_status) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '确认信息';
                        },
                        contents: {
                            scope: {
                                pageStatus: 'disable',
                                confirm: true,
                            },
                            templateurl: './views/inventorymanage/operationwarehouse.html'
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    WarehouseServices.warehouseStatus(warehouse_id, warehouse_status).then(function(data) {
                                        growl.addSuccessMessage('修改成功');
                                        $scope.getWarehouseList();
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
