define(['../controllers', 'underscore'], function(controllers, _) {
    controllers.controller('PermissionsCtrl', ['$scope',
        'PermissionServices',
        '$location',
        '$cookieStore',
        '$state',
        '$element',
        '$rootScope',
        '$uibModal',
        function($scope, PermissionServices, $location, $cookieStore, $state, $element, $rootScope,$uibModal) {
            $scope.indication = false;
            $scope.modManage = false;
            $scope.indel = false;
            $scope.allShow = false;
            $scope.selectPer = false;
            $scope.IsCheckFirst = 1;
            $scope.IsCheckSec = 1;
            $scope.nameShow = false;
            //$scope.selectAll = 1;
            $scope.company_id = $cookieStore.get('company_id');
            $scope.access_token = $cookieStore.get('access_token');
            $scope.moId = $cookieStore.get('module_id');
            $scope.roId = $cookieStore.get('role_id');
            $scope.roleSeach = '';
            var true_all = false;
            var true_one = false;
            $scope.pullFont = "+";
            $scope.toggleFont = "展开";
            //权限控制
            /*PermissionServices.judgement($scope.roId, $scope.moId).then(function(data) {
                $scope.addstat = data.permission.add;
                $scope.editstat = data.permission.edit;
                $scope.delstat = data.permission.delete;
                $scope.permissionEdit = data.permission.permissionEdit;
                $scope.conPer=data.permission;

            }, function(data) {

            });*/
            $scope.searchList = function() {
                PermissionServices.roleList($scope.company_id, $scope.roleSeach).then(function(data) {
                    $scope.role = data;
                    $scope.addDisaBled = false;
                    $scope.delDisaBled = true;
                    $scope.editDisaBled = true;
                    $scope.selectPer = false;
                    $scope.modManage = false;
                    $scope.juese = "";
                }, function(data) {

                });
            };
            $scope.searchList();
            $scope.checkList = function(id, status, name) {
                $scope.juese = id;
                $scope.chRoleId = id;
                $scope.myCtrl = {
                        'role_id': id,
                        'role_status': status,
                        'role_name': name
                    }
                    //$scope.modManage = true;
                $scope.modSeach = "";
                $scope.selectPer = false;
                $scope.editDisaBled = false;
                $scope.delDisaBled = false;
                $scope.modManage = true;
                $scope.searchModList();
                /*if ($scope.permissionEdit == 1) {
                    

                } else {
                    $scope.modManage = false;
                }*/
                //$scope.modSeach="";
                //$scope.searchModList();

            };
            $scope.searchModList = function() {
                $scope.roleID = $scope.myCtrl.role_id;
                PermissionServices.modules($scope.roleID, $scope.modSeach).then(function(data) {
                    $scope.modManage = true;
                    $scope.mdList = data;
                    $scope.subID = "";
                    $scope.moduleGid = "";
                    true_all = false;
                    true_one = false;
                    $scope.isAll = function(one_id) {
                        return false;
                    }
                }, function(data) {
                    $scope.modManage = false;
                });
            };

            $scope.seachper = function() {
                $scope.searchList();
            };
            $scope.seachModal = function() {
                $scope.searchModList();
            };
            $scope.add = function() {
                $scope.perAdd={
                    id:'',
                    item:{
                        company_id: $scope.company_id,
                        roleName: '',
                        status: 2,
                        role_id: '',
                    },
                }
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: '',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return "添加角色";
                        },
                        contents: {
                            scope: $scope.perAdd,
                            templateurl: "./views/permissions/addPermodal.html",

                        },
                        footer: function() {
                            var options = {
                                submit: PermissionServices.addPermission,
                                isList: function() {
                                    $scope.searchList();
                                },
                            };
                            return options;
                        }

                    }
                })




            };
            $scope.wrong = function() {
                $scope.indication = false;
            };
            $scope.cancel = function() {
                $scope.indication = false;
            };
            $scope.remcancel = function() {
                $scope.indel = false;
            };
            $scope.editor = function() {
                /*$scope.person = $scope.myCtrl.role_status;
                $scope.indication = true;
                $scope.roleName = $scope.myCtrl.role_name;
                $scope.person = $scope.myCtrl.role_status;
                $scope.role_id = $scope.myCtrl.role_id;
                $scope.nameShow = false;
                $scope.submitForm();*/

                $scope.perEid={
                    id:'',
                    item:{
                        company_id: $scope.company_id,
                        roleName: $scope.myCtrl.role_name,
                        status: $scope.myCtrl.role_status,
                        role_id: $scope.myCtrl.role_id,
                    },
                }
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: '',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return "编辑角色";
                        },
                        contents: {
                            scope: $scope.perEid,
                            templateurl: "./views/permissions/addPermodal.html",

                        },
                        footer: function() {
                            var options = {
                                submit: PermissionServices.addPermission,
                                isList: function() {
                                    $scope.searchList();
                                },
                            };
                            return options;
                        }

                    }
                })


            };
            /*$scope.submitForm = function() {
                $scope.sub = function() {
                    if ($scope.roleName != "") {
                        PermissionServices.addPermission($scope.company_id, $scope.roleName, $scope.person, $scope.role_id).then(function(data) {
                            $scope.indication = false;
                            $scope.searchList();
                        }, function(data) {
                            $scope.nameShow = true;
                            $scope.nameError = data;
                        });
                    }

                }
            };*/

            $scope.remov = function() {
               /* $scope.indel = true;
                $scope.confirm = function() {
                    $scope.role_id = $scope.myCtrl.role_id;
                    PermissionServices.delPermission($scope.company_id, $scope.role_id, $scope.access_token).then(function(data) {
                        $scope.indel = false;
                        $scope.searchList();
                    }, function(data) {
                        $scope.nameError = data.message;
                    });
                }*/
                $scope.moddel = {
                    mianMatter: '是否确认删除该角色?',
                    id: $scope.company_id,
                    item:{
                        role_id:$scope.myCtrl.role_id,
                        access_token:$scope.access_token,
                    },
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
                                submit: PermissionServices.delPermission,
                                isList: function() {
                                    $scope.searchList(); 
                                },
                            };
                            return options;
                        }

                    }
                })

            };
            $scope.toggle = function() {
                if (true_all == false) {
                    true_all = true;
                    true_one = true
                    $scope.pullFont = "-";
                    $scope.toggleFont = "收起";
                    $scope.isAll = function(one_id) {
                        return true;
                    }
                } else {
                    true_all = false;
                    true_one = false
                    $scope.pullFont = "+";
                    $scope.toggleFont = "展开";
                    $scope.isAll = function(one_id) {
                        return false;
                    }
                }
                // $scope.showChildrenList=!$scope.showChildrenList;

            }
            var kt = false;
            $scope.unique = function(module_id, statue, chRoleId, children, trueOne) {
                //scope.moduleID=module_id;
                kt = !kt;
                $scope.isAll = function(id) {
                    if (id == module_id) {
                        return kt;
                    }
                }

                /*if (true_all) {
                    if (true_one == true) {
                        true_one = false;
                        $scope.isAll = function(one_id) {
                            if (one_id == module_id)
                                return false;
                        }
                    } else if (true_one == false) {
                        true_one = true;
                        $scope.isAll = function(one_id) {
                            if (one_id == module_id)
                                return true;
                        }
                    }

                } else {
                    if (true_one == false) {
                        true_one = true;
                        $scope.isAll = function(one_id) {
                            if (one_id == module_id)
                                return true;
                        }
                    } else if (true_one == true) {
                        true_one = false;
                        $scope.isAll = function(one_id) {
                            if (one_id == module_id)
                                return false;
                        }

                    }
                }*/
                $scope.moduleGid = module_id;
                $scope.subID = module_id;
                $scope.chroleid = chRoleId;
                $scope.selRoleId = chRoleId;
                $scope.selectPer = false;
                if (children) {
                    if ($scope.moduleID != module_id) {
                        $scope.moduleID = module_id;
                    } else {
                        $scope.moduleID = !module_id;
                    }
                } else {
                    $scope.selectPer = false;
                    $scope.actionModel($scope.chroleid, $scope.moduleGid);
                }


            }
            $scope.chidList = function(sub_id, status, chRoleId) {
                $scope.moduleGid = sub_id;
                $scope.subID = sub_id;
                $scope.chroleid = chRoleId;
                $scope.selRoleId = chRoleId;
                $scope.selectPer = false;
                $scope.actionModel($scope.chroleid, $scope.moduleGid);
            }
            $scope.checkF = function(statue, chRoleId, modID, $event) {
                $event.stopPropagation();
                $scope.selectPer = false;
                $scope.selRoleId = chRoleId;
                $scope.mod_ID = modID;
                $scope.moduleGid = modID;
                var ck = $event.target.checked;
                if (ck) {
                    $scope.mo_statue = 1;
                } else {
                    $scope.mo_statue = 0;
                }
                $scope.allAction($scope.selRoleId, $scope.mod_ID, $scope.mo_statue);
                //$scope.actionModel($scope.selRoleId,$scope.mod_ID);
            }

            $scope.checkSc = function(statue, chRoleId, modID, $event) {
                $event.stopPropagation();
                $scope.selectPer = false;
                $scope.selRoleId = chRoleId;
                $scope.mod_ID = modID;
                $scope.moduleGid = modID;
                $scope.subID = modID;
                var ck = $event.target.checked;
                if (ck) {
                    $scope.mo_statue = 1;
                } else {
                    $scope.mo_statue = 0;
                }
                $scope.allAction($scope.selRoleId, $scope.mod_ID, $scope.mo_statue);
                //$scope.actionModel($scope.selRoleId,$scope.mod_ID);
            }





            $scope.actionModel = function(role_id, module_id) {
                PermissionServices.modsearch(role_id, module_id).then(function(data) {
                    $scope.selectPer = true;
                    var statue_1 = [];
                    var tt = [];
                    var dd = [];
                    var isChe = [];

                    if (module_id == 1) {
                        $scope.actLIst = _.filter(data, function(n) {
                            return n.action_id <= 4;
                        })
                        $scope.actLIstSec = _.filter(data, function(n) {
                            return n.action_id > 4;
                        })
                        for (var i = 0; i < $scope.actLIst.length; i++) {
                            if ($scope.actLIst[i].status == 1) {
                                tt.push($scope.actLIst[i].action_id)
                            }
                        };
                        for (var i = 0; i < $scope.actLIstSec.length; i++) {
                            if ($scope.actLIstSec[i].status == 1) {
                                dd.push($scope.actLIstSec[i].action_id)
                            }
                        };
                        if (tt.length > 1) {
                            $scope.fistDis = function(id) {
                                if (id == 4) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        } else if (tt.length == 1) {
                            $scope.fistDis = function(id) {
                                return false;
                            }
                        } else if (tt.length == 0) {
                            $scope.fistDis = function(id) {
                                if (id == 4) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        };
                        if (dd.length > 1) {
                            $scope.secDis = function(id) {
                                if (id == 8) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        } else if (dd.length == 1) {
                            $scope.secDis = function(id) {
                                return false;
                            }
                        } else if (dd.length == 0) {
                            $scope.secDis = function(id) {
                                if (id == 8) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        };
                        /* var org = _.filter(data, function(n) {
                             return n.action_id == 4;
                         })
                         var us = _.filter(data, function(n) {
                             return n.action_id == 8;
                         })
                         if (org[0].status == 0) {
                             $scope.fistDis = function(id) {
                                 if (id != 4) {
                                     return false;
                                 }
                             }
                         }
                         if (us[0].status == 0) {
                             $scope.secDis = function(id) {
                                 if (id != 8) {
                                     return false;
                                 }
                             }
                         }*/
                        $scope.actShow = true;
                    } else {
                        $scope.actLIst = data;
                        $scope.actShow = false;
                        for (var i = 0; i < $scope.actLIst.length; i++) {
                            if ($scope.actLIst[i].status == 1) {
                                statue_1.push($scope.actLIst[i].status)
                                tt.push($scope.actLIst[i].action_id)
                            }
                            if ($scope.actLIst[i].action_id == 4) {
                                isChe.push($scope.actLIst[i].action_id);
                            }
                            if (isChe.length > 0 && statue_1.length == 0) {
                                $scope.fistDis = function(id) {
                                    if (id == 4) {
                                        return false;
                                    } else {
                                        return true
                                    }

                                }

                            } else if (isChe.length > 0 && statue_1.length == 1) {
                                $scope.fistDis = function(id) {
                                    return false;

                                }

                            } else if (isChe.length > 0 && statue_1.length > 1) {
                                $scope.fistDis = function(id) {
                                    if (id == 4) {
                                        return true;
                                    } else {
                                        return false
                                    }

                                }

                            } else if (isChe.length == 0) {
                                $scope.fistDis = function(id) {
                                    return false;

                                }
                            }

                        };

                    }
                    $scope.tt = tt;
                    $scope.dd = dd;
                    if ($rootScope.accessControl.permission.permissionEdit == 0) {
                        $scope.secDis = function(id) {
                            return true;
                        };
                        $scope.fistDis = function(id) {
                            return true;

                        }
                    }
                }, function(data) {});
            };
            $scope.actionfn = function(chRoleId, module_id, action_id, $event) {
                var isck = $event.target.checked;
                var action_i = $scope.tt;
                if (isck && action_i.indexOf(action_id) == -1) {
                    action_i.push(action_id);
                }
                if (!isck && action_i.indexOf(action_id) != -1) {
                    var idx = action_i.indexOf(action_id);
                    action_i.splice(idx, 1);
                }
                if (action_i.length > 1) {
                    $scope.fistDis = function(id) {
                        if (id == 4) {
                            return true;
                        }
                    }
                } else {
                    $scope.fistDis = function(id) {
                        if (id == 4) {
                            return false;
                        }
                    }
                }

                if (action_id == 4 && isck) {
                    $scope.fistDis = function(id) {
                        return false;
                    }
                } else if (action_id == 4 && !isck) {
                    $scope.fistDis = function(id) {
                        if (id != 4) {
                            return true;
                        }

                    }
                }

                if (isck) {
                    $scope.ac_statue = 1;
                } else {
                    $scope.ac_statue = 0;
                }
                PermissionServices.editor(chRoleId, module_id, action_id, $scope.ac_statue).then(function(data) {}, function(data) {});
            };
            $scope.actionSecfn = function(chRoleId, module_id, action_id, $event) {
                var isck = $event.target.checked;

                if (isck && $scope.dd.indexOf(action_id) == -1) {
                    $scope.dd.push(action_id);
                }
                if (!isck && $scope.dd.indexOf(action_id) != -1) {
                    var idx = $scope.dd.indexOf(action_id);
                    $scope.dd.splice(idx, 1);
                }
                if ($scope.dd.length > 1) {
                    $scope.secDis = function(id) {
                        if (id == 8) {
                            return true;
                        }
                    }
                } else {
                    $scope.secDis = function(id) {
                        if (id == 8) {
                            return false;
                        }
                    }
                }
                if (action_id == 8 && isck) {
                    $scope.secDis = function(id) {
                        return false;
                    }
                } else if (action_id == 8 && !isck) {
                    $scope.secDis = function(id) {
                        if (id != 8) {
                            return true;
                        }
                    }
                }
                if (isck) {
                    $scope.ac_statue = 1;
                } else {
                    $scope.ac_statue = 0;
                }
                PermissionServices.editor(chRoleId, module_id, action_id, $scope.ac_statue).then(function(data) {}, function(data) {});
            };
            $scope.allAction = function(role_id, module_id, status) {
                PermissionServices.pitchall(role_id, module_id, status).then(function(data) {
                    $scope.actionModel(role_id, module_id);
                }, function(data) {});
            }

        }
    ])
})
