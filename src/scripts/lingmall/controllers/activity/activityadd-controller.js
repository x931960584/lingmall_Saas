define(['../controllers'], function(controllers) {
    controllers.controller('ActivityaddCtrl', ['$scope', '$cookieStore', 'ActivityListServices', 'GoodsclassifyService', 'GoodsbrandService', 'MyGoodsServices', '$location', '$state', '$uibModal', '$injector', '$stateParams', 'growl', '$document', function($scope, $cookieStore, ActivityListServices, GoodsclassifyService, GoodsbrandService, MyGoodsServices, $location, $state, $uibModal, $injector, $stateParams, growl, $document) {

        $scope.dataSku = '';
        var access_token = $cookieStore.get('access_token');
        $scope.company_id = $cookieStore.get('company_id');
        $scope.monShow = false;
        $scope.luggageShow = false;
        $scope.boxShow = false;
        $scope.catname = "";
        $scope.operationcategoryname = "选择分类"
        $scope.brandName = "全部品牌";
        var tt = [];
        var dd = [];
        var spu = [];
        var temporary = [];
        $scope.online_Statue = 2;
        $scope.online = $scope.online_Statue;
        $scope.dateFormat = 'yyyy-mm-dd hh:ii:00';
        $scope.startTimePlaceholder = "开始时间";
        $scope.endTimePlaceholder = "结束时间";
        var ty = false;
        $document.bind('click', function() {
            ty = false;
            $scope.operDropDown = false;
            $scope.operDroper = function(id) {
                return ty;
            };
            $scope.cateDropDown = false;
            $scope.$apply()
        })
        var comFun = function() {
            $scope.stopPro = function(e) {
                e.stopPropagation();
            }
            var key, brand_id, status, category_id;
            $scope.category_id = "";
            var limit = 6;
            var offset = 0;
            var brandlist = function() {
                var page = '0';
                var num = '100';
                GoodsbrandService.brandList(access_token, page, num).then(function(data) {

                    $scope.bList = data.data.list;
                }, function(data) {

                })
            }
            brandlist();
            //品牌下拉
            $scope.searchBrand = function(id, name) {
                offset = 0;
                $scope.brandName = name;
                $scope.brandId = id;
                key = $scope.keyword;
                brand_id = $scope.brandId;
                category_id = $scope.categoryId
                //goodList();
            }
            $scope.searchPro = function() {
                offset = 0;
                key = $scope.keyword;
                brand_id = $scope.brandId;
                category_id = $scope.categoryId;
                goodList();
            }
            $scope.searchClassify = function(category_name, category_id) {
                $scope.categoryId = category_id;
                $scope.categoryName = category_name;
                key = $scope.keyword;
                brand_id = $scope.brandId;
                $scope.category_id = $scope.categoryId;
                offset = 0;
                //goodList();
            }
            var goodList = function() {
                status = 1;
                ActivityListServices.goodsList(key, brand_id, category_id, status, offset, limit).then(function(data) {
                    $scope.mygoodsList = data.list;
                    $scope.sheLves = [
                        { 'shelvesname': '上架' },
                        { 'shelvesname': '下架' }
                    ]

                    $scope.bigTotalItems = data.count;
                    var goodsImgId = [];
                    for (var i = 0; i < $scope.mygoodsList.length; i++) {
                        for (var u = 0; u < $scope.mygoodsList[i].skus.length; u++) {
                            goodsImgId.push($scope.mygoodsList[i].skus[u].img_sku_id);
                        }
                    };
                    if (goodsImgId.length > 0) {
                        $scope.ImgUrl(goodsImgId);
                    }

                }, function(data) {

                })
            };
            //goodList();




            //图片缩略图
            //获取图片信息
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
            $scope.ImgUrl = function(imgIdList) {
                var imgIdList = imgIdList;
                var imgNum = [];
                var imgmoreNum = [];


                MyGoodsServices.getThumbnailList(imgIdList).then(function(data) {
                    $scope.imgList = data;
                    for (var i = 0; i < $scope.imgList.length; i++) {
                        imgNum.push($scope.imgList[i].bundle_number);
                    };
                    for (var i = 0; i < imgIdList.length; i++) {
                        if (imgNum.indexOf(imgIdList[i]) == -1) {
                            imgmoreNum.push(imgIdList[i]);
                        }
                    };
                    for (var i = 0; i < imgmoreNum.length; i++) {
                        var imgbuList = { bundle_number: '', domain: 'assets/images', key: 'none.png' }
                        imgbuList.bundle_number = imgmoreNum[i];
                        $scope.imgList.push(imgbuList);
                    };

                })
            };

            //供应商分类下拉封装

            $scope.tree = [];
            $scope.treeOptions = {
                textField: 'supplier_category_name',
                childrenField: 'childs',
                rootParentLevel: 1,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.selectedItem = $item;
                    if ($scope.selectedItem.$item == '' || $scope.selectedItem.$item == null) {
                        $scope.categoryId = '';
                        $scope.categoryName = '全部分类';
                    } else {
                        $scope.categoryId = $scope.selectedItem.$item.supplier_category_id;
                        $scope.categoryName = $scope.selectedItem.$item.supplier_category_name;
                    }

                    key = $scope.keyword;
                    brand_id = $scope.brandId;
                    $scope.category_id = $scope.categoryId;
                    category_id = $scope.categoryId;
                    $scope.cateDropDown = false;
                   // goodList();
                },
                itemCheckedChanged: function($item) {
                    console.log($item, 'item checked');
                }
            };



            //获取供应商分类
            $scope.getCategory = function() {
                MyGoodsServices.getCategorys($scope.company_id).then(function(data) {
                    $scope.treeOptions.fixedToTree(data.list, $scope.tree);
                    $scope.treeOptions.itemExpendedLevel($scope.tree, 3);
                    // $scope.categorysData = data.list;
                    // var data = data.list;
                    // //循环遍历分类
                    // $scope.categorysList = [];

                    // function push(data) {
                    //     for (var i = 0; i < data.length; i++) {
                    //         if (!data[i].childs) {
                    //             $scope.categorysList.push({ supplier_category_name: data[i].supplier_category_name, supplier_category_id: data[i].supplier_category_id })
                    //         } else {
                    //             push(data[i].childs)
                    //         }
                    //     }
                    // }
                    // push(data);
                });
            };
            $scope.getCategory();
            $scope.catedrop = function(e) {
                    e.stopPropagation();
                    $scope.cateDropDown = !$scope.cateDropDown
                    $scope.selectAllShow = true;
                    $scope.selectAllText = '全部分类';
                }
                //商品列表复选框选择
            $scope.setPage = function() {
                offset = ($scope.bigCurrentPage - 1) * limit;
                goodList();
                for (var i = 0; i < temporary.length; i++) {
                    arrsku.push(temporary[i].sku_id);
                };
                $scope.checkbox = function(id) {
                    for (var i = 0; i < arrsku.length; i++) {
                        if (arrsku[i] == id) {
                            return true;
                        }
                    }
                }
                $scope.disabled = function(id) {
                    for (var i = 0; i < arrsku.length; i++) {

                        if (arrsku[i] == id) {
                            return true;
                        }
                    }
                }
            }
            $scope.skuCheck = function(k, keyword, $event) {
                var keyword = keyword;
                var obj = {
                    groupon_sku_id: '',
                    sku_id: '',
                    operation_category_id: '',
                    groupon_count: '',
                    groupon_price: '',
                    min_order_count: 1,
                    recommend: '',
                    fares: [
                        { start_count: '', price: '' },
                    ],
                    list: {
                        sku_code: '',
                        img_sku_id: '',
                        barcode: '',
                        sku_name: '',
                        specification: '',
                        operation_category_name: '选择分类',
                        spu_id: '',
                        sold_count: '0',
                        key_word: '',
                        spu_name: '',
                        p_id: ''
                    }
                }
                var checkbox = $event.target;
                if (checkbox.checked && tt.indexOf(k) == -1) {
                    obj.sku_id = k.sku_id;
                    obj.groupon_price = k.groupon_price;
                    obj.list.sku_code = k.sku_code;
                    obj.list.img_sku_id = k.img_sku_id;
                    obj.list.barcode = k.barcode;
                    obj.list.sku_name = k.sku_name;
                    obj.list.specification = k.specification;
                    obj.list.spu_id = k.spu_id;
                    obj.list.spu_name = k.spu_name;
                    obj.list.key_word = keyword;
                    tt.push(k);
                    temporary.push(obj);
                };
                if (!checkbox.checked && tt.indexOf(k) != -1) {
                    var tindex = tt.indexOf(k);
                    tt.splice(tindex, 1);
                    temporary.splice(tindex, 1);
                }
            }
            var arrsku = [];
            $scope.model = function() {
                $scope.operDropDown = false;
                $scope.monShow = true;
                $scope.boxShow = true;
                offset = 0;
                $scope.bigCurrentPage = 1;
                $scope.mygoodsList='';
                goodList();
                for (var i = 0; i < dd.length; i++) {
                    arrsku.push(dd[i].sku_id);
                };
                $scope.checkbox = function(id) {
                    for (var i = 0; i < arrsku.length; i++) {
                        if (arrsku[i] == id) {
                            return true;
                        }
                    }
                }
                $scope.disabled = function(id) {
                    for (var i = 0; i < arrsku.length; i++) {

                        if (arrsku[i] == id) {
                            return true;
                        }
                    }
                }

            };
            $scope.ok = function() {
                $scope.cateDropDown = false;
                $scope.monShow = false;
                $scope.boxShow = false;

                for (var i = 0; i < temporary.length; i++) {
                    dd.push(temporary[i]);
                };
                $scope.dataSku = dd;
                tt = [];
                temporary = [];
                arrsku = [];
                $scope.SkuNum = $scope.dataSku.length;
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    if (spu.indexOf($scope.dataSku[i].list.spu_id) == -1) {
                        spu.push($scope.dataSku[i].list.spu_id);
                    }
                };
                $scope.SpuNum = spu.length;
                var imgId = [];
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    imgId.push($scope.dataSku[i].list.img_sku_id);
                };
                if (imgId.length > 0) {
                    $scope.getImgUrl(imgId);
                }

            };
            $scope.cancel = function() {
                $scope.monShow = false;
                $scope.boxShow = false;
                $scope.cateDropDown = false;
                temporary = [];
                tt = [];
                arrsku = [];
                $scope.dataSku = dd;
                $scope.SkuNum = '';
                $scope.SpuNum = '';
            }

            //批量删除
            var numbers = [];
            $scope.AllCheck = function($event) {
                var AllCheck = $event.target;
                if (AllCheck.checked) {
                    $scope.chBox = true;
                    for (var i = 0; i < dd.length; i++) {
                        numbers.push(dd[i].sku_id)
                    };
                } else {
                    $scope.chBox = false;
                    numbers = [];
                }
            }
            $scope.OneCheck = function($event, id) {
                var OneCheck = $event.target;
                if (OneCheck.checked) {
                    numbers.push(id);
                } else {
                    var index = numbers.indexOf(id);
                    numbers.splice(index, 1)
                }
            }
            $scope.numBer = function() {
                for (var j = 0; j < numbers.length; j++) {
                    for (var i = 0; i < dd.length; i++) {
                        if (dd[i].sku_id == numbers[j]) {
                            dd.splice(i, 1)
                        }
                    }
                }
                $scope.allTrue = false;
            }


            //运营分类封装

            $scope.operTreeOptions = {
                fixedToTree: function() {},
                itemExpendedLevel: function() {},
                textField: 'operation_category_name',
                childrenField: 'childs',
                rootParentLevel: 1,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.operSelectedItem = '';
                    if ($item.$item.childs) {
                        return
                    } else {
                        var itemSku_id = $cookieStore.get('sk_id');
                        $scope.operation($item.$item.operation_category_name, $item.$item.operation_category_id, itemSku_id, $item.$item.p_id);
                        ty = !ty
                        $scope.operDroper = function(u_id) {
                            return ty;
                        }
                    }

                },
                itemCheckedChanged: function($item) {
                    console.log($item, 'item checked');
                }
            };



            //运营分类
            var operation = function() {
                ActivityListServices.operationList().then(function(data) {

                    $scope.operTreeOptions.fixedToTree(data, $scope.operTree);
                    $scope.operTreeOptions.itemExpendedLevel($scope.operTree, 3);
                }, function(data) {

                })
            }

            $scope.operDrop = function(id, e) {
                    $scope.operDropDown = false;
                    e.stopPropagation();
                    $scope.operTree = [];
                    operation();
                    $cookieStore.put('sk_id', id);
                    ty = !ty
                    $scope.operDroper = function(u_id) {
                        if (u_id == id) {
                            return ty;
                        }
                    }

                }
                //  编辑搜索运营分类
            $scope.groundTreeOptions = {
                fixedToTree: function() {},
                itemExpendedLevel: function() {},
                textField: 'operation_category_name',
                childrenField: 'childs',
                rootParentLevel: 1,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.groundSelectedItem = $item;
                    if ($scope.groundSelectedItem.$item == '' || $scope.groundSelectedItem.$item == null) {
                        $scope.catname = '全部拼团分类';
                        $scope.catId = '';
                    } else {
                        $scope.catname = $scope.groundSelectedItem.$item.operation_category_name;
                        $scope.catId = $scope.groundSelectedItem.$item.operation_category_id;
                    }
                    $scope.operDropDown = false;
                },
                itemCheckedChanged: function($item) {
                    console.log($item, 'item checked');
                }
            };
            $scope.groundDrop = function(event) {
                $scope.operDroper = function(id) {
                    return false;
                }
                $scope.operDropDown = !$scope.operDropDown
                var event = event || window.event;
                event.stopPropagation();
                $scope.selectAllShow = true;
                $scope.selectAllText = '全部拼团分类';
                $scope.groundTree = [];
                searOperation();


            }
            var searOperation = function() {
                ActivityListServices.operationList().then(function(data) {
                    $scope.groundTreeOptions.fixedToTree(data, $scope.groundTree);
                    $scope.groundTreeOptions.itemExpendedLevel($scope.groundTree, 3);

                }, function(data) {

                })
            }


            $scope.endTime = function() {
                $scope.openedEnd = true;
            }
            $scope.starTime = function() {
                $scope.openedStart = true;
            }

            $scope.operation = function(name, id, sku, p_id) {
                var name = name;
                if (name.length > 4) {
                    name = name.substr(0, 4) + '..';
                }
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    if ($scope.dataSku[i].sku_id == sku) {
                        $scope.dataSku[i].operation_category_id = id;
                        $scope.dataSku[i].list.operation_category_name = name;
                        $scope.dataSku[i].p_id = p_id;

                    }
                };


            };
            /*$scope.IsNum = function(event) {
                if (event.keyCode >= 48 && event.keyCode <= 57) {} else {
                    event.preventDefault();
                }
            }*/
            $scope.gCount = function(id, count, order_count) {
                if (parseInt(count) <= parseInt(order_count) || count == 0) {
                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            $scope.dataSku[i].groupon_count = '';
                        }
                    };
                }
            }
            $scope.orderCount = function(id, order_count, count) {
                if (parseInt(count) <= parseInt(order_count) || order_count == 0 || order_count == '') {
                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            $scope.dataSku[i].min_order_count = 1;
                        }
                    };
                }
            }
            $scope.groPrice = function(id, price) {
                    if (price) {
                        if (isNaN(price)) {
                            for (var i = 0; i < $scope.dataSku.length; i++) {
                                if ($scope.dataSku[i].sku_id == id) {
                                    $scope.dataSku[i].groupon_price = "";
                                }
                            }
                        } else {
                            for (var i = 0; i < $scope.dataSku.length; i++) {
                                if ($scope.dataSku[i].sku_id == id) {
                                    $scope.dataSku[i].groupon_price = parseFloat(price).toFixed(2);
                                }
                            }
                        }
                    }

                }
                /*$scope.luCount = function(count) {
                    var len = $scope.luggList.length - 1;
                    if ($scope.luggList.length > 1 && parseInt($scope.luggList[len - 1].start_count) >= parseInt(count)) {
                        $scope.luggList[len].start_count = "";
                    }
                }
                $scope.luPrice = function(price) {
                        if (price) {
                            if (isNaN(price)) {
                                $scope.luggList[$scope.luggList.length - 1].price = "";
                            } else {
                                $scope.luggList[$scope.luggList.length - 1].price = parseFloat(price).toFixed(2)
                            }
                        }


                    }*/
                //设置运费
                /*var lugg;
                $scope.lung = function(id, count) {
                    $scope.kPrice = 'a';
                    $scope.kCount = 'a';
                    $scope.monShow = true;
                    $scope.luggageShow = true
                    $scope.skuluggId = id;
                    $scope.initNum = count;
                    var obj1 = { start_count: count, price: '' };

                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            lugg = $scope.dataSku[i].fares;
                            if (lugg.length > 0 && lugg[0].start_count != "") {
                                $scope.luggList = lugg;
                                $cookieStore.put('lugGList', $scope.luggList);
                            } else {

                                lugg.splice(0, 1);
                                $scope.luggList = lugg;
                                $cookieStore.put('lugGList', $scope.luggList);
                            }

                        }
                    };
                    $scope.num = $scope.luggList.length - 1;
                }
                $scope.lugAdd = function() {
                    $scope.kPrice = 'a';
                    $scope.kCount = 'a';
                    var obj = { start_count: '', price: '' };
                    if ($scope.luggList.length > 0 && ($scope.luggList[$scope.luggList.length - 1].start_count == "" || $scope.luggList[$scope.luggList.length - 1].price == "")) return;
                    $scope.num = $scope.luggList.length;
                    obj = { start_count: '', price: '' };
                    $scope.luggList.push(obj);
                    if ($scope.luggList[0].start_count == "" || $scope.luggList[0].start_count == null) {
                        $scope.luggList[0].start_count = $scope.initNum
                    }


                }
                $scope.luggageOk = function(id) {
                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            var faresArr = $scope.dataSku[i].fares;
                            if ($scope.dataSku[i].fares.length > 0 && faresArr[faresArr.length - 1].start_count == "") {
                                //$scope.isSelected=true;
                                $scope.kCount = '';
                                return;
                            } else if ($scope.dataSku[i].fares.length > 0 && faresArr[faresArr.length - 1].price == "") {
                                $scope.kPrice = '';
                                return;
                            } else if ($scope.dataSku[i].fares.length > 0 && faresArr[0].start_count > $scope.initNum) {
                                growl.addErrorMessage('最小订货量不允许大于起订量，请重新设置运费。');

                            } else {
                                $scope.monShow = false;
                                $scope.luggageShow = false;
                            };
                        }
                    };

                }

                $scope.delLugg = function() {
                    $scope.luggList.splice($scope.luggList.length - 1, 1);
                    $scope.num = $scope.luggList.length - 1;

                }
                $scope.luggagecancel = function(id) {
                    $scope.monShow = false;
                    $scope.luggageShow = false;
                    var fAres = $cookieStore.get('lugGList');
                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            $scope.dataSku[i].fares = fAres;

                        }
                    };
                }*/
            $scope.modalNew = {
                isLugg:3,
                activityPage: 'isActivity',
                pageName:'view',
                luggList: [],
                kPrice: '',
                kCount: '',
                isSuccess: 3,
                num: '',
                lungSkuid:'',
                lugAdd: function() {
                    $scope.modalNew.kPrice = 'a';
                    $scope.modalNew.kCount = 'a';
                    var obj = { start_count: '', price: '' };
                    if ($scope.modalNew.luggList.length > 0 && ($scope.modalNew.luggList[$scope.modalNew.luggList.length - 1].start_count == "" || $scope.modalNew.luggList[$scope.modalNew.luggList.length - 1].price == "")) return;
                    $scope.modalNew.num = $scope.modalNew.luggList.length;
                    obj = { start_count: '', price: '' };
                    $scope.modalNew.luggList.push(obj);
                    if ($scope.modalNew.luggList[0].start_count == "" || $scope.modalNew.luggList[0].start_count == null) {
                        $scope.modalNew.luggList[0].start_count = $scope.initNum
                    }

                },
                IsNum: function(event) {
                    if (event.keyCode >= 48 && event.keyCode <= 57) {} else {
                        event.preventDefault();
                    }
                },
                luCount: function(count) {
                    var len = $scope.modalNew.luggList.length - 1;
                    if ($scope.modalNew.luggList.length > 1 && parseInt($scope.modalNew.luggList[len - 1].start_count) >= parseInt(count)) {
                        $scope.modalNew.luggList[len].start_count = "";
                    }
                },
                luPrice: function(price) {
                    if (price) {
                        if (isNaN(price)) {
                            $scope.modalNew.luggList[$scope.modalNew.luggList.length - 1].price = "";
                        } else {
                            $scope.modalNew.luggList[$scope.modalNew.luggList.length - 1].price = parseFloat(price).toFixed(2)
                        }
                    }


                },
                delLugg: function() {
                    $scope.modalNew.luggList.splice($scope.modalNew.luggList.length - 1, 1);
                    $scope.modalNew.num = $scope.modalNew.luggList.length - 1;

                },
                luggageOk: function(id) {
                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            var faresArr = $scope.dataSku[i].fares;
                            if ($scope.dataSku[i].fares.length > 0 && faresArr[faresArr.length - 1].start_count == "") {
                                $scope.modalNew.isSuccess = 2;
                                $scope.modalNew.kCount = '';
                                return;
                            } else if ($scope.dataSku[i].fares.length > 0 && faresArr[faresArr.length - 1].price == "") {
                                $scope.modalNew.isSuccess = 2;
                                $scope.modalNew.kPrice = '';
                                return;
                            } else if ($scope.dataSku[i].fares.length > 0 && faresArr[0].start_count > $scope.initNum) {
                                $scope.modalNew.isSuccess = 2;
                                growl.addErrorMessage('最小订货量不允许大于起订量，请重新设置运费。');

                            } else {
                                $scope.modalNew.isSuccess = 1;
                            };
                        }
                    };

                },
                luggagecancel : function() {
                    var id =$scope.modalNew.lungSkuid;
                    var fAres = $cookieStore.get('lugGList');
                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            $scope.dataSku[i].fares = fAres;
                        }
                    };

                }


            }

            //模态框设置运费
            $scope.lung = function(id, count) {
                var lungSkuid = id;
                var lugg;
                $scope.modalNew.lungSkuid=id;
                $scope.initNum = count;
                var obj1 = { start_count: count, price: '' };
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    if ($scope.dataSku[i].sku_id == id) {
                        lugg = $scope.dataSku[i].fares;
                        if (lugg.length > 0 && lugg[0].start_count != "") {
                            $scope.modalNew.luggList = lugg;
                            $cookieStore.put('lugGList', $scope.modalNew.luggList);
                        } else {

                            lugg.splice(0, 1);
                            $scope.modalNew.luggList = lugg;
                            $cookieStore.put('lugGList', $scope.modalNew.luggList);
                        }

                    }
                };
                $scope.modalNew.num = $scope.modalNew.luggList.length - 1;
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '设置运费';
                        },
                        contents: {
                            scope: $scope.modalNew,
                            templateurl: './views/activity/luggage.html'
                        },
                        footer: function() {
                            var option = {
                                config: function() {
                                    $scope.modalNew.luggageOk(lungSkuid);

                                },
                            }
                            return option;
                        }
                    }
                })
            }


            //删除
            $scope.arrdel = function(id) {
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    if ($scope.dataSku[i].sku_id == id) {
                        $scope.dataSku.splice(i, 1);
                    }
                };
                $scope.SkuNum = $scope.dataSku.length;

                var tspu = [];
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    if (tspu.indexOf($scope.dataSku[i].list.spu_id) == -1) {
                        tspu.push($scope.dataSku[i].list.spu_id);
                    }
                };

                $scope.SpuNum = tspu.length;

            }

        }

        var groupon_id = $stateParams.id;
        if (groupon_id) {
            $scope.editorShow = true;
            var arr = [];
            $scope.activityTitle = "活动编辑";

            ActivityListServices.activityDetail(groupon_id).then(function(data) {
                var today = new Date()
                var starTime = data.start_time.replace("-", "/");
                var endTime = data.end_time.replace("-", "/");
                var s1 = new Date(Date.parse(starTime));
                var e1 = new Date(Date.parse(endTime));
                if (s1 - today < 0 && e1 - today > 0) {
                    $scope.disAbled = "true";
                    angular.element('.datepicker').datetimepicker('remove');

                }
                $scope.title = data.title;
                $scope.startime = data.start_time;
                $scope.endtime = data.end_time;

                $scope.online_Statue = data.online_status;
                $scope.online = $scope.online_Statue;
                var obj = {
                    groupon_sku_id: '',
                    sku_id: '',
                    operation_category_id: '',
                    groupon_count: '',
                    groupon_price: '',
                    min_order_count: 1,
                    recommend: '',
                    fares: [
                        { start_count: '', price: '' },
                    ],
                    list: {
                        sku_code: '',
                        img_sku_id: '',
                        barcode: '',
                        sku_name: '',
                        specification: '',
                        operation_category_name: '',
                        spu_id: '',
                        sold_count: '',
                        key_word: '',
                        spu_name: '',
                        p_id: ''
                    }
                }

                for (var i = 0; i < data.groupon_skus.length; i++) {
                    arr.push(data.groupon_skus[i].sku_id);
                    var sku_fares
                    if (!data.groupon_skus[i].groupon_sku_fares[0].start_count) {
                        sku_fares = [{ start_count: '', price: '' }];
                    } else {
                        sku_fares = data.groupon_skus[i].groupon_sku_fares;
                    }
                    dd.push({
                        groupon_sku_id: data.groupon_skus[i].groupon_sku_id,
                        sku_id: data.groupon_skus[i].sku_id,
                        operation_category_id: data.groupon_skus[i].operation_category.operation_category_id,
                        groupon_count: data.groupon_skus[i].groupon_count,
                        groupon_price: data.groupon_skus[i].groupon_price,
                        min_order_count: data.groupon_skus[i].min_order_count,
                        recommend: data.groupon_skus[i].recommend,
                        fares: sku_fares,
                        list: {
                            sku_code: data.groupon_skus[i].sku.sku_code,
                            img_sku_id: data.groupon_skus[i].sku.img_sku_id,
                            barcode: data.groupon_skus[i].sku.barcode,
                            sku_name: data.groupon_skus[i].sku.sku_name,
                            specification: data.groupon_skus[i].sku.specification,
                            operation_category_name: data.groupon_skus[i].operation_category.operation_category_name,
                            operation_category_id: data.groupon_skus[i].operation_category.operation_category_id,
                            spu_id: data.groupon_skus[i].sku.spu_id,
                            sold_count: data.groupon_skus[i].sold_count,
                            key_word: data.groupon_skus[i].sku.spu_keyword,
                            spu_name: data.groupon_skus[i].sku.spu_name,
                            p_id: data.groupon_skus[i].operation_category.p_id

                        }
                    })

                };
                $scope.dataSku = dd;
                $scope.SkuNum = $scope.dataSku.length;
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    if (spu.indexOf($scope.dataSku[i].list.spu_id) == -1) {
                        spu.push($scope.dataSku[i].list.spu_id);
                    }
                };
                $scope.SpuNum = spu.length;
                var imgId = [];
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    imgId.push($scope.dataSku[i].list.img_sku_id);
                };
                if (imgId.length > 0) {
                    $scope.getImgUrl(imgId);
                }


                //分类显示超过四个字...
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    var name = $scope.dataSku[i].list.operation_category_name;
                    if (name.length > 4) {
                        name = name.substr(0, 4) + '..';
                    }
                    $scope.dataSku[i].list.operation_category_name = name;
                };


                $scope.checkbox = function(id) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] == id) {
                            return true;
                        }
                    }
                }
                $scope.disabled = function(id) {
                    for (var i = 0; i < arr.length; i++) {

                        if (arr[i] == id) {
                            return true;
                        }
                    }
                }
            }, function(data) {


            });
            $scope.sePro = function() {
                $scope.kWord = $scope.k_Word;
            }


            comFun();
            $scope.sbmint = function() {
                for (var i = 0; i < dd.length; i++) {
                    if (dd[i].fares[0]) {
                        if (dd[i].fares[0].start_count == "" || dd[i].fares[0].end_time == "" || dd[i].fares[0].price == "") {
                            dd[i].fares = [];
                        }

                    }
                };

                ActivityListServices.activityEditor(groupon_id, $scope.title, $scope.startime, $scope.endtime, $scope.online, dd).then(function(data) {
                    $location.path('/main/activitylist');
                }, function(data) {
                    if (data.data.down) {
                        var down = data.data.down;
                        var exists = data.data.no_exists;
                        if (down.length > 0) {
                            for (var i = 0; i < down.length; i++) {
                                growl.addErrorMessage('商品' + down[i].sku_name + '为下架状态,不允许提交活动')
                            };
                        }
                        if (exists.length > 0) {
                            for (var i = 0; i < down.length; i++) {
                                growl.addErrorMessage('商品' + down[i].sku_name + '不存在,不允许提交活动')
                            };
                        }
                    }

                })
            };



        } else {

            $scope.editorShow = false;
            $scope.activityTitle = "活动新增";
            comFun();
            $scope.sbmint = function() {
                for (var i = 0; i < dd.length; i++) {
                    if (dd[i].fares[0]) {
                        if (dd[i].fares[0].start_count == "" || dd[i].fares[0].end_time == "" || dd[i].fares[0].price == "") {
                            dd[i].fares = [];
                        }

                    }
                };

                ActivityListServices.activityAdd($scope.title, $scope.startime, $scope.endtime, $scope.online, dd).then(function(data) {
                    $location.path('/main/activitylist');
                }, function(data) {
                    var down = data.data.down;
                    var exists = data.data.no_exists;
                    if (down.length > 0) {
                        for (var i = 0; i < down.length; i++) {
                            growl.addErrorMessage('商品' + down[i].sku_name + '为下架状态,不允许提交活动')
                        };
                    }
                    if (exists.length > 0) {
                        for (var i = 0; i < down.length; i++) {
                            growl.addErrorMessage('商品' + down[i].sku_name + '不存在,不允许提交活动')
                        };
                    }
                })
            };
        }




    }])

})
