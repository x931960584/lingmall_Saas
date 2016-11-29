define(['../controllers', 'underscore'], function(controllers, _) {
    controllers.controller('MainCtrl', ['$scope',
        "$rootScope",
        //'$attrs',
        "$state",
        "$location",
        '$cookieStore',
        "$stateParams",
        "MainServices",
        '$uibModal',
        'ConsoleServices',
        function($scope, $rootScope, $state, $location, $cookieStore, $stateParams, MainServices, $uibModal, ConsoleServices) {
            $scope.roleId = $cookieStore.get('role_id');
            $scope.companyId = $cookieStore.get('company_id');
            $scope.company_number = $cookieStore.get('company_number');
            $scope.userName = $cookieStore.get('username');
            $scope.isMain=$cookieStore.get('is_main');
            $scope.showSubIndex = null;
            $scope.showIndex = null;
            $scope.showChildrenList = true;
            $scope.linkTo = function(path, index, module_id) {
                if (path == '') {
                    return;
                }
                $state.go('main.' + path, {}, { reload: true });
            };
            $scope.linkToSub = function(path, index, module_id) {
                $state.go('main.' + path, {}, { reload: true });
            };

            //下拉框
            $scope.showDropdown = false;
            //退出
            $scope.logout = function() {
                $cookieStore.remove('access_token');
                $cookieStore.remove('refresh_token');
                $cookieStore.remove('username');
                $cookieStore.remove('company_id');
                $cookieStore.remove('company_number');
                $cookieStore.remove('role_id');
                $cookieStore.remove('module_id');
                $cookieStore.remove('is_main');
                $location.path('/login');
            };


            //公司信息
            var province, city, offset, limit;
            var provinceList = $cookieStore.get('citylist');
            //公司信息

            $scope.modaNew = {
                    id: $cookieStore.get('company_id'),
                    pageCom: '',
                    pageName: '',
                    mainCore: '',
                    // mainCoreList:[],
                    isMaincore: true,
                    provinces: provinceList,
                    isEmail:false,
                    //province: '选择省',
                    isProvice: true,
                    //city: '选择市',
                    isCity: true,
                    //districtName: '选择区',
                    isDistrict: true,
                    citys: [],
                    districts: [],
                    isMobile: false,
                    isOpenCity:true,
                    isOpenDistrict:true,
                    item: {
                        company_name: '',
                        main_category_id: '',
                        address_data: {
                            address_id: '',
                            province: '',
                            city: '',
                            district: '',
                            detail: ''
                        },
                        linkman: '',
                        phone_number: '',
                        email_address: ''
                    },
                    Clickprovince: function(name) {
                        $scope.modaNew.item.address_data.province = name;
                        $scope.modaNew.isProvice = false;
                        $scope.modaNew.isCity = true;
                        $scope.modaNew.item.address_data.city = '';
                        $scope.modaNew.isDistrict = true;
                        $scope.modaNew.item.address_data.district = '';
                        $scope.modaNew.districts = [];
                        $scope.modaNew.isOpenCity=false;
                        $scope.modaNew.isOpenDistrict=true;
                        province = name;
                        city = '';
                        ConsoleServices.CityClassily(province, city, offset, limit).then(function(data) {
                            $scope.modaNew.citys = data.list;

                        }, function(data) {

                        })
                    },
                    Clickcity: function(proName, cityName) {
                        $scope.modaNew.item.address_data.city = cityName;
                        $scope.modaNew.isCity = false;
                        $scope.modaNew.isDistrict = true;
                        $scope.modaNew.isOpenDistrict=false;
                        $scope.modaNew.item.address_data.district = '';
                        province = proName;
                        city = cityName;
                        ConsoleServices.CityClassily(province, city, offset, limit).then(function(data) {
                            $scope.modaNew.districts = data.list;

                        }, function(data) {

                        })

                    },
                    Clickdistrict: function(name) {
                        $scope.modaNew.item.address_data.district = name;
                        $scope.modaNew.isDistrict = false;
                    },
                    mobilePhone: function(tel) {
                        var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
                        if (reg.test(tel)) {
                            $scope.modaNew.isMobile = false;
                        } else {
                            $scope.modaNew.isMobile = true;
                        }
                        /*if(tel==null||tel==""){
                            $scope.modaNew.isMobile=false;
                        }*/
                    },
                    emailDress: function(temp) {
                        var myreg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                        if (myreg.test(temp)) {
                            $scope.modaNew.isEmail = false;
                        } else {
                            $scope.modaNew.isEmail = true;
                        }
                    },
                    ClickmainCore: function(name, id) {
                        $scope.modaNew.mainCore = name;
                        $scope.modaNew.item.main_category_id = id;
                        $scope.modaNew.isMaincore = false;
                    }
                }
                //公司详情
            var Comdetail = function() {
                ConsoleServices.CompanyDetail($scope.companyId).then(function(data) {
                    if (data.main_category_id == '' || data.main_category_id == null) {
                        $scope.modaNew.isMaincore=true;
                        $scope.modaNew.mainCore = '';
                        $scope.modaNew.item.main_category_id = '';
                    } else {
                        $scope.modaNew.isMaincore=false;
                        $scope.modaNew.mainCore = data.main_category.main_category_name;
                        $scope.modaNew.item.main_category_id = data.main_category_id;
                    };
                    if (data.address_id == '' || data.address_id == null) {
                        $scope.modaNew.isCity=true;
                        $scope.modaNew.isProvice=true;
                        $scope.modaNew.isDistrict=true;
                        $scope.modaNew.isOpenDistrict=true;
                        $scope.modaNew.isOpenCity=true;
                        $scope.modaNew.item.address_data.province = '';
                        $scope.modaNew.item.address_data.city = '';
                        $scope.modaNew.item.address_data.district = '';
                        $scope.modaNew.item.address_data.address_id = '';
                        $scope.modaNew.item.address_data.detail = '';
                        
                    } else {
                        $scope.modaNew.isCity=false;
                        $scope.modaNew.isProvice=false;
                        $scope.modaNew.isDistrict=false;
                        if($scope.isMain==0){
                            $scope.modaNew.isOpenDistrict=true;
                            $scope.modaNew.isOpenCity=true;
                        }else{
                            $scope.modaNew.isOpenDistrict=false;
                            $scope.modaNew.isOpenCity=false;
                        }
                        $scope.modaNew.item.address_data.province = data.address.province;
                        $scope.modaNew.item.address_data.city = data.address.city;
                        $scope.modaNew.item.address_data.district = data.address.district;
                        $scope.modaNew.item.address_data.address_id = data.address_id;
                        $scope.modaNew.item.address_data.detail = data.address.detail;
                        var province=data.address.province;
                        var city=data.address.city;
                        var city0='';
                        ConsoleServices.CityClassily(province, city0, offset, limit).then(function(data) {
                            $scope.modaNew.citys = data.list;

                        }, function(data) {

                        })
                        ConsoleServices.CityClassily(province, city, offset, limit).then(function(data) {
                            $scope.modaNew.districts = data.list;

                        }, function(data) {

                        })
                    };
                    $scope.modaNew.item.company_name = data.company_name;
                    $scope.modaNew.item.linkman = data.linkman;
                    $scope.modaNew.item.phone_number = data.phone_number;
                    $scope.modaNew.item.email_address = data.email_address;
                }, function(data) {

                })
            }
            
            //主营项目
            ConsoleServices.MainCategorys().then(function(data) {
                    $scope.modaNew.mainCoreList = data.list;
                }, function(data) {

                })
                //验证信息
            ConsoleServices.CompanyVerify($scope.companyId).then(function(data) {
                if (data.verify == 0 && $scope.isMain==1) {
                    Comdetail();
                    $scope.modalItem = $scope.modaNew;
                    $scope.modalItem.pageCom = 'company';
                    $scope.modalItem.pageName = 'view';
                    var modalInstance = $uibModal.open({
                        templateUrl: './views/modal/modal_tem.html',
                        controller: 'ModalInstanceCtrl',
                        size: 'md',
                        backdrop: 'static',
                        resolve: {
                            header: function() {
                                return '公司信息';
                            },
                            contents: {
                                scope: $scope.modalItem,
                                templateurl: './views/console/comModal.html',
                            },
                            footer: function() {
                                //submit:ConsoleServices.CompanyEdit()
                                var options = {
                                    submit: ConsoleServices.CompanyEdit,
                                    isList: function() {},
                                };
                                return options;
                            }
                        }
                    });
                }
            }, function(data) {

            })

            $scope.comPany = function() {
                if($scope.isMain==0){
                    $scope.modaNew.IsMain=true;
                    $scope.modaNew.pageView='view';
                    $scope.modaNew.pageName='view';
                }
                $scope.modalEditItem = $scope.modaNew;
                Comdetail();
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return '公司信息';
                        },
                        contents: {
                            scope: $scope.modalEditItem,
                            templateurl: './views/console/comModal.html',
                        },
                        footer: function() {
                                //submit:ConsoleServices.CompanyEdit()
                                var options = {
                                    submit: ConsoleServices.CompanyEdit,
                                    isList: function() {},
                                };
                                return options;
                            }
                    }
                });
            }




            //获取用户权限列表
            $scope.getRoleList = function() {
                MainServices.roleList($scope.roleId).then(function(data) {
                    console.log(data);
                    $scope.roleList = data;
                });
            };
            $scope.getRoleList();

            //左侧菜单栏 根据返回字段增加icon 和 url
            $scope.menuList = [{
                title: '',
                icon: '\ue62b',
                url: ''
            }, {
                title: '角色权限',
                icon: 'fa fa-ticket',
                url: 'permissions',
                subMenus: []
            }, {
                title: '组织架构',
                icon: 'fa fa-sitemap',
                url: 'org',
                subMenus: []
            }, {
                title: '商品管理',
                icon: '\ue621',
                url: '',
                subMenus: [{
                    title: '我的商品',
                    icon: '\ue60f',
                    url: 'mygoods'
                }, {
                    title: '品牌',
                    icon: '\ue610',
                    url: 'goodsbrand'
                }, {
                    title: '分类',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                }]
            }, {
                title: '订单管理',
                icon: '\ue600',
                url: '',
                subMenus: [{
                    title: '销售订单',
                    icon: '\ue610',
                    url: 'salesorder'
                }]
            }, {
                title: '活动管理',
                icon: '\ue600',
                url: '',
                subMenus: [{
                    title: '拼团活动',
                    icon: '\ue610',
                    url: 'activitylist'
                }, {
                    title: '拼团新增',
                    icon: '\ue610',
                    url: 'activityadd'
                }]
            }, {
                title: '财务管理',
                icon: '\ue600',
                url: '',
                subMenus: [{
                    title: '支付记录',
                    icon: '\ue610',
                    url: 'payrecord'
                }]
            }, {
                title: '库存管理',
                icon: '\ue600',
                url: '',
                subMenus: [{
                    title: '仓库管理',
                    icon: '\ue610',
                    url: 'warehouse'
                }, {
                    title: '商品入库',
                    icon: '\ue610',
                    url: 'outstock'
                }]
            },{
                title: '客户管理',
                icon: '\ue600',
                url: '',
                subMenus: [{
                    title: '我的客户',
                    icon: '\ue610',
                    url: 'clients'
                },{
                    title: '客户等级',
                    icon: '\ue610',
                    url: 'clientsrank'
                },{
                    title: '客户分类',
                    icon: '\ue610',
                    url: 'clientscategory'
                },{
                    title: '订货管控',
                    icon: '\ue610',
                    url: 'ordercontrol'
                },{
                    title: '销售区域',
                    icon: '\ue610',
                    url: 'regionalsales'
                }]
            }];
            /*以下演示用请勿删除*/
            /*$scope.menuList = [{
                title: '',
                icon: '\ue62b',
                url: ''
            }, {
                title: '角色权限',
                icon: 'fa fa-ticket',
                url: 'permissions',
                subMenus: []
            }, {
                title: '组织架构',
                icon: 'fa fa-sitemap',
                url: 'organize',
                subMenus: []
            }, {
                title: '商品管理',
                icon: '\ue621',
                url: '',
                subMenus: [{
                    title: '我的商品',
                    icon: '\ue60f',
                    url: 'mygoods'
                }, {
                    title: '品牌',
                    icon: '\ue610',
                    url: 'goodsbrand'
                }, {
                    title: '分类',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                }]
            }, {
                title: '库存管理',
                icon: '\ue621',
                url: '',
                subMenus: [{
                    title: '仓库管理',
                    icon: '\ue60f',
                    url: 'mygoods'
                }, {
                    title: '商品库存',
                    icon: '\ue610',
                    url: 'goodsbrand'
                }, {
                    title: '商品入库',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                },{
                    title: '其他入库',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                },{
                    title: '商品出库',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                },{
                    title: '其他出库',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                },{
                    title: '库存调拨',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                },{
                    title: '出入库明细',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                },{
                    title: '库存盘点',
                    icon: '\ue60a',
                    url: 'goodsclassify'
                }]
            }, {
                title: '我的客户',
                icon: '\ue621',
                url: '',
                subMenus: [{
                    title: '客户档案',
                    icon: '\ue60f',
                    url: 'mygoods'
                }, {
                    title: '渠道策略',
                    icon: '\ue610',
                    url: 'goodsbrand'
                }, {
                    title: '询价记录',
                    icon: '\ue610',
                    url: 'goodsbrand'
                },{
                    title: '报价记录',
                    icon: '\ue610',
                    url: 'goodsbrand'
                }
                ]
            }, {
                title: '我的供应商',
                icon: '\ue621',
                url: '',
                subMenus: [{
                    title: '供应商档案',
                    icon: '\ue60f',
                    url: 'mygoods'
                }, {
                    title: '询价记录',
                    icon: '\ue610',
                    url: 'goodsbrand'
                },
                {
                    title: '报价记录',
                    icon: '\ue610',
                    url: 'goodsbrand'
                }]
            }, {
                title: '系统管理',
                icon: '\ue621',
                url: '',
                subMenus: [{
                    title: '基础配置',
                    icon: '\ue60f',
                    url: 'mygoods'
                }, {
                    title: '数据字典',
                    icon: '\ue610',
                    url: 'goodsbrand'
                }]
            }, {
                title: '订单管理',
                icon: '\ue600',
                url: '',
                subMenus: [{
                    title: '销售订单',
                    icon: '\ue610',
                    url: 'saleorder'
                },{
                    title: '采购订单',
                    icon: '\ue610',
                    url: 'saleorder'
                }]
            }, {
                title: '活动管理',
                icon: '\ue600',
                url: '',
                subMenus: [{
                    title: '拼团活动',
                    icon: '\ue610',
                    url: 'activitylist'
                }, {
                    title: '拼团新增',
                    icon: '\ue610',
                    url: 'activityadd'
                }]
            }, {
                title: '财务管理',
                icon: '\ue600',
                url: '',
                subMenus: [{
                    title: '支付记录',
                    icon: '\ue610',
                    url: 'payrecord'
                },{
                    title: '收支明细',
                    icon: '\ue610',
                    url: 'payrecord'
                }]
            }];*/
        }
    ]);
});
