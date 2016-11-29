define(['../directives'], function(directives) {
    directives.directive('treeview', ['$sce','$compile',function($sce,$compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                scope.add = function(p_id, level) {
                    if(angular.element('.name_input ').hasClass('input_fouc')){
                        //angular.element('.input_fouc').focus();
                        return
                    }else{
                        scope.classifyParShow = true;
                        scope.allShow = true;
                        scope.classifyParName = "";
                        if (angular.element('.classify_list').hasClass('khdd')) {
                            angular.element('.khdd').remove();
                        }
                        scope.p_id = p_id;
                        var html = angular.element('<div ng-show="allShow" class="classify_list khdd col-sm-12 col-md-12 col-lg-12"><div class="list_fist_' + (level + 1) + ' col-sm-12 col-md-12 col-lg-12"><div class="list_left col-sm-8 col-md-8 col-lg-8"><div class="input-w"><input type="text" maxlength="16" ng-model="classifyParName" class="form-control" ng-show="classifyParShow" ng-blur="count(p_id)" placeholder="请输入分类名" ng-keyup="AddKeyUp($event,p_id)"/></div><div ng-hide="classifyParShow">{{classifyParName}}</div></div><div class="list_right col-sm-4 col-md-4 col-lg-4"><a class="chil_add"><i class="iconfont">&#xe61e;</i>新增子级类</a><a>修改</a><a class="delDom">删除</a></div></div></div>')
                        var str = $compile(html)(scope);
                        angular.element('.category_' + p_id).append(str);
                        angular.element('.delDom').bind('click', function() {
                             angular.element('.khdd').remove();
                        })
                    }
                    
                    
                }
                angular.element('.par_add').bind('click', function() {
                    if(angular.element('.name_input ').hasClass('input_fouc')){
                        //angular.element('.input_fouc').focus();
                        return
                    }else{
                        angular.element('.input_fouc').focus();
                        scope.classifyParShow = true;
                        scope.allShow = true;
                        scope.classifyParName = "";
                        if (angular.element('.classify_list').hasClass('khdd')) {
                            angular.element('.khdd').remove();
                        }
                        scope.p_id = "0";
                        var html1 =angular.element('<div ng-show="allShow" class="classify_list khdd col-sm-12 col-md-12 col-lg-12"><div class="list_fist col-sm-12 col-md-12 col-lg-12"><div class="list_left col-sm-8 col-md-8 col-lg-8"><div class="input-w"><input type="text" maxlength="16" ng-model="classifyParName" class="form-control" ng-show="classifyParShow" ng-blur="count(p_id)" placeholder="请输入分类名" ng-keyup="AddKeyUp($event,p_id)"/></div><div ng-hide="classifyParShow">{{classifyParName}}</div></div><div class="list_right col-sm-4 col-md-4 col-lg-4"><a class="chil_add"><i class="iconfont">&#xe61e;</i>新增子级类</a><a>修改</a><a class="delDom">删除</a></div></div></div>');
                        var str_par = $compile(html1)(scope);
                        angular.element('.par_list').append(str_par);
                        angular.element('.delDom').bind('click', function() {
                             angular.element('.khdd').remove();
                        })
                    }

                    
                });
                

            }
        }
    }])
});
