define(['../controllers'], function(controllers) {
    controllers.controller('ActivitylistCtrl', ['$scope', '$cookieStore', '$state', '$location', 'ActivityListServices', 'OrgServices', '$uibModal', 'growl', function($scope, $cookieStore, $state, $location, ActivityListServices, OrgServices, $uibModal, growl) {

        var offset = '0';
        var limit = '10';
        var listId = [];
        $scope.activeStatus = [
            { 'active_status': '', 'active_status_name': '全部上下线状态' },
            { 'active_status': '1', 'active_status_name': '上线' },
            { 'active_status': '2', 'active_status_name': '下线' }
        ];
        $scope.grouponStatus = [
            { 'groupon_status': '', 'groupon_status_name': '全部拼团状态' },
            { 'groupon_status': 1, 'groupon_status_name': '未开始' },
            { 'groupon_status': 2, 'groupon_status_name': '进行中 成团' },
            { 'groupon_status': 3, 'groupon_status_name': '进行中 未成团' },
            { 'groupon_status': 4, 'groupon_status_name': '结束 成团' },
            { 'groupon_status': 5, 'groupon_status_name': '结束 未成团' }
        ];
        var title = "";
        var status = "";
        var online = "";
        var today = new Date()
        $scope.initName = "全部拼团状态";
        $scope.onlineInitName = "全部上下线状态";
        $scope.denudedShow=false;
        $scope.inputTitle=function(){
            if($scope.title != ""){
            $scope.denudedShow=true;
            }else{
                $scope.denudedShow=false;
            }
        }
        $scope.denuded=function(){
            $scope.title="";
            $scope.denudedShow=false;
        }
        var listSearch = function() {
            ActivityListServices.activityList(title, status, offset, limit, online).then(function(data) {
                $scope.bigTotalItems = data.count;
                for (var i = 0; i < data.list.length; i++) {
                    var starTime = data.list[i].start_time.replace("-", "/");
                    var endTime = data.list[i].end_time.replace("-", "/");
                    var s1 = new Date(Date.parse(starTime));
                    var e1 = new Date(Date.parse(endTime));
                    if (today - s1 > 0 && e1 - today > 0 && data.list[i].is_success == 0) {
                        data.list[i].groupon_status = '3';
                        data.list[i].groupon_status_name = '进行中 未成团';
                    } else if (e1 - today < 0 && data.list[i].is_success == 0) {
                        data.list[i].groupon_status = '5'
                        data.list[i].groupon_status_name = '结束 未成团';
                    } else if (e1 - today < 0 && data.list[i].is_success == 1) {
                        data.list[i].groupon_status = '4';
                        data.list[i].groupon_status_name = '结束 成团';
                    } else if (today - s1 > 0 && e1 - today > 0 && data.list[i].is_success == 1) {
                        data.list[i].groupon_status = '2';
                        data.list[i].groupon_status_name = '进行中 成团';
                    } else if (today - s1 < 0) {
                        data.list[i].groupon_status = '1';
                        data.list[i].groupon_status_name = '未开始';
                    }



                };
                $scope.list = data.list;

            }, function(data) {

            })
        }
        listSearch();
        $scope.setPage = function() {
            $scope.checkOne = false;
            offset = ($scope.bigCurrentPage - 1) * limit;
            listId = [];
            listSearch();
        }
        $scope.drop = function(groupon_status, groupon_status_name) {
            offset = 0;
            title = $scope.title;
            status = groupon_status;
            online = $scope.onlinestatus
            $scope.status = groupon_status;
            $scope.grouponstatus = groupon_status;
            $scope.initName = groupon_status_name;
            //listSearch();
        };
        $scope.onlinedrop = function(onlineStatus, name) {
            offset = 0;
            $scope.onlineInitName = name;
            $scope.onlinestatus = onlineStatus;
            title = $scope.title;
            status = $scope.grouponstatus;
            online = onlineStatus;
            //listSearch();

        }
        $scope.search = function() {
            offset = 0;
            online = $scope.onlinestatus
            title = $scope.title;
            status = $scope.grouponstatus;
            listSearch();

        };
        $scope.edt = function(groupon_status, active_status, edit) {
            if (edit == 1 && groupon_status == 2 && active_status == 2 || (edit == 1 && groupon_status == 3 && active_status == 2) || (edit == 1 && groupon_status == 1 && active_status == 2))
                return true;
        };
        $scope.down = function(groupon_status, active_status, cancelActivity) {
            if ((cancelActivity == 1 && groupon_status == 2 && active_status == 1) || (cancelActivity == 1 && groupon_status == 3 && active_status == 1) || (cancelActivity == 1 && groupon_status == 1 && active_status == 1))
                return true;
        };
        $scope.upload = function(groupon_status, active_status, startActivity) {
            if ((startActivity == 1 && groupon_status == 2 && active_status == 2) || (startActivity == 1 && groupon_status == 3 && active_status == 2) || (startActivity == 1 && groupon_status == 1 && active_status == 2))
                return true;
        };
        $scope.del = function(groupon_status, active_status, de) {
            if (de == 1 && groupon_status == 1 && active_status == 2)
                return true;
        };
        $scope.dowunLine = function(groId) {
            /*$scope.groId = groId;
            var downline = function() {
                var online_status = "2";
                ActivityListServices.activityDown(groId, online_status).then(function(data) {
                    listSearch();
                }, function(response) {
                    var down = data.data.down;
                    if (down.length > 0) {
                        for (var i = 0; i < down.length; i++) {
                            growl.addErrorMessage('商品' + down[i].sku_name + '为下架状态,不允许上线')
                        };
                    }


                })
            }*/
            $scope.newModal = {
                isProduct: true,
                mianMatter: '当前活动是否确定下线?',
                id: groId,
                item: {
                    online_status: 2,
                }
            }

            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '活动下线提示';
                    },
                    contents: {
                        scope: $scope.newModal,
                        templateurl: './views/goodsmanage/goodsbrand/delMod.html'
                    },
                    footer: function() {
                        var option = {
                            submit: ActivityListServices.activityDown,
                            isList: function() {
                                listSearch();
                            }
                        };
                        return option;
                    }
                }
            })

        };
        $scope.upLine = function(groId) {
            /*$scope.groId = groId;
            var upline = function() {
                var online_status = "1";
                ActivityListServices.activityDown(groId, online_status).then(function(data) {
                    $scope.modalShow = false;
                    listSearch();
                }, function(response) {
                    var down = data.data.down;
                    if (down.length > 0) {
                        for (var i = 0; i < down.length; i++) {
                            growl.addErrorMessage('商品' + down[i].sku_name + '为下架状态,不允许上线')
                        };
                    }


                })
            }*/
            $scope.newup = {
                isProduct: true,
                mianMatter: '当前活动是否确定上线?',
                id: groId,
                item: {
                    online_status: 1,
                }
            }

            var modalInstance = $uibModal.open({
                templateUrl: './views/modal/modal_tem.html',
                controller: 'ModalInstanceCtrl',
                size: '',
                backdrop: 'static',
                resolve: {
                    header: function() {
                        return '活动上线提示';
                    },
                    contents: {
                        scope: $scope.newup,
                        templateurl: './views/goodsmanage/goodsbrand/delMod.html'
                    },
                    footer: function() {
                        var option = {
                            submit: ActivityListServices.activityDown,
                            isList: function() {
                                listSearch();
                            }
                        };
                        return option;
                    }
                }
            })
        }
        $scope.delground = function(groId) {
            /* $scope.groId = groId;
             var delgr = function() {
                 ActivityListServices.activityDel(groId).then(function(data) {
                     $scope.modalShow = false;
                     listSearch();
                 }, function(data) {

                 })
             }*/
            $scope.newDel = {
                mianMatter: '当前活动是否确定删除?',
                id: groId,
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
                            submit: ActivityListServices.activityDel,
                            isList: function() {
                                listSearch();
                            }
                        };
                        return option;
                    }
                }
            })


        }
        $scope.cancel = function() {
                $scope.modalShow = false;
            }
            //批量删除

        $scope.listAll = function($event) {
            var listAll = $event.target;
            if (listAll.checked) {
                $scope.checkOne = true;
                for (var i = 0; i < $scope.list.length; i++) {
                    listId.push($scope.list[i].groupon_id);
                };
            } else {
                $scope.checkOne = false;
                listId = [];
            }
        }
        $scope.listOne = function($event, id) {
            var listOne = $event.target;
            if (listOne.checked) {
                listId.push(id);
            } else {
                for (var i = 0; i < listId.length; i++) {
                    if (listId[i] == id) {
                        listId.splice(i, 1);
                    }
                };
            }
        }

        $scope.listBer = function() {
                if (listId.length > 0) {
                    /* var delber = function() {
                         var grouponId = listId;
                         ActivityListServices.activityDel(grouponId).then(function(data) {
                             $scope.modalShow = false;
                             $scope.checkOne = false;
                             listSearch();
                         }, function(data) {

                         })
                     }*/
                    $scope.newdelber = {
                        mianMatter: '当前活动是否确定删除?',
                        id: listId,
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
                                scope: $scope.newdelber,
                                templateurl: './views/goodsmanage/goodsbrand/delMod.html'
                            },
                            footer: function() {
                                var option = {
                                    submit:ActivityListServices.activityDel,
                                    isList:function(){
                                        listSearch();
                                    }
                                };
                                return option;
                            }
                        }
                    })
                }

            }
            //权限列表控制
            // $scope.module_id = $cookieStore.get('module_id');
            // $scope.role_id =$cookieStore.get('role_id');
            // $scope.accessControl = function() {
            //     OrgServices.accessControl($scope.module_id, $scope.role_id).then(function(data) {
            //         $scope.accessControl = data.groupPurchase;
            //     });
            // };
            // $scope.accessControl();

    }])
})
