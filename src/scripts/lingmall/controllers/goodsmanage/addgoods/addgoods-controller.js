define(['../../controllers'], function(controllers) {
    controllers.controller('AddgoodsCtrl', ['$scope', 'growl', '$stateParams', '$location', '$cookieStore', '$document', 'MyGoodsServices', function($scope, growl, $stateParams, $location, $cookieStore, $document, MyGoodsServices) {
        $scope.itemGroup = [];
        $scope.skuGroup = [];
        $scope.others = [];
        $scope.othersGroup = [];
        $scope.pageStatus = $stateParams.status;
        $scope.currSpuId = $stateParams.spu_id;
        $scope.sort = '0';
        $scope.keyword = null;
        $scope.specification = '';
        $scope.unit = '件';
        //$scope.status = 2; //默认状态:下架状态

        //计量单位
        $scope.unitList = [
            { name: '件' }, { name: '吨' }, { name: '只' }, { name: '斤' }, { name: '个' }, { name: '瓶' },
            { name: '罐' }, { name: '盒' }, { name: '箱' }, { name: '包' }, { name: '袋' }, { name: '双' }
        ];
        //获取商品信息
        $scope.getGoods = function() {
            MyGoodsServices.getSingleGoodsInfo($scope.currSpuId).then(function(data) {
                $scope.name = data.spu_name;
                $scope.brand = data.brand.brand_name || '空';
                $scope.brand_id = data.brand.brand_id;
                $scope.spu_code = data.spu_code;
                $scope.category = data.supplier_category.supplier_category_name;
                $scope.category_id = data.supplier_category.supplier_category_id;
                $scope.unit = data.unit;
                $scope.keyword = data.keyword;
                $scope.sort = data.sort;
                //$scope.status = data.status;
                if (data.extend.specification) {
                    $scope.itemGroup = data.extend.specification;
                }
                if (data.extend.others) {
                    $scope.others = data.extend.others;
                }
                if ($scope.others.length) {
                    $scope.othersOptions.hasSpecs = true;
                }
                if ($scope.itemGroup.length) {
                    $scope.options.hasSpecs = true;
                }
                $scope.skuGroup = data.skus;
                if (data.desc != null) {
                    $scope.desc = um.setContent(data.desc);
                }
                $scope.company_id = data.company.company_id;

                var skuList = data.skus;
                //获取img_sku_id列表
                $scope.imgSkuIdList = [];
                var getImgSkuIdList = function(skuList) {
                    for (var i = 0; i < skuList.length; i++) {
                        $scope.imgSkuIdList.push(skuList[i].img_sku_id);
                    };
                };
                getImgSkuIdList(skuList);
                $scope.getImgUrl($scope.imgSkuIdList);
            });
        };
        //编辑商品
        $scope.editGoods = function() {
            if ($scope.desc == null) {
                $scope.desc = $scope.goodsDesc;
            };
            if (checkGroup($scope.itemGroup, $scope.options) && checkGroup($scope.others, $scope.othersOptions)) {
                if (checkMainImg()) {
                    MyGoodsServices.editSpuInfo($scope.currSpuId, $scope.company_id, $scope.spu_code, $scope.name, $scope.category_id, $scope.brand_id, $scope.unit, $scope.sort,
                        $scope.skuGroup, $scope.itemGroup, $scope.others, $scope.keyword, $scope.desc).then(function(data) {
                        $scope.currGoods = data;
                        growl.addSuccessMessage("修改成功");
                        $location.path('/main/mygoods');
                    });
                };
            };
        };
        //查看或编辑时 获取图片信息
        $scope.getImgUrl = function(imgSkuIdList) {
            MyGoodsServices.getThumbnailList(imgSkuIdList).then(function(data) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var skuLen = $scope.skuGroup.length;
                    for (var j = 0; j < skuLen; j++) {
                        if ($scope.skuGroup[j].img_sku_id == data[i].bundle_number) {
                            $scope.skuGroup[j].mainImgUrl = data[i].domain + '/' + data[i].key + '-thumbnail100'
                        }
                    }
                };
            })
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
                $scope.selectCategory($item.$item.supplier_category_name, $item.$item.supplier_category_id, $item.$item.last);
            },
            itemCheckedChanged: function($item) {
                //当canChecked为true时,input[checkbox]的点击事件
            }
        };
        var company_id = $cookieStore.get('company_id');
        MyGoodsServices.getCategorys($scope.company_id).then(function(data) {
            $scope.categorysData = data.list;
            var data = data.list;
            $scope.categoryTreeOptions.fixedToTree(data, $scope.categoryTree);
            $scope.categoryTreeOptions.itemExpendedLevel($scope.categoryTree, 3);
            //console.log($scope.categoryTree);
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 1) {
                    $scope.category = data[i].supplier_category_name;
                    $scope.category_id = data[i].supplier_category_id;
                }
            };
        });
        //
        $scope.selectBrand = function(name, id) {
            $scope.brand_id = id;
            $scope.brand = name;
        };
        $scope.selectCategory = function(name, id, last) {
            var event = event || window.event;
            event.stopPropagation(); //阻止向上冒泡
            event.preventDefault();
            if (last == false) {
                return;
            }
            $scope.category_id = id;
            $scope.category = name;
            $scope.showCategoryList = false;
        };
        $scope.selectUnit = function(name) {
            $scope.unit = name;
        };
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
                //默认分类
                var data = data.list;
                //循环遍历分类
                $scope.categorysList = [];

                function push(data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].type == 1) {
                            $scope.category = data[i].supplier_category_name;
                            $scope.category_id = data[i].supplier_category_id;
                        }
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

        //检查是否上传了主图
        var checkMainImg = function() {
            var hasMainImg = true;
            var skuGroupLen = $scope.skuGroup.length;
            for (var i = 0; i < skuGroupLen; i++) {
                if (!$scope.skuGroup[i].mainImgUrl) {
                    hasMainImg = false;
                }
            };
            if (!hasMainImg) {
                growl.addErrorMessage("每个规格的商品至少上传1张商品主图");
            };
            return hasMainImg;
        };
        // 检查是否需要输入规格属性值
        var checkGroup = function(arr, options) {
            var checked = true;
            if (options.hasSpecs && arr.length) {
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    if (!arr[i].children || !arr[i].children[0].value) {
                        growl.addErrorMessage(arr[i].key + '至少需输入一项' + options.statusTitle);
                        checked = false;
                    }
                }
            }
            return checked;
        };
        //显示分类下拉框
        $scope.showCategoryBox = function(event) {
            var event = event || window.event;
            event.stopPropagation(); //阻止向上冒泡
            event.preventDefault();
            $scope.showCategoryList = !$scope.showCategoryList;
        };
        //弹出框阻止冒泡
        $scope.stop = function(){
            var event = event || window.event;
            event.stopPropagation();//阻止向下冒泡
        };
        //点击空白隐藏
        $document.bind('click', function() {
            $scope.showCategoryList = false;
            $scope.$apply();
        });

        //mock skus数据
        //添加商品
        $scope.addGood = function() {
            $scope.desc = $scope.goodsDesc;
            $scope.specification = $scope.itemGroup;
            if (checkGroup($scope.itemGroup, $scope.options) && checkGroup($scope.others, $scope.othersOptions)) {
                if (checkMainImg()) {
                    MyGoodsServices.addGoods($scope.spu_code, $scope.name, $scope.category_id, $scope.brand_id, $scope.unit, $scope.sort,
                        $scope.skuGroup, $scope.specification, $scope.others, $scope.keyword, $scope.desc).then(function(data) {
                        growl.addSuccessMessage("添加成功");
                        $location.path('/main/mygoods');
                    })
                }
            }
        };
        //
        $scope.uploaderStatus = [{ status: 1, name: '等待上传' }, { status: 2, name: '上传中' }, { status: 3, name: '3' }, { status: 4, name: '4' }, { status: 5, name: '上传成功' }];
        $scope.uploadOptions = {
            uploadBox: false,
            getUploadToken: MyGoodsServices.getUploadToken,
            getPicsList: MyGoodsServices.getPicsList,
            getImgUrl: $scope.getImgUrl,
            getSkuId: MyGoodsServices.getSkuId,
            modifyPics: function(index, pic, status, uploader) {
                var item = {
                    key: pic.key,
                    bundle_pics_id: pic.bundle_pics_id + '',
                    sequence: pic.sequence,
                    classify: pic.classify,
                    status: status
                };
                var pics = [];
                pics.push(item);
                MyGoodsServices.modifyPics(pic.bundle_number, pics).then(function() {
                    if (uploader == 'left') {
                        $scope.uploadOptions.uploader.leftImgList.splice(index, 1);
                        $scope.getImgUrl(pic.bundle_number);
                    }
                    if (uploader == 'right') {
                        $scope.uploadOptions.uploader.rightImgList.splice(index, 1);
                    }
                });
            }
        };
        $scope.options = {
            hasSpecs: false,
            checkBoxTitle: '该商品具有多种规格',
            statusTitle: '规格种类',
            addBtnTitle: '添加规格',
            spu_code: '',
            sku_id: '',
            bundle_number: '',
            item: {
                maxItemLength: 4, //最大item数
                maxKeyLength: 10, //每个item的key允许输入的最大长度
                defaultKeyName: '规格', //默认item的key的名称
                maxChildrenLength: 50, //每个item的允许添加的最大子集长度
                maxChildrenValueLength: 20 //每个item的单个子集允许输入的最大长度
            },
            maxSKUs: 200,
            autoCreatSKU: true,
            createSpuCode: MyGoodsServices.createSpuCode,
            showUploadBox: function(sku) {
                $scope.uploadOptions.showUploadBox(sku);
            }
        };
        $scope.othersOptions = {
            hasSpecs: false,
            checkBoxTitle: '该商品具有多种属性',
            statusTitle: '商品属性',
            addBtnTitle: '添加属性',
            spu_code: '',
            sku_id: '',
            item: {
                maxItemLength: 10,
                maxKeyLength: 10,
                defaultKeyName: '属性',
                maxChildrenLength: 1,
                maxChildrenValueLength: 50
            },
            maxSKUs: 0,
            autoCreatSKU: false
        };
        $scope.$watch('options.spu_code', function(newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.spu_code = $scope.options.spu_code;
            }
        });
        //判断页面来源路径
        if ($scope.pageStatus == 'edit' || $scope.pageStatus == 'view') {
            $scope.getGoods();
        }
    }]);
});
