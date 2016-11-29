 /**
  *
  * @authors Edwin Zhu (edwinzhu@126.com)
  * @date    2016-09-18 13:14:23
  * @version V1.0
  */
 (function() {
     angular.module("ngtree", []).directive('treeView', [function() {
         return {
             restrict: 'E',
             templateUrl: './scripts/lingmall/common/ngtree/ngtree.html',
             scope: {
                 treeData: '=',
                 treeOptions: '=',
                 selectedItem: '=',
                 selectAllShow: '=',
                 selectAllText: '=',
                 itemTemplateUrl: '@',
                 pageName: '=',
                 disArea: '='
             },
             link: function(scope, elem, attrs) {
                 scope.treeOptions.isExpendAll = true;
                 var levelCount = 0;
                 /*获取全部层级的总数*/
                 var getLevelCount = function(items) {
                     levelCount++;
                     var len = items.length;
                     for (var i = 0; i < len; i++) {
                         var children = items[i][scope.treeOptions.childrenField];
                         if (children && children.length) {
                             getLevelCount(children);
                         }
                     };
                 };
                 /*判断是否所有的层级都打开了*/
                 var isExpendAll = function(items) {
                     var expendStatus = true;
                     var checkExpend = function(items) {
                         var len = items.length;
                         for (var i = 0; i < len; i++) {
                             if (items[i].isExpend == false) {
                                 scope.treeOptions.isExpendAll = expendStatus = false;
                                 return;
                             } else {
                                 var children = items[i][scope.treeOptions.childrenField];
                                 if (children && children.length) {
                                     checkExpend(children);
                                 }
                                 scope.treeOptions.isExpendAll = expendStatus;
                             }
                         };
                     };
                     checkExpend(items);
                 };
                 /*把数据源放到树数组中并获取层级总数*/
                 scope.treeOptions.fixedToTree = function(orgData, treeData) {
                     var orgData = orgData;
                     if (typeof orgData == 'object' && typeof orgData.length == 'number') {
                         for (var i = 0; i < orgData.length; i++) {
                             treeData.push(orgData[i]);
                         };
                     } else {
                         treeData.push(orgData);
                     }
                     getLevelCount(treeData);
                 };
                 if (scope.treeOptions.sourceTreeData) {
                     scope.treeOptions.fixedToTree(scope.treeOptions.sourceTreeData, scope.treeData);
                 }
                 /*单个item的展开关闭*/
                 scope.treeOptions.itemExpended = function(item, $event) {
                     item.isExpend = !item.isExpend;
                     if (item.isExpend == false) {
                         scope.treeOptions.isExpendAll = false;
                     } else {
                         isExpendAll(scope.treeData);
                     }
                     $event.stopPropagation();
                 };
                 /*设定itemExpendedLevel的默认展开层级数*/
                 scope.treeOptions.itemExpendedLevel = function(items, level) {
                     if (level) {
                         var len = items.length;
                         for (var i = 0; i < len; i++) {
                             if (items[i].level < level) {
                                 if (!items[i].isExpend) {
                                     items[i].isExpend = !items[i].isExpend;
                                 }
                                 var children = items[i][scope.treeOptions.childrenField];
                                 if (children && children.length) {
                                     scope.treeOptions.itemExpendedLevel(children, level);
                                 }
                             }
                         };
                     }
                     levelCount > level ? scope.treeOptions.isExpendAll = false : scope.treeOptions.isExpendAll = true;
                 };
                 if (scope.treeOptions.initItemExpendedLevel > 1) {
                     scope.treeOptions.itemExpendedLevel(scope.treeData, scope.treeOptions.initItemExpendedLevel)
                 }
                 /*全部item的展开关闭*/
                 scope.treeOptions.itemExpendedAll = function(items) {
                     var initStatus = function(items, bolen) {
                         var len = items.length;
                         for (var i = 0; i < len; i++) {
                             items[i].isExpend = bolen;
                             var children = items[i][scope.treeOptions.childrenField];
                             if (children && children.length) {
                                 initStatus(children, bolen);
                             }
                         };
                         scope.treeOptions.isExpendAll = bolen;
                     }
                     initStatus(items, !scope.treeOptions.isExpendAll);
                 };
                 /*获取item的Icon样式*/
                 scope.treeOptions.getItemIcon = function(item, isLeafIconClass, notExpendIconClass, isExpendIconClass) {
                     var isLeaf = scope.treeOptions.isLeaf(item);
                     if (isLeaf) {
                         return isLeafIconClass;
                     }
                     return item.isExpend ? isExpendIconClass : notExpendIconClass;
                 };
                 /*判断是否是最后一层级*/
                 scope.treeOptions.isLeaf = function(item) {
                     return !item[scope.treeOptions.childrenField] || !item[scope.treeOptions.childrenField].length;
                 };
                 /*执行事件回调*/
                 scope.treeOptions.eventCallback = function(callback, item, $event) {
                     (scope.treeOptions[callback] || angular.noop)({
                         $item: item,
                         $event: $event
                     });
                 };
             }
         };
     }]);
 })();
