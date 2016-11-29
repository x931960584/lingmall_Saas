define(['../../controllers'], function(controllers) {
    controllers.controller('goodsClassifyCtrl', ['$scope', '$cookieStore', 'GoodsclassifyService', 'OrgServices', '$uibModal', function($scope, $cookieStore, GoodsclassifyService, OrgServices, $uibModal) {

        var list = function() {
            GoodsclassifyService.classifyList().then(function(data) {
                $scope.par = data.list;
            }, function(data) {

            })
        }
        list();
        $scope.count = function(p_id) {
            if ($scope.classifyParName && $scope.classifyParName != "") {
                GoodsclassifyService.classifyAdd($scope.classifyParName, p_id).then(function(data) {
                    $scope.classifyParShow = false;
                    $scope.allShow = false;
                    list();
                }, function(data) {
                    $scope.allShow = true;
                })


            }
        };
        $scope.chilDel = function(id) {
            var classObj={
                mianMatter:'确定是否删除该分类?',
                id:id,
            }
            var ModalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return "提示";
                    },
                    contents: {
                        scope: classObj,
                        templateurl: './views/goodsmanage/goodsbrand/delMod.html',
                    },
                    footer: function() {
                        var option = {
                            submit :GoodsclassifyService.classifyDel,
                            isList:function(){
                                list();
                            },
                            item:'',
                        }
                        return option;
                    }
                }
            })

            

        };
        var nameCate = "";
        $scope.chilEditor = function(id, name) {
            nameCate = name;
            $scope.Sci = id;
            $scope.inputShow = function(supplier_category_id) {
                if (supplier_category_id == id)
                    return true;
            }
        };
        //angular.element('.input_fouc').focus();
        $scope.edCount = function(event, p_id, id, category_name) {
            $scope.Sci = "";
            var keycode = window.event ? event.keyCode : event.which;
            if (p_id && id && category_name && keycode == 13 || category_name == nameCate && keycode == 13 || category_name == nameCate && event.type == 'blur') {
                $scope.inputShow = function(supplier_category_id) {
                    if (supplier_category_id == id)
                        return false;
                }
            } else if (p_id && id && category_name && event.type == 'blur' && category_name != nameCate) {
                GoodsclassifyService.classifyEditor(id, category_name, p_id).then(function(data) {
                    $scope.inputShow = function(supplier_category_id) {
                        if (supplier_category_id == id)
                            return false;
                    }
                    list();
                }, function(data) {
                    $scope.inputShow = function(supplier_category_id) {
                        if (supplier_category_id == id)
                            return true;
                    }
                })
            }
        };

        $scope.AddKeyUp = function(event, p_id) {
            var p_id = p_id;
            var keycode = window.event ? event.keyCode : event.which;
            if (keycode == 13) {
                $scope.count(p_id);
                angular.element('.khdd').remove();
            }

        }


        //权限列表控制
        // $scope.module_id = $cookieStore.get('module_id');
        // $scope.role_id =$cookieStore.get('role_id');
        // $scope.accessControl = function() {
        //     OrgServices.accessControl($scope.module_id, $scope.role_id).then(function(data) {
        //         $scope.accessControl = data.category;
        //     });
        // };
        // $scope.accessControl();

    }]);
})
