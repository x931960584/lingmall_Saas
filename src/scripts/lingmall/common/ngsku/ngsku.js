/**
 *
 * @authors Edwin Zhu (edwinzhu@126.com)
 * @date    2016-08-18 15:47:51
 * @version V1.0
 */
(function() {
    angular.module('ngsku', ['angular-growl']).directive('itemChildren', [function() {
        return {
            restrict: 'A',
            link: function(scope, iElem, iAttr) {
                /*模拟输入框，单击dom元素聚焦输入框*/
                var input = iElem.find('input');
                iElem.click(function() {
                    input.focus();
                });
            }
        };
    }]).directive('specsDirective', ['growl', function(growl) {
        return {
            restrict: 'A',
            scope: {
                itemGroup: '=itemGroup',
                skuGroup: '=skuGroup',
                options: '=options',
                pageStatus: '=pageStatus'
            },
            templateUrl: function(iElem, iAttr) {
                return iAttr.templateUrl;
            },
            link: function(scope, iElem, iAttr) {
                scope.options.initSKU = function() {
                    if (scope.options.hasSpecs && !scope.itemGroup.length) {
                        scope.options.addItemGroup();
                    } else {
                        scope.itemGroup = [];
                        scope.skuGroup = [];
                        if (scope.options.autoCreatSKU) {
                            scope.options.creatSKU();
                        }
                    }
                };
                /*获取ItemGroup中每个item的Key的原值*/
                var oldKey;
                scope.options.getOldItemKey = function(key) {
                    oldKey = key;
                };
                /*将所有SKU中specification的每项原值等于oldKey的设置为新的Key*/
                scope.options.setItemKey = function(item, key) {
                    var skuGroupLen = scope.skuGroup.length;
                    var itemGroupLen = scope.itemGroup.length;
                    var itemChildrenLen = item.children.length;
                    var count = 0;
                    /*遍历itemGroup，判断是否存在相同的规格名称*/
                    for (var i = 0; i < itemGroupLen; i++) {
                        if (key == scope.itemGroup[i].key) {
                            count++;
                            if (count > 1) {
                                if (typeof(growl) !== 'undefined') {
                                    growl.addErrorMessage(key + "已存在");
                                } else {
                                    alert(key + "已存在");
                                }
                                item.key = oldKey;
                                return;
                            }
                        }
                    };
                    /*遍历当前item的children，把children中每项的key替换为输入的key*/
                    for (var i = 0; i < itemChildrenLen; i++) {
                        item.children[i].key = key;
                    };
                    /*遍历skuGroup，把specification中每项的key替换为输入的key*/
                    for (var i = 0; i < skuGroupLen; i++) {
                        var specLen = scope.skuGroup[i].specification.length;
                        for (var j = 0; j < specLen; j++) {
                            if (oldKey == scope.skuGroup[i].specification[j].key) {
                                scope.skuGroup[i].specification[j].key = key;
                            }
                        }
                    };
                    oldKey = key;
                };
                /*添加新的Item到ItemGroup，即新增规格*/
                scope.options.addItemGroup = function() {
                    var item = {
                        key: '',
                        inputval: '',
                        children: [{ key: '', value: '' }]
                    };
                    /*遍历itemGroup，初始化规格名称，并检查是否有相同的，如有增加序号值，直到不重复*/
                    function checkItemGroup(item, num) {
                        var len = scope.itemGroup.length;
                        for (var i = 0; i < len; i++) {
                            if (!scope.itemGroup[i].children.length || !scope.itemGroup[i].children[0].value) {
                                if (typeof(growl) !== 'undefined') {
                                    growl.addErrorMessage(scope.itemGroup[i].key + '至少需输入一项' + scope.options.statusTitle);
                                } else {
                                    alert(scope.itemGroup[i].key + '至少需输入一项' + scope.options.statusTitle);
                                }
                                return false;
                            }
                            if (item.key == scope.itemGroup[i].key) {
                                num++;
                                item.key = scope.options.item.defaultKeyName + num;
                                checkItemGroup(item.key, num);
                            }
                        }
                        return item.key;
                    }
                    var len = scope.itemGroup.length;
                    var num = len + 1;
                    item.key = scope.options.item.defaultKeyName + num;
                    if (len) {
                        if (checkItemGroup(item, num)) {
                            if (len > 1) {
                                item.key = checkItemGroup(item, num);
                            }
                        } else {
                            return;
                        }
                    }
                    item.children = [{ key: item.key, value: '' }];
                    scope.itemGroup.push(item);
                    if (scope.options.autoCreatSKU) {
                        scope.options.creatSKU();
                    }
                };
                /*生成SKU*/
                scope.options.creatSKU = function() {
                    /*遍历所有数组，并进行递归组合*/
                    var specialGroup = function(array) {
                        var len = array.length;
                        var results = [];
                        var indexs = {};
                        var specialSort = function(start) {
                            start++;
                            if (start > len - 1) {
                                return;
                            }
                            if (!indexs[start]) {
                                indexs[start] = 0;
                            }
                            if (!(array[start] instanceof Array)) {
                                array[start] = [array[start]];
                            }
                            for (indexs[start] = 0; indexs[start] < array[start].length; indexs[start]++) {
                                specialSort(start);
                                if (start == len - 1) {
                                    var temp = [];
                                    for (var i = len - 1; i >= 0; i--) {
                                        if (!(array[start - i] instanceof Array)) {
                                            array[start - i] = [array[start - i]];
                                        }
                                        temp.push(array[start - i][indexs[start - i]]);
                                    }
                                    results.push(temp);
                                }
                            }
                        };
                        specialSort(-1);
                        return results;
                    };
                    /*添加SKU到skuGroup中*/
                    var addSKU = function(spec) {
                        var add = function(spec) {
                            var sku = {
                                sku_id: '',
                                sku_code: '',
                                sku_name: '',
                                img_sku_id: '',
                                barcode: '',
                                weight: '',
                                market_price: '',
                                groupon_price: '',
                                cost_price: '',
                                stock_count: '',
                                specification: []
                            };
                            if (spec) {
                                sku.specification = spec;
                            }
                            var len = scope.skuGroup.length;
                            var num = '0' + (len + 1);
                            sku.sku_code = scope.options.spu_code + num;
                            scope.skuGroup.push(sku);
                        };
                        if (!scope.options.spu_code) {
                            if (scope.pageStatus == 'edit' || scope.pageStatus == 'view') {
                                return;
                            }
                            scope.options.createSpuCode().then(function(data) {
                                scope.options.spu_code = data.spu_code;
                                add(spec);
                            });
                        } else {
                            add(spec);
                        }

                    };
                    /*遍历itemGroup,获取每个item的每个children的每一项值并赋值给arrayGroup*/
                    var arrayGroup = [];
                    var itemGroupLength = scope.itemGroup.length;
                    for (var i = 0; i < itemGroupLength; i++) {
                        if (scope.itemGroup[i].children.length) {
                            arrayGroup.push(scope.itemGroup[i].children);
                        }
                    }
                    /*清空skuGroup*/
                    scope.skuGroup = [];
                    /*获取所有规格的组合*/
                    var specialArray = specialGroup(arrayGroup);
                    /*遍历所有组合将每一个组合添加到skuGroup*/
                    var specArrayLength = specialArray.length;
                    /*如果没有规格组合，则初始化一个无规格SKU*/
                    if (!specArrayLength) {
                        addSKU();
                    } else {
                        for (var i = 0; i < specArrayLength; i++) {
                            addSKU(specialArray[i]);
                        }
                    }

                };
                /*删除单个sku*/
                scope.options.removeSKU = function(sku) {
                    var skuGroupLen = scope.skuGroup.length;
                    if (skuGroupLen > 1) {
                        for (var i = 0; i < skuGroupLen; i++) {
                            if (sku == scope.skuGroup[i]) {
                                scope.skuGroup.splice(i, 1);
                            };
                        }
                    }
                };
                /*根据event事件，判断是否有回车事件，是则添加规格项到item，并生成SKU*/
                scope.options.addItem = function(event, item, perItem) {
                    var len = item.children.length;
                    if (event !== 'unfocus') {
                        /*将input中输入的内容转unicode,并获取长度*/
                        var size = event.target.value.replace(/[^\u0000-\u00ff]/g, "aa").length;
                        event.target.size = size + 4;
                        var keycode = window.event ? event.keyCode : event.which;
                        if (perItem && (keycode == 13)) {
                            var child = { key: item.key, value: perItem };
                            /*如果item的children长度为1并且第一个key的value值为空，则将内容赋值给第一个key的value*/
                            if (len == 1 && !item.children[0].value) {
                                item.children[0].value = perItem;
                            } else {
                                /*如果相同的key的值已经存在，则不允许添加*/
                                if (scope.skuGroup.length < scope.options.maxSKUs) {
                                    for (var i = 0; i < len; i++) {
                                        /*如果相同的key的值已经存在，则不允许添加*/
                                        if (perItem == item.children[i].value) {
                                            if (typeof(growl) !== 'undefined') {
                                                growl.addErrorMessage(perItem + '已存在');
                                            } else {
                                                alert(perItem + '已存在');
                                            }
                                            item.inputval = '';
                                            event.target.size = 2;
                                            return;
                                        }
                                    }
                                    item.children.push(child);
                                } else {
                                    if (typeof(growl) !== 'undefined') {
                                        growl.addErrorMessage('抱歉,规格组合不允许超过' + scope.options.maxSKUs + '个');
                                    } else {
                                        alert('抱歉,规格组合不允许超过' + scope.options.maxSKUs + '个');
                                    }
                                    item.inputval = '';
                                    event.target.size = 2;
                                    return;
                                }
                            };
                            if (scope.options.autoCreatSKU) {
                                if (scope.skuGroup.length < scope.options.maxSKUs) {
                                    scope.options.creatSKU();
                                } else {
                                    growl.addErrorMessage('抱歉,规格组合不允许超过' + scope.options.maxSKUs + '个');
                                }
                            }
                            item.inputval = '';
                            event.target.size = 2;
                        }
                    } else {
                        if (!item.children[0].value || !item.children.length) {
                            if (typeof(growl) !== 'undefined') {
                                growl.addErrorMessage(item.key + '至少需输入一项' + scope.options.statusTitle);
                            } else {
                                alert(item.key + '至少需输入一项' + scope.options.statusTitle);
                            }
                        }
                        item.inputval = '';
                    }
                };
                /*删除单个item的单个规格值，并重新生成SKU*/
                scope.options.removeItem = function(item, perItem) {
                    var len = item.children.length;
                    /*判断children的长度,只剩1个情况下(即第一个child),应直接将value赋空值*/
                    if (item.children.length == 1 && item.children[0] == perItem) {
                        item.children[0] = {
                            key: item.key,
                            value: ''
                        }
                    } else {
                        for (var i = 0; i < len; i++) {
                            if (perItem == item.children[i]) {
                                item.children.splice(i, 1);
                            }
                        }
                    }
                    if (scope.options.autoCreatSKU) {
                        scope.options.creatSKU();
                    }
                };
                /*删除单个item，并重新生成SKU*/
                scope.options.removeItemGroup = function(item) {
                    var len = scope.itemGroup.length;
                    if (scope.options.autoCreatSKU && len > 1) {
                        for (var i = 0; i < len; i++) {
                            if (item == scope.itemGroup[i]) {
                                scope.itemGroup.splice(i, 1);
                            }
                        }
                        scope.options.creatSKU();
                    } else if (!scope.options.autoCreatSKU && len > 0) {
                        for (var i = 0; i < len; i++) {
                            if (item == scope.itemGroup[i]) {
                                scope.itemGroup.splice(i, 1);
                                console.log(scope.itemGroup);
                                if (len < 1 || len == 1) {
                                    scope.options.hasSpecs = false;
                                }
                            }
                        }
                    }
                };
                if (!scope.options.maxSKUs) {
                    scope.options.maxSKUs = 100;
                }
                if (scope.options.autoCreatSKU) {
                    scope.options.creatSKU();
                }
            }
        };
    }])
})();
