define(['../controllers'], function(controllers) {
    controllers.controller('orderControlCtrl', ['$scope', '$location', '$cookieStore', '$uibModal', 'MyClientsSernice', 'WarehouseServices', '$document', 'ActivityListServices', 'MyGoodsServices', 'GoodsbrandService', function($scope, $location, $cookieStore, $uibModal, MyClientsSernice, WarehouseServices, $document, ActivityListServices, MyGoodsServices, GoodsbrandService) {
        console.log('ordercontrol')
        $scope.tabToggerShow = true;
        $scope.isProCust = true;
        var access_token = $cookieStore.get('access_token');
        $scope.company_id = $cookieStore.get('company_id');
        var key, brand_id, category_id, status;
        var offset = 0;
        var limit = 6;
        var key_word, catagory_id, grade_id, region_id;
        var cli_offset = 0;
        var cli_limit = 10;
        var off = 0;
        var lim = 100;
        var imgIdList = [];
        var imgArrList = null;
        var supplier_id = $cookieStore.get('uuid');
        var goods_id, customer_id;
        var offset_ord = 0;
        var limit_ord = 10;
        var type = 1;
        var offset_cust = 0;
        var limit_cust = 10;
        var cust_goods_id, cust_customer_id;
        //商品 /商户切换
        $scope.proCust = function() {
            $scope.isProCust = true;
            $scope.isCliCust = false;
            $scope.tabToggerShow = true;
            $scope.sectProShow = false;
        };
        $scope.cliCust = function() {
            $scope.isCliCust = true;
            $scope.isProCust = false;
            $scope.tabToggerShow = false;
        }


        //创建商品对象
        $scope.newObjItem = {
            keyword: null,
            mygoodsList: null,
            imgList: null,
            bList: null,
            keyword: '',
            brandName: '全部品牌',
            bigTotalItems: '',
            bigCurrentPage: '',
            customerIdArr: [],
            item: {
                'type': 1,
                'goods_ids': null,
                'customer_ids': null,
            },
            //cateDropDown:false,
            setPage: function() {
                offset = ($scope.newObjItem.bigCurrentPage - 1) * limit;
                goodList();
            },
            proTree: [],
            proTreeOptions: {
                fixedToTree: function() {},
                itemExpendedLevel: function() {},
                sourceTreeData: [],
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
                        category_id = '';
                        $scope.newObjItem.categoryName = '全部分类';
                    } else {
                        category_id = $scope.selectedItem.$item.supplier_category_id;
                        $scope.newObjItem.categoryName = $scope.selectedItem.$item.supplier_category_name;
                    }
                    $scope.newObjItem.selectAllShow = true;
                    $scope.newObjItem.cateDropDown = false;
                },
                itemCheckedChanged: function($item) {
                    console.log($item, 'item checked');

                }
            },
            searchBrand: function(id, name) {
                $scope.newObjItem.brandName = name;
                brand_id = id;
            },
            catedrop: function(e) {
                e.stopPropagation();
                $scope.newObjItem.cateDropDown = !$scope.newObjItem.cateDropDown
                $scope.newObjItem.selectAllShow = true;
                $scope.newObjItem.selectAllText = '全部分类';
            },
            stopPro: function(e) {
                e.stopPropagation();
            },
            searchPro: function() {
                key = $scope.newObjItem.keyword;
                goodList();
            },
            skuCheck: function(sku, event) {
                var checkbox = event.target;
                if (checkbox.checked) {
                    $scope.newObjItem.customerIdArr.push(sku.sku_id);
                } else {
                    var num = $scope.newObjItem.customerIdArr.indexOf(sku.sku_id);
                    $scope.newObjItem.customerIdArr.splice(num, 1);
                }

                $scope.newObjItem.item.goods_ids = $scope.newObjItem.customerIdArr;
            }

        };




        //创建客户对象
        $scope.newCliItem = {
            bigTotalItems: null,
            clientsList: null,
            cataLists: null,
            rankLists: null,
            regionLists: null,
            keyWord: null,
            customerIdArr: [],
            item: {
                'type': 1,
                'goods_ids': null,
                'customer_ids': null,
            },
            verifyFlag: [{
                "state": 0,
                "name": "未建立"
            }, {
                "state": 1,
                "name": "已建立"
            }],
            cataLi: function(name, id) {
                $scope.newCliItem.cataName = name;
                catagory_id = id;
            },
            cataAll: function() {
                $scope.newCliItem.cataName = '全部客户类型';
                catagory_id = null;
            },
            rankLi: function(name, id) {
                $scope.newCliItem.rankName = name;
                grade_id = id;
            },
            rankAll: function() {
                $scope.newCliItem.rankName = '全部客户等级';
                grade_id = null;
            },
            regLi: function(name, id) {
                $scope.newCliItem.regName = name;
                region_id = id;
            },
            regAll: function() {
                $scope.newCliItem.regName = '全部销售区域';
                region_id = null;
            },
            searchClient: function() {
                key_word = $scope.newCliItem.keyWord;
                MyClientsList();
            },
            setPage: function() {
                cli_offset = ($scope.newCliItem.bigCurrentPage - 1) * cli_limit;
                MyClientsList();
            },
            checkCli: function(event, id) {
                var checkbox = event.target;
                if (checkbox.checked) {
                    $scope.newCliItem.customerIdArr.push(id);
                } else {
                    var num = $scope.newCliItem.customerIdArr.indexOf(id);
                    $scope.newCliItem.customerIdArr.splice(num, 1);
                }

                $scope.newCliItem.item.customer_ids = $scope.newCliItem.customerIdArr;
            }
        };
        //商品限购商户
        //搜索选择的商品
        $scope.searchPro = function() {
            var key, brand_Id, category_Id, status;
            var offsetAll = 0;
            var limitAll = 100;
            var allList = [];
            imgArrList = [];
            ActivityListServices.goodsList($scope.keyWordAll, brand_Id, category_Id, status, offsetAll, limitAll).then(function(data) {
                $scope.proListShow = true;
                for (var i = 0; i < data.list.length; i++) {
                    for (var u = 0; u < data.list[i].skus.length; u++) {
                        imgArrList.push(data.list[i].skus[u].img_sku_id);
                        allList.push(data.list[i].skus[u]);
                    }
                };
                $scope.proList = allList;
                if (imgArrList.length > 0) {
                    getUrlImgList();
                }
            }, function(data) {

            })
        }
        var getUrlImgList = function() {
            var imgNum1 = [];
            var imgmoreNum1 = [];
            MyGoodsServices.getThumbnailList(imgArrList).then(function(data) {
                $scope.drowImgList = data;
                for (var i = 0; i < data.length; i++) {
                    imgNum1.push(data[i].bundle_number);
                };
                for (var i = 0; i < imgArrList.length; i++) {
                    if (imgNum1.indexOf(imgArrList[i]) == -1) {
                        imgmoreNum1.push(imgArrList[i]);
                    }
                };
                for (var i = 0; i < imgmoreNum1.length; i++) {
                    var imgbuList = { bundle_number: '', domain: 'assets/images', key: 'none.png' }
                    imgbuList.bundle_number = imgmoreNum1[i];
                    $scope.drowImgList.push(imgbuList);
                };

            })
        };


        //选择商品按钮
        $scope.selectPro = function(pro) {
            $scope.skuCode = pro.sku_code;
            $scope.barCode = pro.barcode;
            $scope.skuName = pro.sku_name;
            $scope.newCliItem.item.goods_ids = pro.sku_id;
            $scope.specifiCation = pro.specification;
            MyGoodsServices.getThumbnailList(pro.img_sku_id).then(function(data) {
                if (data.length > 0) {
                    $scope.locaImgUrl = data[0].domain + '/' + data[0].key + '-thumbnail100';
                } else {
                    $scope.locaImgUrl = 'assets/images/none.png';
                }

            }, function(data) {

            })
            goods_id = pro.sku_id;
            $scope.sectProShow = true;
            ordProList();
        }
        $scope.locaDel = function() {
                $scope.sectProShow = false;
            }
            //  关联限制客户列表
        var cusArr = [];
        var ordProList = function() {
                cusArr = [];
                MyClientsSernice.strategyList(offset_ord, limit_ord, type, goods_id, customer_id, supplier_id).then(function(data) {
                    $scope.sectCliList = data.items;
                    for (var i = 0; i < data.items.length; i++) {
                        cusArr.push(data.items[i].customer_id);
                    };
                    console.log('54', data.items)

                }, function(data) {

                })
            }
            //客户列表
        var MyClientsList = function() {
            MyClientsSernice.custList(cli_offset, cli_limit, key_word, catagory_id, grade_id, region_id).then(function(data) {
                $scope.newCliItem.bigTotalItems = data.count;
                $scope.newCliItem.clientsList = data.items;
                for (var i = 0; i < data.items.length; i++) {
                    for (var j = 0; j < cusArr.length; j++) {
                        if (cusArr[j] == data.items[i].customer_id) {
                            data.items[i].ischecked = true;
                        }
                    };
                };

            }, function(data) {

            })
        }

        //搜索条件栏
        MyClientsSernice.cataList(off, lim).then(function(data) {
            $scope.newCliItem.cataLists = data.items;
        }, function(data) {

        });
        MyClientsSernice.gradeList(off, lim).then(function(data) {
            $scope.newCliItem.rankLists = data.items;
        }, function(data) {

        });
        MyClientsSernice.regionList(off, lim).then(function(data) {
            $scope.newCliItem.regionLists = data.items;
        }, function(data) {

        })




        //商户限购商品

        var proArr = [];
        $scope.searchCli = function() {
            MyClientsSernice.custList(0, 100, $scope.keyWord).then(function(data) {
                console.log('dd', data)
                $scope.searchCliShow = true;
                $scope.seaCusList = data.items;
            }, function(data) {

            })
        }
        $scope.clickCus = function(id, name) {
            $scope.yiCustName = name;
            cust_customer_id = id;
            $scope.sectCustShow = true;
            $scope.searchCliShow = false;
            $scope.newObjItem.item.customer_ids = id;
            ordCustList();
        }
        $scope.custDelAll = function() {
                $scope.sectCustShow = false;
            }
            //关联之商品之关联
        var ordCustList = function() {
                proArr = [];
                imgIdList = [];
                var imgNum2 = [];
                var imgmoreNum2 = [];
                $scope.imgListUrl = [];
                MyClientsSernice.aggretList(offset_cust, limit_cust, type, cust_goods_id, cust_customer_id, supplier_id).then(function(data) {
                    for (var i = 0; i < data.items.length; i++) {
                        proArr.push(data.items[i].goods_id)
                    };
                    $scope.skuProList = data.items;
                    for (var i = 0; i < data.items.length; i++) {
                        imgIdList.push(data.items[i].goods.img_sku_id);
                    };
                    console.log('imgIdList', imgIdList)
                    MyGoodsServices.getThumbnailList(imgIdList).then(function(data) {
                        $scope.imgListUrl = data;
                        for (var i = 0; i < data.length; i++) {
                            imgNum2.push(data[i].bundle_number);
                        };
                        for (var i = 0; i < imgIdList.length; i++) {
                            if (imgNum2.indexOf(imgIdList[i]) == -1) {
                                imgmoreNum2.push(imgIdList[i]);
                            }
                        };
                        for (var i = 0; i < imgmoreNum2.length; i++) {
                            var imgbuList = { bundle_number: '', domain: 'assets/images', key: 'none.png' }
                            imgbuList.bundle_number = imgmoreNum2[i];
                            $scope.imgListUrl.push(imgbuList);
                        };

                    })
                    console.log('474', $scope.imgListUrl)
                }, function(data) {

                })
            }
            //商品列表

        var goodList = function() {
            imgIdList = [];
            ActivityListServices.goodsList(key, brand_id, category_id, status, offset, limit).then(function(data) {
                for (var i = 0; i < data.list.length; i++) {
                    for (var u = 0; u < data.list[i].skus.length; u++) {
                        imgIdList.push(data.list[i].skus[u].img_sku_id);
                    }
                };
                if (imgIdList.length > 0) {
                    getUrlImg();
                };

                for (var i = 0; i < data.list.length; i++) {
                    for (var l = 0; l < data.list[i].skus.length; l++) {
                        for (var j = 0; j < proArr.length; j++) {
                            if (proArr[j] == data.list[i].skus[l].sku_id) {
                                data.list[i].skus[l].ischecked = true;
                            }
                        };
                    };

                };
                console.log('list', data.list);
                $scope.newObjItem.mygoodsList = data.list;
                $scope.newObjItem.bigTotalItems = data.count;
            }, function(data) {

            })
        };
        //goodList();
        //品牌列表
        var brandlist = function() {
            var page = '0';
            var num = '100';
            GoodsbrandService.brandList(access_token, page, num).then(function(data) {

                $scope.newObjItem.bList = data.data.list;
            }, function(data) {

            })
        }
        brandlist();
        //分类列表
        var getCategory = function() {
            MyGoodsServices.getCategorys($scope.company_id).then(function(data) {
                $scope.newObjItem.proTreeOptions.fixedToTree(data.list, $scope.newObjItem.tree);
                $scope.newObjItem.proTreeOptions.itemExpendedLevel($scope.newObjItem.tree, 3);
                $scope.newObjItem.proTreeOptions.sourceTreeData = data.list;

            });
        };
        getCategory();
        //点击空白
        $document.bind('click', function() {
                $scope.newObjItem.cateDropDown = false;
                $scope.proListShow = false;
                $scope.searchCliShow = false;
                $scope.$apply()
            })
            //获取table里de图片
        var getUrlImg = function() {
            var imgNum = [];
            var imgmoreNum = [];
            MyGoodsServices.getThumbnailList(imgIdList).then(function(data) {
                $scope.newObjItem.imgList = data;
                for (var i = 0; i < data.length; i++) {
                    imgNum.push(data[i].bundle_number);
                };
                for (var i = 0; i < imgIdList.length; i++) {
                    if (imgNum.indexOf(imgIdList[i]) == -1) {
                        imgmoreNum.push(imgIdList[i]);
                    }
                };
                for (var i = 0; i < imgmoreNum.length; i++) {
                    var imgbuList = { bundle_number: '', domain: 'assets/images', key: 'none.png' }
                    imgbuList.bundle_number = imgmoreNum[i];
                    $scope.newObjItem.imgList.push(imgbuList);
                };

            })
        };


        //限购商品新增
        $scope.addProCust = function() {
            goodList();
            $scope.newObjItem.customerIdArr = [];
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '请选择要限购的商品';
                    },
                    contents: {
                        scope: $scope.newObjItem,
                        templateurl: './views/clients/proMod.html',
                    },
                    footer: function() {
                        var options = {
                            submit: MyClientsSernice.strategyAdd,
                            isList: function() {
                                ordCustList();
                            },
                        };
                        return options;
                    }
                }
            });
        };
        //限购客户新增
        $scope.addCliCust = function() {
            MyClientsList();
            $scope.newCliItem.customerIdArr = [];
            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '请选择要限购的客户';
                    },
                    contents: {
                        scope: $scope.newCliItem,
                        templateurl: './views/clients/cliMod.html',
                    },
                    footer: function() {
                        var options = {
                            submit: MyClientsSernice.strategyAdd,
                            isList: function() {
                                ordProList();
                            },
                        };
                        return options;
                    }
                }
            });
        };

        //取消限制
        $scope.DelCust = function(id) {
            $scope.newDel = {
                mianMatter: '确认取消限制该商品吗?',
                id: id,
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
                            submit: MyClientsSernice.strategyDel,
                            isList: function() {
                                ordCustList();
                            }
                        };
                        return option;
                    }
                }
            })
        }

        $scope.DelProAll=function(id){
            $scope.newDel = {
                mianMatter: '确认取消限制该客户吗?',
                id: id,
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
                            submit: MyClientsSernice.strategyDel,
                            isList: function() {
                                ordProList();
                            }
                        };
                        return option;
                    }
                }
            })
        }

    }])
})
