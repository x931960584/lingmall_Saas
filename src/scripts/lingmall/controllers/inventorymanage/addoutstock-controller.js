define(['../controllers'], function(controllers) {
    controllers.controller('addOutstockCtrl', ['$scope', '$cookieStore', '$state', '$location', 'growl', 'ActivityListServices', 'MyGoodsServices', 'GoodsbrandService', 'outstockServices', '$document', '$stateParams', function($scope, $cookieStore, $state, $location, growl, ActivityListServices, MyGoodsServices, GoodsbrandService, outstockServices, $document, $stateParams) {
        //初始化数据
        var key, brand_id, status;
        var offset = 0;
        var limit = 6;
        var offse = 0;
        var limi = 100;
        $scope.in_type = 1;
        var tt = [];
        var temporary = [];
        var dd = [];
        var spu = [];
        var uuid = $cookieStore.get('uuid');
        $scope.in_type_name = "采购入库";
        var access_token = $cookieStore.get('access_token');
        $scope.brandName = '全部品牌';
        $scope.dateFormat = 'yyyy-mm-dd hh:ii:00';
        $scope.startTimePlaceholder = "请选择入库时间";

        $document.bind('click', function() {
            ty = false;
            $scope.operDropDown = false;
            $scope.operDroper = function(id) {
                return ty;
            };
            $scope.cateDropDown = false;
            $scope.$apply()
        })


        //时间转换
        var timeC = function(n) {
            var date = new Date(parseFloat(n) * 1000);
            return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        }

        //获取用户名
        var uesrname = function() {
            var uuid = $cookieStore.get('uuid');
            outstockServices.userName(uuid).then(function(data) {
                if (data.name == "") {
                    $scope.originator = data.user_group_name;
                } else {
                    $scope.originator = data.name;
                }
            }, function(data) {

            })
        }



        //必填输入框
        $scope.typeLi = function() {
            $scope.in_type_name = "采购入库";
        }
        $scope.getWareName = function(id, name, defaul) {
            if(defaul==1){
                $scope.warehouse_name = name + '[默认]';
            }else{
                $scope.warehouse_name = name;
            }
            
            $scope.warehouse_id = id;
            $scope.autoClose = 'always';
        };
        $scope.getDisabled = function() {
            $scope.autoClose = 'outsideClick';
        }

        //选择商品弹框
        $scope.selectGoods = function() {
            $scope.monShow = true;
            $scope.boxShow = true;
        };
        $scope.cancel = function() {
            $scope.monShow = false;
            $scope.boxShow = false;
        }

        var goodList = function() {
            ActivityListServices.goodsList(key, brand_id, $scope.category_id, status, offset, limit).then(function(data) {
                $scope.mygoodsList = data.list;
                for (var i = 0; i < $scope.mygoodsList.length; i++) {
                    for (var v = 0; v < $scope.mygoodsList[i].skus.length; v++) {
                        $scope.mygoodsList[i].skus[v].unit = $scope.mygoodsList[i].unit;
                        $scope.mygoodsList[i].skus[v].spu_name = $scope.mygoodsList[i].spu_name;
                    };

                };

                $scope.sheLves = [
                        { 'shelvesname': '上架' },
                        { 'shelvesname': '下架' }
                    ]
                    //console.log('mygoodsList',$scope.mygoodsList);
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
        $scope.setPage = function() {
                offset = ($scope.bigCurrentPage - 1) * limit;
                goodList();

            }
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
                $scope.category_id = $scope.categoryId;
                $scope.cateDropDown = false;

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

            });
        };
        $scope.getCategory();
        $scope.catedrop = function(e) {
            e.stopPropagation();
            $scope.cateDropDown = !$scope.cateDropDown
            $scope.selectAllShow = true;
            $scope.selectAllText = '全部分类';
        }
        $scope.stopPro = function(e) {
                e.stopPropagation();
            }
            //品牌
        var brandlist = function() {
            var page = '0';
            var num = '100';
            GoodsbrandService.brandList(access_token, page, num).then(function(data) {

                $scope.bList = data.data.list;
            }, function(data) {

            })
        }
        brandlist();
        //搜索商品列表
        $scope.searchBrand = function(id, name) {
            $scope.brandName = name;
            $scope.brandId = id;
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

            }
            //选择商品复选框ss
            // $scope.allCheckpro=function(event){

        //  var checkbox = event.target;
        //  if(checkbox.checked){
        //      $scope.checkbox=function(id){
        //          return true;
        //      }
        //  }else{
        //      $scope.checkbox=function(id){
        //          return false;
        //      }
        //  }
        // }

        $scope.skuCheck = function(k, keyword, $event) {
            var obj = {
                'warehouse_in_bill_sku_id': '',
                'sku_id': '',
                'unit': '',
                'price': '',
                'count': '',
                'memo': '',
                list: {
                    'sku_code': '',
                    'img_sku_id': '',
                    'barcode': '',
                    'sku_name': '',
                    'specification': '',
                    'spu_id': '',
                    'key_word': '',
                    'spu_name': '',
                }

            }
            var checkbox = $event.target;
            if (checkbox.checked && tt.indexOf(k) == -1) {
                obj.sku_id = k.sku_id;
                obj.unit = k.unit;
                obj.list.sku_code = k.sku_code;
                obj.list.img_sku_id = k.img_sku_id;
                obj.list.barcode = k.barcode;
                obj.list.sku_name = k.sku_name;
                obj.list.specification = k.specification;
                obj.list.spu_id = k.spu_id;
                obj.list.spu_name = k.spu_name;

                tt.push(k);
                temporary.push(obj);
            };
            if (!checkbox.checked && tt.indexOf(k) != -1) {
                var tindex = tt.indexOf(k);
                tt.splice(tindex, 1);
                temporary.splice(tindex, 1);
            }
        }

        //保存取消删除
        var arrsku = [];
        $scope.selectGoods = function() {
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
            //填入input的值转换
        $scope.groPrice = function(id, price) {
            if (price) {
                if (isNaN(price)) {
                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            $scope.dataSku[i].price = "";
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.dataSku.length; i++) {
                        if ($scope.dataSku[i].sku_id == id) {
                            $scope.dataSku[i].price = parseFloat(price).toFixed(2);
                        }
                    }
                }
            }
        }
        $scope.IsNum = function(event) {
            if (event.keyCode >= 48 && event.keyCode <= 57) {} else {
                event.preventDefault();
            }
        }
        $scope.stockCount = function(id, count) {
            for (var i = 0; i < $scope.dataSku.length; i++) {
                if ($scope.dataSku[i].sku_id == id) {
                    $scope.dataSku[i].count = count;
                }
            };
        }
        $scope.groMemo = function(id, memo) {
            for (var i = 0; i < $scope.dataSku.length; i++) {
                if ($scope.dataSku[i].sku_id == id) {
                    $scope.dataSku[i].memo = memo;
                }
            };
        }

        var warehouse_in_bill_id = $stateParams.id;
        $scope.isAdd = $stateParams.id;
        //添加页面和修改页面的区分事件
        if (warehouse_in_bill_id) {
            //编辑页面

            //编辑时获取仓库
            outstockServices.wareHousesList(offse, limi).then(function(data) {
                $scope.warehouseList = data.list;
            }, function(data) {

            })
            $scope.outAudit = [
                { 'outAudit': '', 'outAuditName': '审核状态' },
                { 'outAudit': '1', 'outAuditName': '未审核' },
                { 'outAudit': '2', 'outAuditName': '待审核' },
                { 'outAudit': '3', 'outAuditName': '未通过审核' },
                { 'outAudit': '4', 'outAuditName': '已审核' },

            ]
            var arr = [];
            $scope.addTitle = "修改入库单";
            outstockServices.outStockCheck(warehouse_in_bill_id).then(function(data) {
                uuid = data.make_bill_uuid;
                $scope.warehouse_in_bill_number = data.warehouse_in_bill_number;
                $scope.in_type_name = "采购入库";
                $scope.in_type = 1;
                if(data.warehouse.is_default==1){
                    $scope.warehouse_name = data.warehouse.name +'[默认]';
                }else{
                    $scope.warehouse_name = data.warehouse.name;
                }
                
                $scope.warehouse_id = data.warehouse.warehouse_id;
                $scope.in_time = timeC(data.in_time);
                if (data.make_bill_user.name == '') {
                    $scope.originator = data.make_bill_user.user_group_name;
                } else {
                    $scope.originator = data.make_bill_user.name;
                };
                if (data.review_user.name == '') {
                    $scope.auditName = data.review_user.user_group_name;
                } else {
                    $scope.auditName = data.review_user.name;
                }

                $scope.auditTime = data.updated_at;
                $scope.review_stat = data.review_status;

                var obj = {
                    'warehouse_in_bill_sku_id': '',
                    'sku_id': '',
                    'unit': '',
                    'price': '',
                    'count': '',
                    'memo': '',
                    list: {
                        'sku_code': '',
                        'img_sku_id': '',
                        'barcode': '',
                        'sku_name': '',
                        'specification': '',
                        'spu_id': '',
                        'key_word': '',
                        'spu_name': '',
                    }

                }
                for (var i = 0; i < data.warehouse_in_bill_skus.length; i++) {
                    arr.push(data.warehouse_in_bill_skus[i].sku_id);
                    dd.push({
                        'warehouse_in_bill_sku_id': data.warehouse_in_bill_skus[i].warehouse_in_bill_sku_id,
                        'sku_id': data.warehouse_in_bill_skus[i].sku_id,
                        'unit': data.warehouse_in_bill_skus[i].unit,
                        'price': data.warehouse_in_bill_skus[i].price,
                        'count': data.warehouse_in_bill_skus[i].count,
                        'memo': data.warehouse_in_bill_skus[i].memo,
                        list: {
                            'sku_code': data.warehouse_in_bill_skus[i].sku.sku_code,
                            'img_sku_id': data.warehouse_in_bill_skus[i].sku.img_sku_id,
                            'barcode': data.warehouse_in_bill_skus[i].sku.barcode,
                            'sku_name': data.warehouse_in_bill_skus[i].sku.sku_name,
                            'specification': data.warehouse_in_bill_skus[i].sku.specification,
                            'spu_id': data.warehouse_in_bill_skus[i].sku.spu_id,
                            'key_word': '',
                            'spu_name': data.warehouse_in_bill_skus[i].sku.spu_name,
                        }
                    })
                };
                $scope.dataSku = dd;
                var imgId = [];
                for (var i = 0; i < $scope.dataSku.length; i++) {
                    imgId.push($scope.dataSku[i].list.img_sku_id);
                };
                if (imgId.length > 0) {
                    $scope.getImgUrl(imgId);
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
                $scope.sbmint = function() {
                    if (dd.length > 0) {
                        outstockServices.outStockEdit(warehouse_in_bill_id, $scope.warehouse_in_bill_number, $scope.in_type, $scope.warehouse_id, $scope.in_time, dd).then(function(data) {
                            $location.path('/main/outstock');
                        }, function(data) {

                        })
                    } else {
                        growl.addErrorMessage('请选择商品');
                    }

                };

            }, function() {

            })


        } else {
            //新增页面
            $scope.addTitle = "新增入库单";
            uesrname();
            //新增编号获取
            var type = "2";
            outstockServices.outStockNum(type).then(function(data) {
                    $scope.warehouse_in_bill_number = data.number;
                }, function(data) {

                })
                //新增时获取仓库
            outstockServices.wareHousesList(offse, limi).then(function(data) {
                $scope.warehouseList = data.list;
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].is_default == 1 && data.list[i].status == 1) {
                        $scope.warehouse_name = data.list[i].name + '[默认]';
                        $scope.warehouse_id = data.list[i].warehouse_id;
                    }
                };

            }, function(data) {

            })

            //新增提交
            $scope.sbmint = function() {
                if (dd.length > 0) {
                    outstockServices.outStockAdd($scope.warehouse_in_bill_number, $scope.in_type, $scope.warehouse_id, $scope.in_time, dd).then(function(data) {
                        $location.path('/main/outstock');
                    }, function(data) {

                    })
                }else{
                    growl.addErrorMessage('请选择商品');
                }

            };

        }


    }])
})
