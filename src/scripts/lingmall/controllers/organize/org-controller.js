define(['../controllers'], function(controllers) {
    controllers.controller('OrganizeCtrl', ['$scope', '$rootScope', '$state', 'growl', 'md5', '$uibModal', '$location', '$cookieStore', '$stateParams', 'OrgServices',
        function($scope, $rootScope, $state, growl, md5, $uibModal, $location, $cookieStore, $stateParams, OrgServices) {
            //
            $scope.key = "";
            $scope.keyword = "";
            $scope.pageIndex = 0;
            $scope.pageSize = 8;

            $scope.role_id = Number($cookieStore.get('role_id'));
            $scope.company_id = $cookieStore.get('company_id');
            $scope.userName = $cookieStore.get('username');
            $scope.is_main = $cookieStore.get('is_main');

            // 组织架构左侧栏列表 tree-view
            $scope.tree = [];
            $scope.treeOptions = {
            	sourceTreeData: [],
                textField: 'user_group_name',
                childrenField: 'childs',
                rootParentLevel: 0,
                initItemExpendedLevel:2,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.selectedItem = $item;
                    $scope.checkUgid($item.$item.ugid, $item.$item.user_group_name);
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                }
            };
            //编辑组织架构 tree-view
            $scope.selectUserGroupTree = [];
            $scope.selectUserGroupTreeOptions = {
                itemExpendedLevel: function() {},
                sourceTreeData: [],
                textField: 'user_group_name',
                childrenField: 'childs',
                rootParentLevel: 0,
                initItemExpendedLevel:2,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.selectedUserGroupTreeItem = $item;
                    $scope.editUserGroupModalScope.setUserGroup($item.$item.ugid, $item.$item.user_group_name);
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                }
            };
            // 编辑用户账号 tree-view
            $scope.selectUserAccountTree = [];
            $scope.selectUserAccountTreeOptions = {
                //itemExpendedLevel: function() {},
                sourceTreeData: [],
                textField: 'user_group_name',
                childrenField: 'childs',
                rootParentLevel: 0,
                initItemExpendedLevel:2,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.selectedUserAccountTreeItem = $item;
                    $scope.editUserAccountModalScope.setAccountUserGroup($item.$item.ugid, $item.$item.user_group_name);
                    $scope.editUserAccountModalScope.showUserAccountBox = false;
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                }
            };
            //获取组织架构用户组 初始化
            $scope.getUserGroup = function() {
                $scope.tree = [];
                $scope.selectUserGroupTree = [];
                $scope.selectUserAccountTree = [];
                OrgServices.userGroup($scope.company_id, $scope.key).then(function(data) {
                    $scope.userGroupList = data.data;
                    $scope.userGroupListCount = data.count;
                    if ($scope.userGroupListCount == 0) {
                        return;
                    }
                    //获取当前组织信息
                    $scope.getCurrentUserGroup($scope.userGroupList);
                    //获取子账号列表
                    $scope.getUserList();
                    //左侧栏组织架构列表
                    $scope.treeOptions.fixedToTree(angular.copy(data.data), $scope.tree);
                    $scope.treeOptions.itemExpendedLevel($scope.tree, 3);
                    //编辑组织架构 tree-view
                    $scope.selectUserGroupTreeOptions.sourceTreeData = angular.copy(data.data);
                    // 编辑用户账号 tree-view
                    $scope.selectUserAccountTreeOptions.sourceTreeData = angular.copy(data.data);

                    //搜索提示信息
                    if ($scope.key && $scope.userGroupListCount == 0) {
                        growl.addInfoMessage('未搜索到相关组织');
                    }
                });
            };
            $scope.getUserGroup();
            //获取组织架构并获取对应用户列表
            $scope.getUserGroupUserList = function(){
            	OrgServices.userGroup($scope.company_id, $scope.key).then(function(data) {
            		$scope.userGroupList = data.data;
	                //默认选中公司所在用户组
	                if($scope.userGroupList){
	                    var deafult_ugid = $scope.userGroupList.ugid || $scope.userGroupList[0].ugid;
	                    var default_ugname = $scope.userGroupList.user_group_name || $scope.userGroupList[0].user_group_name;
	                    $scope.checkUgid(deafult_ugid, default_ugname);
	                }
            	})
            };
            $scope.getUserGroupUserList();
            //置值ugid 获取单个组织信息以及用户列表
            $scope.checkUgid = function(ugid, ugname) {
                $scope.ugid = ugid;
                $scope.currentUserGroupName = ugname;
                //获取当前组织信息
                $scope.getCurrentUserGroup($scope.userGroupList);
                //获取当前组织的用户列表
                $scope.getUserList();
                //获取当前用户组织父级
                getParentInfo($scope.currentUserGroup);

            };
            //获取当前组织信息
            $scope.getCurrentUserGroup = function(userGroupList) {
                if (userGroupList == null || userGroupList == '') {
                    return;
                }
                if (userGroupList.ugid == $scope.ugid) {
                    $scope.currentUserGroup = userGroupList;
                } else if (userGroupList.childs) {
                    var childs = userGroupList.childs;
                    for (var i = 0; i < childs.length; i++) {
                        if (childs[i].ugid == $scope.ugid) {
                            $scope.currentUserGroup = childs[i];
                            break;
                        } else {
                            $scope.getCurrentUserGroup(childs[i]);
                        }
                    }
                }
            };
            //获取当前组的父级
            var getParentInfo = function(item) {
                var loopChilds = function(childs) {
                    var len = childs.length;
                    for (var i = 0; i < len; i++) {
                        if (item.p_id == childs[i].ugid) {
                            $scope.parentUserGroup = childs[i];
                        } else {
                            if (childs[i].childs) {
                                loopChilds(childs[i].childs);
                            }
                        }
                    }
                }
                if (item.p_id == $scope.userGroupList.ugid) {
                    $scope.parentUserGroup = $scope.userGroupList;
                } else {
                    if ($scope.userGroupList.childs) {
                        loopChilds($scope.userGroupList.childs);
                    }
                }
            };

            /**************************************分割线*****************************************/
            //右边获取用户列表
            $scope.getUserList = function() {
                OrgServices.getUserList($scope.keyword, $scope.pageIndex, $scope.pageSize, $scope.ugid).then(function(data) {
                    $scope.userlistCount = data.count;
                    $scope.userList = data.list;
                    //页码
                    $scope.maxSize = 5;
                    $scope.bigTotalItems = $scope.userlistCount;

                    if ($scope.userlistCount == 0 && $scope.keyword) {
                        growl.addInfoMessage("未搜索到相关内容!");
                    } else if ($scope.userlistCount == 0) {
                        growl.addInfoMessage("没有属于该组织的用户!");
                    }

                })
            };
            //翻页
            $scope.setPage = function() {
                $scope.pageIndex = $scope.bigCurrentPage;
                $scope.pageIndex = $scope.pageSize * ($scope.pageIndex - 1);
                $scope.getUserList();
            };
            //获取角色列表
            $scope.getRoles = function() {
                OrgServices.getRoles($scope.company_id).then(function(data) {
                    $scope.rolesList = data;
                    $scope.addUserAccountModalScope.rolesList = data;
                    $scope.viewUserAccountModalScope.rolesList = data;
                    $scope.editUserAccountModalScope.rolesList = data;
                });
            };
            $scope.getRoles();

            //模态框作用域
            $scope.addUserGroupModalScope = {
            	selectUserGroupTree: $scope.tree,
                selectUserGroupTreeOptions: $scope.treeOptions,
                selectedUserGroupTreeItem: $scope.selectedtItem,
            	pageName: 'addUserGroup',
                confirm: true,
                validateUserGroupName: function(name) {
                    var nameReg = /^[\s\S]*.{1,16}$/;
                    if (!nameReg.test(name)) {
                        $scope.addUserGroupModalScope.userGroupNameErr = true;
                    } else {
                        $scope.addUserGroupModalScope.userGroupNameErr = false;
                    }
                }
            };
            $scope.editUserGroupModalScope = {
                selectUserGroupTree: $scope.selectUserGroupTree,
                selectUserGroupTreeOptions: $scope.selectUserGroupTreeOptions,
                selectedUserGroupTreeItem: $scope.selectedUserGroupTreeItem,
                pageName: 'editUserGroup',
                confirm: true,
                setUserGroup: function(ugid, user_group_name){
                	$scope.editUserGroupModalScope.setUserGroupUgidBefore = ugid;
                	$scope.editUserGroupModalScope.setUserGroupNameBefore = user_group_name;
                	$scope.editUserGroupModalScope.showParentUserGroupBox = false;
                },
                validateUserGroupName: function(name) {
                    var nameReg = /^[\s\S]*.{1,16}$/;
                    if (!nameReg.test(name)) {
                        $scope.editUserGroupModalScope.userGroupNameErr = true;
                    } else {
                        $scope.editUserGroupModalScope.userGroupNameErr = false;
                    }
                }
            };
            $scope.viewUserGroupModalScope = {
                pageName: 'view',
                pageView: 'view',
                pageModal: 'viewusergroupmodal',
            };
            $scope.deleteUserGroupModalScope = {
                deleteText: '是否确认删除?',
                confirm: true,
            };

            $scope.addUserAccountModalScope = {
                parentUserGroup: $scope.parentUserGroup || $scope.currentUserGroup,
                selectUserAccountTreeOptions: $scope.selectUserAccountTreeOptions,
                selectUserAccountTree: $scope.selectUserAccountTree,
                selectedUserAccountItem: $scope.selectedUserAccountItem,
                confirm: true,
                setAddRoleId: function(name, role_id) {
                    $scope.addUserAccountModalScope.addRoleName = name;
                    $scope.addUserAccountModalScope.addRoleId = role_id;
                    $scope.addUserAccountModalScope.showRolelist = false;
                },
                validateMobile: function(addMobile) {
                    var mobileReg = /^1[34578]\d{9}$/; //手机号验证
                    if (!mobileReg.test(addMobile)) {
                        $scope.addUserAccountModalScope.mobileRegErr = true;
                    } else {
                        $scope.addUserAccountModalScope.mobileRegErr = false;
                    }
                },
                validatePwd: function(addPassword) {
                    var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$).{5,20}$/; //6-20位数字和字母组成
                    if (!pwdReg.test(addPassword)) {
                        $scope.addUserAccountModalScope.pwdRegErr = true;
                    } else {
                        $scope.addUserAccountModalScope.pwdRegErr = false;
                    }
                }
            };
            $scope.editUserAccountModalScope = {
                parentUserGroup: $scope.parentUserGroup || $scope.currentUserGroup,
                selectUserAccountTreeOptions: $scope.selectUserAccountTreeOptions,
                selectUserAccountTree: $scope.selectUserAccountTree,
                selectedUserAccountItem: $scope.selectedUserAccountItem,
                pageName: 'editUserAccount',
                confirm: true,
                setAddRoleId: function(name, role_id) {
                    $scope.editUserAccountModalScope.addRoleName = name;
                    $scope.editUserAccountModalScope.addRoleId = role_id;
                    $scope.editUserAccountModalScope.showRolelist = false;
                },
                setAccountUserGroup: function(user_group_id, user_group_name){
                	$scope.editUserAccountModalScope.user_group_id = user_group_id;
                	$scope.editUserAccountModalScope.user_group_name = user_group_name;
                	$scope.editUserAccountModalScope.showUserAccountBox = false;
                },
                validateMobile: function(addMobile) {
                    var mobileReg = /^1[34578]\d{9}$/; //手机号验证
                    if (!mobileReg.test(addMobile)) {
                        $scope.editUserAccountModalScope.mobileRegErr = true;
                    } else {
                        $scope.editUserAccountModalScope.mobileRegErr = false;
                    }
                },
                validatePwd: function(addPassword) {
                    var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$).{5,20}$/; //6-20位数字和字母组成
                    if (!pwdReg.test(addPassword)) {
                        $scope.editUserAccountModalScope.pwdRegErr = true;
                    } else {
                        $scope.editUserAccountModalScope.pwdRegErr = false;
                    }
                }
            };
            $scope.viewUserAccountModalScope = {
                pageName: 'view',
                pageView: 'view',
                pageModal: 'viewuseraccountmodal',
            };
            $scope.deleteUserAccountModalScope = {
                deleteText: '是否确认删除?',
                confirm: true,
            };
            $scope.enableUserAccountModalScope = {
                deleteText: '是否确认启用?',
                confirm: true,
            };
            $scope.disableUserAccountModalScope = {
                deleteText: '是否确认禁用?',
                confirm: true,
            };
            $scope.setMainAccountModalScope = {
                deleteText: '是否确认转让主账号?',
                confirm: true,
            };

            //模态框弹框
            $scope.addUserGroup = function() {
                if ($rootScope.accessControl.org.add == 0) {
                    return;
                };
                if (!$scope.currentUserGroup || $scope.currentUserGroup.user_group_status == 2) {
                    return;
                }
                $scope.addUserGroupModalScope.selectUserGroupTree = [];
                $scope.Tree = [];
                $scope.addUserGroupModalScope.addUserGroupName = '';
                $scope.addUserGroupModalScope.currentUserGroup = $scope.currentUserGroup;
                $scope.addUserGroupModalScope.addUserGroupStatus = 2; //默认禁用
                $scope.addUserGroupModalScope.userGroupNameErr = false;
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '添加组织架构';
                        },
                        contents: {
                            scope: $scope.addUserGroupModalScope,
                            templateurl: './views/organize/usergroupmodal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    OrgServices.addUserGroup($scope.addUserGroupModalScope.addUserGroupName, $scope.addUserGroupModalScope.addUserGroupStatus, $scope.company_id, $scope.ugid).then(function(data) {
                                        $scope.getUserGroup();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                })
            };
            $scope.editUserGroup = function() {
                if($scope.currentUserGroup.level == 0){
                    return;
                }
                if ($rootScope.accessControl.org.edit == 0 || !$scope.currentUserGroup) {
                    return;
                };
                OrgServices.getSingleUserGroup($scope.ugid).then(function(data){
	                $scope.editUserGroupModalScope.addUserGroupName = data.user_group_name;
	                $scope.editUserGroupModalScope.addUserGroupStatus = data.user_group_status;
                })
                $scope.editUserGroupModalScope.setUserGroupNameBefore = '',
                $scope.editUserGroupModalScope.setUserGroupUgidBefore = '',
                $scope.editUserGroupModalScope.selectUserGroupTree = [];
                $scope.Tree = [];
                $scope.editUserGroupModalScope.currentUserGroup = $scope.currentUserGroup;
                $scope.editUserGroupModalScope.parentUserGroup = $scope.parentUserGroup;
                $scope.editUserGroupModalScope.userGroupNameErr = false;
                $scope.editUserGroupModalScope.showParentUserGroupBox = false;
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '编辑组织架构';
                        },
                        contents: {
                            scope: $scope.editUserGroupModalScope,
                            templateurl: './views/organize/usergroupmodal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                	var p_id = $scope.editUserGroupModalScope.setUserGroupUgidBefore || $scope.editUserGroupModalScope.parentUserGroup.ugid;
                                    OrgServices.editUserGroup($scope.ugid, $scope.editUserGroupModalScope.addUserGroupName,
                                        $scope.editUserGroupModalScope.addUserGroupStatus, p_id).then(function(data) {
                                        	$scope.getUserGroup();
                                        	$scope.currentUserGroup = data;
                                        	getParentInfo(data);
                                            $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                });
            };
            $scope.viewUserGroup = function() {
                if ($rootScope.accessControl.org.view == 0) {
                    return;
                };
                $scope.viewUserGroupModalScope.currentUserGroup = $scope.currentUserGroup;
                $scope.viewUserGroupModalScope.parentUserGroup = $scope.parentUserGroup || $scope.currentUserGroup;
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '查看组织架构';
                        },
                        contents: {
                            scope: $scope.viewUserGroupModalScope,
                            templateurl: './views/organize/viewmodal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {}
                            }
                        }
                    }
                })
            };
            $scope.deleteUserGroup = function() {
                if ($rootScope.accessControl.org.delete == 0) {
                    return
                };
                if (!$scope.currentUserGroup || $scope.currentUserGroup.level == 0) {
                    return;
                }
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '提示信息';
                        },
                        contents: {
                            scope: $scope.deleteUserGroupModalScope,
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    OrgServices.delUserGroup($scope.ugid).then(function(data) {
                                        $scope.getUserGroup();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    });
                                }
                            }
                        }
                    }
                })
            };


            //模态框
            $scope.addUserAccount = function() {
                if ($rootScope.accessControl.org.useradd == 0) {
                    return
                };
                if (!$scope.currentUserGroup || $scope.currentUserGroup.user_group_status == 2) {
                    return;
                }
                $scope.addUserAccountModalScope.selectUserAccountTree = [];
                $scope.addUserAccountModalScope.currentUserGroup = $scope.currentUserGroup;
                $scope.addUserAccountModalScope.user_group_name = $scope.currentUserGroup.user_group_name;
                $scope.addUserAccountModalScope.user_group_id = $scope.currentUserGroup.user_group_id;
                $scope.addUserAccountModalScope.addMobile = '';
                $scope.addUserAccountModalScope.addPassword = '';
                $scope.addUserAccountModalScope.addName = '';
                $scope.addUserAccountModalScope.addUseGroupId = '';
                $scope.addUserAccountModalScope.addRoleName = '';
                $scope.addUserAccountModalScope.addAccountStatus = 2;
                $scope.addUserAccountModalScope.mobileRegErr = false;
                $scope.addUserAccountModalScope.pwdRegErr = false;
                $scope.addUserAccountModalScope.initPwd = false;
                $scope.addUserAccountModalScope.showRolelist = false;
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '添加用户账号';
                        },
                        contents: {
                            scope: $scope.addUserAccountModalScope,
                            templateurl: './views/organize/useraccountmodal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    if ($scope.addUserAccountModalScope.addPassword) {
                                        $scope.addUserAccountModalScope.addPassword = md5.createHash($scope.addUserAccountModalScope.addPassword.toString());
                                    } else {
                                        $scope.addUserAccountModalScope.addPassword = md5.createHash('lm123456');
                                    }
                                    OrgServices.addChildAccount($scope.addUserAccountModalScope.addMobile, $scope.addUserAccountModalScope.addPassword, $scope.addUserAccountModalScope.addName,
                                        $scope.addUserAccountModalScope.addRoleId, $scope.ugid, $scope.addUserAccountModalScope.addAccountStatus).then(function(data) {
                                        $scope.getUserList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    });
                                }
                            }
                        }
                    }
                })
            };
            $scope.viewUserAccount = function(uuid) {
                if ($rootScope.accessControl.org.userview == 0) {
                    return
                };
                OrgServices.getSingleUserInfo(uuid).then(function(data) {
                    $scope.viewUserAccountModalScope.singleUserData = data;
                })
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '查看用户账号';
                        },
                        contents: {
                            scope: $scope.viewUserAccountModalScope,
                            templateurl: './views/organize/viewmodal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {}
                            }
                        }
                    }
                })
            };
            $scope.editUserAccount = function(uuid) {
                for (var i = 0; i < $scope.userList.length; i++) {
                    if (uuid == $scope.userList[i].uuid) {
                        var currentAccountInfo = $scope.userList[i];
                    }
                };
                $scope.editUserAccountModalScope.selectUserAccountTree = [];
                $scope.editUserAccountModalScope.addMobile = currentAccountInfo.mobile;
                $scope.editUserAccountModalScope.addPassword = 'defaultpwd';
                $scope.editUserAccountModalScope.addName = currentAccountInfo.name;
                if(currentAccountInfo.role_name == 'child'){
                    $scope.editUserAccountModalScope.addRoleName = '请选择所属角色';
                }else{
                    $scope.editUserAccountModalScope.addRoleName = currentAccountInfo.role_name;
                }
                $scope.editUserAccountModalScope.addRoleId = currentAccountInfo.role_id;
                $scope.editUserAccountModalScope.addAccountStatus = currentAccountInfo.status;
                $scope.editUserAccountModalScope.user_group_name = currentAccountInfo.user_group_name;
                $scope.editUserAccountModalScope.user_group_id = currentAccountInfo.user_group_id;
                $scope.editUserAccountModalScope.currentUserGroup = currentAccountInfo;
                $scope.editUserAccountModalScope.mobileRegErr = false;
                $scope.editUserAccountModalScope.pwdRegErr = false;
                $scope.editUserAccountModalScope.initPwd = false;
                $scope.editUserAccountModalScope.showRolelist = false;
                $scope.editUserAccountModalScope.showUserAccountBox = false;
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '编辑用户账号';
                        },
                        contents: {
                            scope: $scope.editUserAccountModalScope,
                            templateurl: './views/organize/useraccountmodal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    if ($scope.editUserAccountModalScope.addPassword == 'defaultpwd') {
                                        $scope.editUserAccountModalScope.addPassword = '';
                                    } else {
                                        $scope.editUserAccountModalScope.addPassword = md5.createHash($scope.editUserAccountModalScope.addPassword.toString())
                                    };
                                    var user_group_id = Number($scope.editUserAccountModalScope.user_group_id);
                                    OrgServices.editUserInfo(uuid, $scope.editUserAccountModalScope.addMobile, $scope.editUserAccountModalScope.addPassword,
                                        $scope.editUserAccountModalScope.addName, user_group_id, $scope.editUserAccountModalScope.addRoleId,
                                        $scope.editUserAccountModalScope.addAccountStatus).then(function(data) {
                                        $scope.getUserList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    })
                                }
                            }
                        }
                    }
                })
            };
            $scope.deleteUserAccount = function(uuid) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '提示信息';
                        },
                        contents: {
                            scope: $scope.deleteUserAccountModalScope,
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    OrgServices.delUserInfo(uuid).then(function(data) {
                                        var delIndex = _.findIndex($scope.userList, function(n) {
                                            return n.uuid == uuid
                                        });
                                        $scope.userList.splice(delIndex, 1);
                                        $scope.getUserList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    });
                                }
                            }
                        }
                    }
                })
            };
            $scope.enableUserAccount = function(uuid) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '提示信息';
                        },
                        contents: {
                            scope: $scope.enableUserAccountModalScope,
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    OrgServices.userStatus(uuid, 1).then(function(data) {
                                        $scope.getUserList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    });
                                }
                            }
                        }
                    }
                })
            };
            $scope.disableUserAccount = function(uuid) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '提示信息';
                        },
                        contents: {
                            scope: $scope.disableUserAccountModalScope,
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    OrgServices.userStatus(uuid, 2).then(function(data) {
                                        $scope.getUserList();
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    });
                                }
                            }
                        }
                    }
                })
            };
            $scope.setMainAccount = function(uuid) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribeBy: 'modal-body',
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'ms',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '提示信息';
                        },
                        contents: {
                            scope: $scope.setMainAccountModalScope,
                            templateurl: './views/modal/delete_modal.html',
                        },
                        footer: function() {
                            return {
                                submit: function() {
                                    OrgServices.setMainAccount(uuid).then(function(data) {
                                        growl.addErrorMessage("用户权限更改,请重新登录");
                                        $cookieStore.remove('access_token');
                                        $cookieStore.remove('refresh_token');
                                        $cookieStore.remove('username');
                                        $cookieStore.remove('company_id');
                                        $cookieStore.remove('role_id');
                                        $cookieStore.remove('module_id');
                                        $location.path('/login');
                                        $rootScope.$broadcast('promiseResult', { result: 'success', date: new Date() });
                                    },function(data){
                                        $rootScope.$broadcast('promiseResult', { result: 'fail', date: new Date() });
                                    });
                                }
                            }
                        }
                    }
                })
            };
        }
    ]);
});
