define(['../controllers', 'underscore'], function(controllers, _) {
    controllers.controller('OrgCtrl', ['$scope',
        "$rootScope",
        "$state",
        "growl",
        "md5",
        "$location",
        '$cookieStore',
        "$stateParams",
        "OrgServices",
        function($scope, $rootScope, $state, growl, md5, $location, $cookieStore, $stateParams, OrgServices) {
            /*
            $scope.key = "";
            $scope.pageIndex = 0;
            $scope.pageSize = 8;

            $scope.role_id = Number($cookieStore.get('role_id'));
            $scope.company_id = $cookieStore.get('company_id');
            $scope.userName = $cookieStore.get('username');
            $scope.is_main = $cookieStore.get('is_main');
            //默认搜索字段为null
            $scope.keyword = null;
            $scope.keyword_ugn = null;

            //显示组织架构用户组列表
            $scope.showUserGroupList = false;

            //初始密码
            $scope.initPwd = false;

            //弹出框
            //搜索为空提示框
            $scope.noSearchTips = false;
            //删除成功提示框
            $scope.showDelSuccess = false;
            //所属角色框
            $scope.showRolelist = false;
            $scope.showAccountUserGroupList = false;
            //所属组织列表框
            $scope.userGroupListBox = false;
            //组织架构
            $scope.showAddCompany = false;
            $scope.showEditCompany = false;
            $scope.showSeeCompany = false;
            $scope.showDelCompany = false;
            //用户列表
            $scope.showAddAccountBox = false;
            $scope.showSeeAccountBox = false;
            $scope.showEditAccountBox = false;
            $scope.showDelAccountBox = false;
            $scope.showSetMainAccountBox = false;
            $scope.showDisAccountBox = false;


            //添加组织架构组默认状态 :禁用
            $scope.addUserGroupStatus = 2;
            //默认当前用户组
            $scope.currentUserGroup = '';
            //
            $scope.addUserGroupName = '';

            // 组织架构左侧栏列表 tree-view
            $scope.tree = [];
            $scope.treeOptions = {
                textField: 'user_group_name',
                childrenField: 'childs',
                rootParentLevel: 0,
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
                textField: 'user_group_name',
                childrenField: 'childs',
                rootParentLevel: 0,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.selectedTreeItem = $item;
                    setUserGroup($item.$item.ugid, $item.$item.user_group_name);
                    $scope.user_group_list = false;
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                }
            };
            // 编辑用户账号 tree-view
            $scope.selectTree = [];
            $scope.selectTreeOptions = {
                itemExpendedLevel: function() {},
                textField: 'user_group_name',
                childrenField: 'childs',
                rootParentLevel: 0,
                canChecked: false,
                isLeafIconClass: 'fa fa-leaf', //末级icon
                notExpendIconClass: 'fa fa-plus-square', //未展开icon
                isExpendIconClass: 'fa fa-minus-square', //已展开icon
                itemClicked: function($item) {
                    $scope.selectedTreeItem = $item;
                    setAccountUserGroup($item.$item.ugid, $item.$item.user_group_name);
                    $scope.role_list = false;
                },
                itemCheckedChanged: function($item) {
                    //当canChecked为true时,input[checkbox]的点击事件
                }
            };
            var company_id = $cookieStore.get('company_id');
            $scope.getUserGroup = function() {
                $scope.tree = [];
                $scope.selectUserGroupTree = [];
                $scope.selectTree = [];
                OrgServices.userGroup(company_id, '').then(function(data) {
                    $scope.userGroupList = data.data;
                    //左侧栏列表
                    $scope.treeOptions.fixedToTree(angular.copy(data.data), $scope.tree);
                    $scope.treeOptions.itemExpendedLevel($scope.tree, 3);
                    //编辑组织架构 tree-view
                    $scope.selectUserGroupTreeOptions.fixedToTree(angular.copy(data.data), $scope.selectUserGroupTree);
                    $scope.selectUserGroupTreeOptions.itemExpendedLevel($scope.selectUserGroupTree, 3);
                    // 编辑用户账号 tree-view
                    $scope.selectTreeOptions.fixedToTree(angular.copy(data.data), $scope.selectTree);
                    $scope.selectTreeOptions.itemExpendedLevel($scope.selectTree, 3);
                });
            };
            $scope.getUserGroup();


            //获取组织架构用户组列表
            /*$scope.getUserGroup = function() {
                OrgServices.userGroup($scope.company_id, $scope.keyword_ugn).then(function(data) {
                    $scope.userGroupList = data.data;
                    $scope.getCurrentUserGroup($scope.userGroupList);
                });
            };*/
            /*

            //获取组织架构并获取对应用户列表
            $scope.getUserGroupUserList = function() {
                OrgServices.userGroup($scope.company_id, $scope.keyword_ugn).then(function(data) {
                    $scope.userGroupList = data.data;
                    //默认选中公司所在用户组
                    var default_user_group_id = $scope.currentUserGroup.ugid || $scope.userGroupList.ugid;
                    var default_user_group_name = $scope.currentUserGroup.user_group_name || $scope.userGroupList.user_group_name;
                    $scope.checkUgid(default_user_group_id, default_user_group_name);

                    $scope.loopUserGroup();
                });
            };
            $scope.getUserGroupUserList();
            //获取当前组的父级
            var getParentInfo = function(item) {
                var loopChilds = function(childs) {
                    var len = childs.length;
                    for (var i = 0; i < len; i++) {
                        if (item.p_id == childs[i].ugid) {
                            $scope.org = childs[i];
                        } else {
                            if (childs[i].childs) {
                                loopChilds(childs[i].childs);
                            }
                        }
                    }
                }
                if (item.p_id == $scope.userGroupList.ugid) {
                    $scope.org = $scope.userGroupList;
                } else {
                    if ($scope.userGroupList.childs) {
                        loopChilds($scope.userGroupList.childs);
                    }
                }
            };
            //获取当前用户组
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
            $scope.getCurrentUserGroup($scope.userGroupList);
            //遍历用户组列表
            $scope.loopUserGroupList = [];
            $scope.loopUserGroup = function() {
                $scope.loopUserGroupList.push({ ugid: $scope.userGroupList.ugid, user_group_name: $scope.userGroupList.user_group_name });
                var userGroupChilds = $scope.userGroupList.childs;
                $scope.loopUserGroupChilds = function(userGroupChilds) {
                    for (var i = 0; i < userGroupChilds.length; i++) {
                        $scope.loopUserGroupList.push({ ugid: userGroupChilds[i].ugid, user_group_name: userGroupChilds[i].user_group_name });
                        if (userGroupChilds[i].childs) {
                            $scope.loopUserGroupChilds(userGroupChilds[i].childs);
                        }
                    };
                };
                if (userGroupChilds != null) {
                    $scope.loopUserGroupChilds(userGroupChilds);
                }
            };
            //置值ugid
            $scope.checkUgid = function(ugid, ugname) {
                $scope.ugid = ugid;
                $scope.currUserGroupName = ugname;
                //获取当前组织架构组
                $scope.getCurrentUserGroup($scope.userGroupList);
                //获取当前组织架构用户组的所属组织(查看)
                //所属组织 $scope.org
                for (var i = 0; i < $scope.loopUserGroupList.length; i++) {
                    if ($scope.loopUserGroupList[i].ugid == $scope.currentUserGroup.p_id) {
                        $scope.org = $scope.loopUserGroupList[i];
                    }
                };
                //获取用户列表
                $scope.getUserList();
            };

            //弹出框
            //显示添加用户组弹出框
            $scope.showAddUserGroup = function() {
                if ($rootScope.accessControl.org.add == 0) {
                    return
                };
                if (!$scope.currentUserGroup || $scope.currentUserGroup.user_group_status == 2) {
                    return;
                }
                $scope.addUserGroupName = '';
                $scope.addUserGroupStatus = 2;
                $scope.showAddCompany = true;
                $scope.userGroupNameErr = false;
            };
            //添加用户组 ok
            $scope.addUserGroup = function(addUserGroupName, addUserGroupStatus) {
                //获取参数
                $scope.currCompany_id = $scope.currentUserGroup.company_id;

                OrgServices.addUserGroup(addUserGroupName, addUserGroupStatus, $scope.currCompany_id, $scope.ugid).then(function(data) {
                    //再次获取组织架构列表
                    OrgServices.userGroup($scope.company_id, $scope.keyword_ugn).then(function(data) {
                        $scope.userGroupList = data.data;
                    });

                    $scope.showAddCompany = false;
                });
            };

            //删除组织架构用户组 弹出框
            $scope.showDelUserGroup = function() {
                if ($rootScope.accessControl.org.delete == 0) {
                    return
                };
                if (!$scope.currentUserGroup || $scope.currentUserGroup.level == 0) {
                    return;
                }
                $scope.showDelCompany = true;
            };

            //删除组织架构用户组 ok
            $scope.delUserGroup = function() {
                OrgServices.delUserGroup($scope.ugid).then(function(data) {
                    $scope.showDelCompany = false;
                    $scope.showDelSuccess = true;
                    $scope.getUserGroup();
                }, function(error) {
                    $scope.showDelCompany = false;
                });
            };

            //修改组织架构用户组 弹出框
            $scope.showEditUserGroup = function() {
                $scope.user_group_list = false;
                $scope.userGroupNameErr = false;
                $scope.keyword_ugn = null;
                if ($rootScope.accessControl.org.edit == 0) {
                    return
                };
                if (!$scope.currentUserGroup) {
                    return;
                }

                $scope.currUserGroupName = $scope.currentUserGroup.user_group_name;
                // console.log($scope.currentUserGroup);
                $scope.setUserGroupNameBefore = '';
                $scope.currentUserGroupStatus = $scope.currentUserGroup.user_group_status;
                $scope.showEditCompany = true;
            };
            //修改组织架构用户组
            $scope.editUserGroup = function(currUserGroupName, currentUserGroupStatus) {
                $scope.currUserGroupPid = $scope.setUserGroupUgidBefore || $scope.currentUserGroup.p_id;
                $scope.currentUserGroupStatus = currentUserGroupStatus || $scope.currentUserGroup.user_group_status;
                $scope.currUserGroupName = currUserGroupName || $scope.currentUserGroup.user_group_name;
                OrgServices.editUserGroup($scope.ugid, $scope.currUserGroupName, $scope.currentUserGroupStatus, $scope.currUserGroupPid).then(function(data) {
                    var ugid = data.ugid;
                    var currUserGroup = _.find($scope.loopUserGroupList, function(n) {
                        return n.ugid == ugid
                    });
                    $scope.currentUserGroup = data;
                    // console.log(data);
                    getParentInfo(data);
                    $scope.getUserGroup();
                    $scope.showEditCompany = false;
                    $scope.setUserGroupName = $scope.setUserGroupNameBefore;
                    $scope.currentUserGroup.user_group_name = $scope.currUserGroupName;
                    $scope.currentUserGroupStatus = currentUserGroupStatus;

                }, function(data) {
                    //$scope.currUserGroupName = $scope.currUserGroupName;
                })
            };

            //修改所属组织
            //显示所属组织列表框
            $scope.showUserGroupListBox = function() {
                $scope.userGroupListBox = true;
            };
            //设置所属组织
            var setUserGroup = function(ugid, user_group_name) {
                $scope.setUserGroupNameBefore = user_group_name;
                $scope.setUserGroupUgidBefore = ugid;
                $scope.userGroupListBox = false;
            };

            //查看组织架构用户组 弹出框
            $scope.showSeeUserGroup = function() {
                if ($rootScope.accessControl.org.view == 0) {
                    return
                };
                if (!$scope.currentUserGroup) {
                    return;
                }
                $scope.showSeeCompany = true;
            };*/

            /*************************分割线*********************************/
            //右侧用户列表
            //获取用户列表
            /*
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
            $scope.setPage = function() {
                $scope.pageIndex = $scope.bigCurrentPage;
                $scope.pageIndex = $scope.pageSize * ($scope.pageIndex - 1);
                $scope.getUserList();
            };

            //获取角色列表
            $scope.getRoles = function() {
                OrgServices.getRoles($scope.company_id).then(function(data) {
                    $scope.rolesList = data;
                });
            };
            $scope.getRoles();

            //显示所属角色框
            $scope.showRoleListBox = function() {
                $scope.showRolelist = true;
            };

            //设置角色
            $scope.setAddRoleId = function(name, role_id) {
                $scope.addRoleName = name;
                $scope.addRoleId = role_id;
                $scope.showRolelist = false;
            };

            //编辑用户账号时 修改用户所属组织
            var setAccountUserGroup = function(user_group_id, name) {
                $scope.account_user_group_name = name;
                $scope.account_user_group_id = user_group_id;
                $scope.showAccountUserGroupList = false;
            };

            //添加用户
            $scope.addUser = function() {
                if ($rootScope.accessControl.org.useradd == 0) {
                    return
                };
                if (!$scope.currentUserGroup || $scope.currentUserGroup.user_group_status == 2) {
                    return;
                }
                $scope.showAddAccountBox = true;
                $scope.pwdRegErr = false;
                $scope.mobileRegErr = false;
                $scope.addMobile = '';
                $scope.addPassword = '';
                $scope.addName = '';
                $scope.addRoleName = '';
                $scope.addAccountStatus = 2;
            };
            $scope.addChildAccount = function(addMobile, addPassword, addName, addRoleId, addUserGroupId, addAccountStatus) {
                if(addPassword){
                    addPassword = md5.createHash(addPassword.toString());
                }else{
                    addPassword = md5.createHash('lm123456');
                }
                OrgServices.addChildAccount(addMobile, addPassword, addName, $scope.addRoleId, $scope.ugid, addAccountStatus).then(function(data) {
                    $scope.addUuid = data.uuid;
                    $scope.getUserList();
                    $scope.showAddAccountBox = false;
                });
            };
            //查看
            $scope.seeAccount = function(uuid) {
                if ($rootScope.accessControl.org.userview == 0) {
                    return
                };
                $scope.showSeeAccountBox = true;
                OrgServices.getSingleUserInfo(uuid).then(function(data) {
                    $scope.singleUserData = data;
                })
            };
            //编辑用户信息
            $scope.showEditAccount = function(uuid) {
                if ($rootScope.accessControl.org.useredit == 0) {
                    return
                };
                $scope.uuid = uuid;
                //初始化 所属组织的名称user_group_name和user_group_id
                $scope.account_user_group_name = '';
                $scope.account_user_group_id = '';
                //获取当前用户账号的信息
                $scope.currAccountInfo = _.find($scope.userList, function(n) {
                    return n.uuid === $scope.uuid
                });
                $scope.currAccountInfoStatus = $scope.currAccountInfo.status;
                $scope.currAccountInfoName = $scope.currAccountInfo.name;
                $scope.currAccountInfoMobile = $scope.currAccountInfo.mobile;
                $scope.currAccountInfoPassword = 'defaultpwd';
                $scope.currAccountInfoUgname = $scope.currAccountInfo.user_group_name;
                $scope.addRoleName = $scope.currAccountInfo.role_name;
                $scope.addRoleId = $scope.currAccountInfo.role_id;

                $scope.initPwd = false;
                $scope.pwdRegErr = false;
                $scope.mobileRegErr = false;
                $scope.showEditAccountBox = true;
            };
            $scope.editUser = function(mobile, password, name, user_group_name, user_group_id, addRoleName, status) {
                if (password == 'defaultpwd') {
                    password = '';
                } else {
                    password = md5.createHash(password.toString())
                }
                var user_group_id = Number(user_group_id || $scope.currAccountInfo.user_group_id);

                //获取所属组织 和所属组织id
                OrgServices.editUserInfo($scope.uuid, mobile, password, name, user_group_id, $scope.addRoleId, status).then(function(data) {
                    $scope.currAccountInfo.role_name = addRoleName;
                    $scope.currAccountInfo.name = name;
                    $scope.currAccountInfo.status = status;
                    $scope.getUserList();
                    $scope.showEditAccountBox = false;
                })
            };
            //禁用 弹出框
            $scope.showDisAccount = function(uuid, status) {
                if ($rootScope.accessControl.org.useredit == 0) {
                    return
                };
                $scope.uuid = uuid;
                if (status == 1) {
                    $scope.setStatus = 2;
                } else if (status == 2) {
                    $scope.setStatus = 1;
                }
                $scope.showDisAccountBox = true;
                $scope.currAccountInfo = _.find($scope.userList, function(n) {
                    return n.uuid === $scope.uuid
                });
            };
            //禁用
            $scope.disUser = function() {
                OrgServices.userStatus($scope.uuid, $scope.setStatus).then(function(data) {
                    //替换当前状态
                    $scope.currAccountInfo.status = $scope.setStatus;
                    $scope.showDisAccountBox = false;
                });
            };
            //删除账号弹框
            $scope.showDelAccount = function(uuid) {
                if ($rootScope.accessControl.org.userdelete == 0) {
                    return
                };
                $scope.uuid = uuid;
                $scope.showDelAccountBox = true;
            };
            //删除账号
            $scope.delAccount = function() {
                OrgServices.delUserInfo($scope.uuid).then(function(data) {
                    var delIndex = _.findIndex($scope.userList, function(n) {
                        return n.uuid == $scope.uuid
                    });
                    $scope.userList.splice(delIndex, 1);
                    $scope.getUserList();
                    console.log("userStatus", data);
                    $scope.showDelAccountBox = false;
                });
            };
            //显示设为主账号弹出框
            $scope.showMainAccount = function(uuid) {
                $scope.uuid = uuid;
                $scope.showSetMainAccountBox = true;
                $scope.currAccountInfo = _.find($scope.userList, function(n) {
                    return n.uuid === $scope.uuid
                });
            };
            //设为主账号
            $scope.setMainAccount = function() {
                OrgServices.setMainAccount($scope.uuid).then(function(data) {
                    $scope.currAccountInfo.role_name = 'main';
                    growl.addErrorMessage("用户权限更改,请重新登录");
                    $cookieStore.remove('access_token');
                    $cookieStore.remove('refresh_token');
                    $cookieStore.remove('username');
                    $cookieStore.remove('company_id');
                    $cookieStore.remove('role_id');
                    $cookieStore.remove('module_id');
                    $location.path('/login');
                    $scope.showSetMainAccountBox = false;
                    console.log("setMainAccount", data);
                });
            };

            //取消操作
            $scope.cancel = function() {
                $scope.showAddCompany = false;
                $scope.showEditCompany = false;
                $scope.showSeeCompany = false;
                $scope.showDelCompany = false;
                //用户列表
                $scope.showAddAccountBox = false;
                $scope.showSeeAccountBox = false;
                $scope.showEditAccountBox = false;
                $scope.showDelAccountBox = false;
                $scope.showSetMainAccountBox = false;
                $scope.showDisAccountBox = false;
                //
                $scope.showDelSuccess = false;
            };

            //手机号 密码格式 组织架构名称
            $scope.mobileRegErr = false;
            $scope.pwdRegErr = false;
            $scope.userGroupNameErr = false;

            //验证手机号
            $scope.validateMobile = function(addMobile) {
                var mobileReg = /^1[34578]\d{9}$/; //手机号验证
                if (!mobileReg.test(addMobile)) {
                    $scope.mobileRegErr = true;
                } else {
                    $scope.mobileRegErr = false;
                }
            };
            //密码格式验证
            $scope.validatePwd = function(addPassword) {
                var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$).{5,20}$/; //6-20位数字和字母组成
                if (!pwdReg.test(addPassword)) {
                    $scope.pwdRegErr = true;
                } else {
                    $scope.pwdRegErr = false;
                }
            };
            //组织架构名称验证
            $scope.validateUserGroupName = function(name) {
                var nameReg = /^[\s\S]*.{1,16}$/;
                if (!nameReg.test(name)) {
                    $scope.userGroupNameErr = true;
                } else {
                    $scope.userGroupNameErr = false;
                }
            };
            */

        }
    ]);
});
