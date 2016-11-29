define(['../controllers'], function(controllers) {
    controllers.controller('clientsRankCtrl', ['$scope', '$cookieStore', '$state', '$location', '$uibModal', 'MyClientsSernice', function($scope, $cookieStore, $state, $location, $uibModal, MyClientsSernice) {
        console.log('clientsRankCtrl');
        var limit = 100;
        var offset = 0;
        $scope.addShow = false;
        $scope.defaultShow = function(id) {
            return true;
        };
        //等级列表
        var myClientsList = function() {
            MyClientsSernice.gradeList(offset, limit).then(function(data) {
                $scope.rankLists = data.items;
            }, function(data) {

            })
        }
        myClientsList();
        //等级新增
        $scope.addRank = function() {
            $scope.rankName = '';
            $scope.addShow = true;
            $scope.addShowInput = true;
        }
        $scope.delShow = function() {
            $scope.addShow = false;
        }
        $scope.blurRank = function(event, name) {
                var keycode = window.event ? event.keyCode : event.which;
                if (keycode == 13 && name) {
                    $scope.addShowInput = false;
                } else if (event.type == 'blur' && name) {
                    MyClientsSernice.gradeAdd(name).then(function(data) {
                        //console.log('add',data)
                        myClientsList();
                        $scope.addShow = false;
                    }, function(data) {
                    	$scope.addShowInput = true;
                    })
                }

            }
            
            //修改
        $scope.rankEdit = function(name, grade_id) {
            var grade_id = grade_id;
            $scope.editName = name
            $scope.defaultShow = function(id) {
                if (id == grade_id) {
                    return false;
                } else {
                    return true;
                }
            };
        }
        $scope.blurName = function(event, name, id) {
            var keycode = window.event ? event.keyCode : event.which;
            if (keycode == 13 && name && id) {
                $scope.defaultShow = function(id) {
                    return true;
                };
            } else if (event.type == 'blur' && name && id) {
                MyClientsSernice.gradeEdit(id, name).then(function(data) {
                    myClientsList();
                    $scope.defaultShow = function(id) {
                        return true;
                    };
                }, function(data) {
                    $scope.defaultShow = function(r_id) {
                        if (r_id == id) {
                            return false;
                        } else {
                            return true;
                        }

                    };

                })
            }

        }


        //删除
        $scope.rankDel = function(grade_id) {
                $scope.newDel = {
                    mianMatter: '当前客户等级是否确定删除?',
                    id: grade_id,
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
                                submit: MyClientsSernice.gradeDel,
                                isList: function() {
                                    myClientsList();
                                }
                            };
                            return option;
                        }
                    }
                })
            }
            //设置默认
        $scope.rankDefult = function(id) {
            $scope.newDel = {
                mianMatter: '当前客户等级是否设为默认?',
                id: id,
                item: {
                    priority: 0
                },
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
                            submit: MyClientsSernice.gradeDefult,
                            isList: function() {
                                myClientsList();
                            }
                        };
                        return option;
                    }
                }
            })
        }

    }])
})
