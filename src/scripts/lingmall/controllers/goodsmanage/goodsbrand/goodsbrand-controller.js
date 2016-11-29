define(['../../controllers'], function(controllers) {
    controllers.controller('goodsBrandCtrl', [
        '$scope',
        '$uibModal',
        '$http',
        'GoodsbrandService',
        'OrgServices',
        '$cookieStore',
        function($scope, $uibModal, $http, GoodsbrandService, OrgServices, $cookieStore, $modalInstance) {
            var access_token = $cookieStore.get('access_token');
            var offset = 0;
            var limit = 100;
            var list = function() {
                GoodsbrandService.brandList(access_token, offset, limit).then(function(data) {
                    $scope.brandList = data.data.list;
                }, function(data) {

                })
            };
            list();
            $scope.addMo = function() {
                $scope.modbrand = {
                        showTit: true,
                        imgShow: false,
                        brand_id: '',
                        id: '',
                        item: {
                            brand_name: '',
                            logo_url: '',
                            imgUrlLogo:'',
                        }

                    }

                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: '',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return "新增品牌";
                        },
                        contents: {
                            scope: $scope.modbrand,
                            templateurl: "./views/goodsmanage/goodsbrand/brandMod.html",

                        },
                        footer: function() {
                            var options = {
                                submit: GoodsbrandService.brandAdd,
                                isList: function() {
                                    list();
                                },
                            };
                            return options;
                        }

                    }
                })




            };
            $scope.brandCancel = function() {
                $scope.brandShow = false;
            }
            $scope.editor = function(name, id, url) {
                $scope.modedit = {
                    showTit: true,
                    imgShow: false,
                    id: id,
                    item: {
                        brand_name: name,
                        logo_url: '',
                        imgUrlLogo:'',
                    }
                }
                if (url == null || url == '') {
                    $scope.modedit.showTit = true;
                    $scope.modedit.imgShow = false;
                    $scope.modedit.item.logo_url = '';
                    $scope.modedit.item.imgUrlLogo = '';
                } else {
                    $scope.modedit.imgShow = true;
                    $scope.modedit.showTit = false;
                    $scope.modedit.item.logo_url = url;
                    $scope.modedit.item.imgUrlLogo = url + '-hq500';
                }
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: '',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return "编辑品牌";
                        },
                        contents: {
                            scope: $scope.modedit,
                            templateurl: "./views/goodsmanage/goodsbrand/brandMod.html",

                        },
                        footer: function() {
                            var options = {
                                submit: GoodsbrandService.brandEditor,
                                isList: function() {
                                    list();
                                },
                            };
                            return options;
                        }

                    }
                })

            }



            $scope.dele = function(brand_id) {
                $scope.moddel = {
                    mianMatter: '是否确认删除该品牌?',
                    id: brand_id,
                    item:'',
                }
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: '',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return "提示";
                        },
                        contents: {
                            scope: $scope.moddel,
                            templateurl: "./views/goodsmanage/goodsbrand/delMod.html",

                        },
                        footer: function() {
                            var options = {
                                submit: GoodsbrandService.brandDel,
                                isList: function() {
                                    list();
                                },
                            };
                            return options;
                        }

                    }
                })

            }


        }
    ]);

})
